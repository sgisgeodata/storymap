"""SGIS 2024 education-service detailed industry collector.
Run: python scripts/fetch_sgis.py
Keep .env private. Requires requests and python-dotenv.
"""
import csv
import json
import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / '.env')
BASE = 'https://sgisapi.mods.go.kr/OpenAPI3'
YEAR = '2024'
CLASS_DEG = '11'
EXPECTED = {'물금읍': 974, '대치4동': 852}
REGION_PATHS = {
    '물금읍': ['경상남도', '양산시', '물금읍'],
    '대치4동': ['서울특별시', '강남구', '대치4동'],
}
OUTPUT = ROOT / 'data'
session = requests.Session()
session.headers.update({'User-Agent': 'Education-Service-Storymap/1.0'})


def request_api(path, params, allow_no_results=False):
    try:
        response = session.get(BASE + path, params=params, timeout=30)
        response.raise_for_status()
        payload = response.json()
    except (requests.RequestException, ValueError) as exc:
        raise RuntimeError(f'API 연결/응답 오류 ({path}): {exc}') from exc
    err = str(payload.get('errCd'))
    if err != '0':
        if allow_no_results and err == '-100':
            return []
        raise RuntimeError(f'API 오류 ({path}): {err} / {payload.get("errMsg")}')
    return payload.get('result')


def rows(result):
    if isinstance(result, list):
        return result
    if isinstance(result, dict):
        for value in result.values():
            if isinstance(value, list):
                return value
    return []


def get_token():
    key = os.getenv('SGIS_CONSUMER_KEY', '').strip()
    secret = os.getenv('SGIS_CONSUMER_SECRET', '').strip()
    if not key or not secret:
        raise RuntimeError('프로젝트 루트 .env에 SGIS_CONSUMER_KEY와 SGIS_CONSUMER_SECRET를 입력하세요.')
    result = request_api('/auth/authentication.json', {
        'consumer_key': key, 'consumer_secret': secret
    })
    if not isinstance(result, dict) or not result.get('accessToken'):
        raise RuntimeError('인증 응답에 accessToken이 없습니다.')
    return result['accessToken']


def get_codes(token, region_path):
    parent_code = None
    for level, target in enumerate(region_path):
        params = {'accessToken': token}
        if parent_code is not None:
            params['cd'] = parent_code
        entries = rows(request_api('/addr/stage.json', params))
        matches = [r for r in entries if str(r.get('addr_name', '')).strip() == target]
        if len(matches) != 1:
            available = [f'{r.get("addr_name")}({r.get("cd")})' for r in entries]
            raise RuntimeError(f'행정구역 조회 실패: {" > ".join(region_path[:level + 1])}\n조회 가능한 지역: {available}')
        parent_code = str(matches[0]['cd'])
        print(f'  {" > ".join(region_path[:level + 1])}: {parent_code}')
    if len(parent_code) != 8:
        raise RuntimeError(f'최종 읍면동 코드가 8자리가 아닙니다: {parent_code}')
    return parent_code


def industry_children(token, parent_code=None):
    params = {'accessToken': token, 'class_deg': CLASS_DEG}
    if parent_code is not None:
        params['class_code'] = parent_code
    result = request_api('/stats/industrycode.json', params, allow_no_results=parent_code is not None)
    return rows(result)


def get_education_root(token):
    top = industry_children(token)
    matches = [r for r in top if str(r.get('class_nm', '')).strip() == '교육 서비스업']
    if len(matches) != 1:
        raise RuntimeError(f'교육 서비스업 대분류를 정확히 찾지 못했습니다: {top}')
    return matches[0]


def collect_industry_tree(token, root):
    """Traverse the official 5-level (1-2-1-1-1) industry code hierarchy.

    Six-character codes are terminal by specification, not by an undocumented
    API behavior. Unexpected self-results for shorter codes stop execution.
    """
    nodes = []
    leaves = []
    visited = set()

    def walk(item, depth, parent_code=None):
        code = str(item.get('class_code', '')).strip()
        name = str(item.get('class_nm', '')).strip()
        if not code or code in visited:
            raise RuntimeError(f'산업분류 코드가 없거나 중복/순환되었습니다: {code}')
        if depth > 4 or len(code) > 6:
            raise RuntimeError(f'공식 산업분류 최대 단계 초과: {code} (depth={depth})')
        visited.add(code)

        # The API documentation defines at most 6 characters / 5 levels.
        # Do not call the child endpoint for a terminal six-character code.
        if len(code) == 6:
            children = []
        else:
            children = industry_children(token, code)
            returned_codes = [str(c.get('class_code', '')).strip() for c in children]
            if code in returned_codes:
                raise RuntimeError(
                    f'6자리 미만 코드의 하위 조회에 자기 자신이 포함됨: '
                    f'{code}, 응답={returned_codes}. API 동작 확인 필요'
                )
            for child_code in returned_codes:
                if not child_code.startswith(code) or len(child_code) <= len(code):
                    raise RuntimeError(
                        f'예상하지 못한 하위 산업분류 코드: 상위={code}, 하위={child_code}'
                    )

        node = {
            'class_code': code, 'class_nm': name,
            'parent_code': parent_code, 'depth': depth,
            'child_codes': [str(c.get('class_code', '')) for c in children],
        }
        nodes.append(node)
        print(f'  {"  " * depth}{code} {name} (하위 {len(children)}개)')
        if not children:
            leaves.append(node)
        else:
            for child in children:
                walk(child, depth + 1, code)

    walk(root, 0)
    return nodes, leaves


def count_value(value):
    if value is None or str(value).strip() in ('', '-', 'N/A', 'null'):
        return None
    try:
        return int(str(value).replace(',', ''))
    except ValueError:
        return None


def company_stats(token, adm_cd, class_code):
    result = request_api('/stats/company.json', {
        'accessToken': token, 'year': YEAR, 'adm_cd': adm_cd,
        'low_search': '0', 'class_code': class_code,
    }, allow_no_results=True)
    entries = rows(result)
    exact = [r for r in entries if str(r.get('adm_cd', '')) == adm_cd]
    if not exact and not entries:
        return {'corp_cnt': None, 'tot_worker': None, 'missing': True}
    if len(exact) != 1:
        raise RuntimeError(f'사업체 응답 행정구역 불일치: adm_cd={adm_cd}, class_code={class_code}, result={entries}')
    return {'corp_cnt': count_value(exact[0].get('corp_cnt')),
            'tot_worker': count_value(exact[0].get('tot_worker')),
            'missing': False}


def main():
    print('[1/5] SGIS 인증')
    token = get_token()
    print('  인증 성공 (토큰은 출력하지 않음)')

    print('[2/5] 읍면동 코드 조회')
    codes = {name: get_codes(token, path) for name, path in REGION_PATHS.items()}

    print('[3/5] 제11차 교육 서비스업 세부 산업분류 탐색')
    root = get_education_root(token)
    nodes, leaves = collect_industry_tree(token, root)
    print(f'  총 {len(nodes)}개 분류 노드, 말단 {len(leaves)}개 업종')
    if len(leaves) < 2:
        print('  [주의] 세부 업종이 2개 미만입니다. API 분류 깊이를 확인해야 합니다.')

    print('[4/5] 사업체 수/종사자 수 조회')
    records = []
    for leaf in leaves:
        record = {k: leaf[k] for k in ('class_code', 'class_nm', 'parent_code', 'depth')}
        for name, adm_cd in codes.items():
            record[name] = company_stats(token, adm_cd, leaf['class_code'])
        records.append(record)
        print(f'  {leaf["class_code"]} {leaf["class_nm"]}: '
              f'물금읍={record["물금읍"]["corp_cnt"]}, 대치4동={record["대치4동"]["corp_cnt"]}')

    root_code = str(root['class_code'])
    totals = {name: company_stats(token, adm_cd, root_code) for name, adm_cd in codes.items()}
    validation = {}
    for name in codes:
        total = totals[name]['corp_cnt']
        company_values = [r[name]['corp_cnt'] for r in records]
        company_known = [v for v in company_values if v is not None]
        company_missing = [r['class_code'] for r in records if r[name]['corp_cnt'] is None]
        company_sum = sum(company_known)
        company_matches = (total is not None and company_sum == total)
        company_verified = (total == EXPECTED[name] and company_matches)

        worker_total = totals[name]['tot_worker']
        worker_values = [r[name]['tot_worker'] for r in records]
        worker_known = [v for v in worker_values if v is not None]
        worker_missing = [r['class_code'] for r in records if r[name]['tot_worker'] is None]
        worker_sum = sum(worker_known)
        worker_matches = (worker_total is not None and worker_sum == worker_total)
        # Worker totals with missing leaves cannot be fully verified solely by summing
        # the available leaf values, even if the numerical totals happen to match.
        worker_verified = worker_matches and not worker_missing

        validation[name] = {
            'expected_from_storymap': EXPECTED[name],
            'api_education_total': total,
            'leaf_category_sum': company_sum,
            'all_leaf_categories_numeric': not company_missing,
            'missing_company_category_codes': company_missing,
            'matches_existing_storymap': total == EXPECTED[name],
            'matches_leaf_category_sum': company_matches,
            'company_count_verified': company_verified,
            'company_count_note': (
                '조회된 세부 업종 합계가 대분류 합계와 일치함. '
                'None은 원본에 유지하며 0으로 확정하지 않음.'
            ),
            'api_education_worker_total': worker_total,
            'leaf_worker_sum_known': worker_sum,
            'missing_worker_category_codes': worker_missing,
            'matches_worker_category_sum': worker_matches,
            'worker_count_verified': worker_verified,
            'worker_count_status': (
                'verified' if worker_verified else
                'needs_review_missing_values' if worker_missing else
                'needs_review_sum_mismatch'
            ),
        }
        print(f'  {name} 사업체: 기존={EXPECTED[name]}, API 대분류={total}, '
              f'조회값 합계={company_sum}, None={len(company_missing)}개, '
              f'검증={"통과" if company_verified else "미통과"}')
        print(f'  {name} 종사자: API 대분류={worker_total}, '
              f'조회값 합계={worker_sum}, None={len(worker_missing)}개, '
              f'검증={"통과" if worker_verified else "추가 확인 필요"}')

    company_verified_all = (len(leaves) >= 2 and all(
        v['company_count_verified'] for v in validation.values()))
    worker_verified_all = (len(leaves) >= 2 and all(
        v['worker_count_verified'] for v in validation.values()))
    report = {
        'year': int(YEAR), 'class_deg': int(CLASS_DEG),
        'source': 'SGIS 전국사업체조사 API',
        'classification': {'class_code': root_code, 'class_nm': root['class_nm']},
        'regions': [{'name': name, 'adm_cd': code} for name, code in codes.items()],
        'totals': totals, 'industry_tree': nodes, 'categories': records,
        'validation': validation,
        'company_count_status': 'verified' if company_verified_all else 'needs_review',
        'worker_count_status': 'verified' if worker_verified_all else 'needs_review',
        'status': 'verified_company_counts' if company_verified_all else 'needs_review',
        'data_notes': [
            'None은 원본 API 조회값의 부재를 뜻하며 0으로 변환하지 않았음.',
            '사업체 수 검증은 숫자로 확인된 말단 업종의 합계와 대분류 합계 비교임.',
            '종사자 수는 별도 검증하며 결측이 있는 경우 완전 검증으로 표시하지 않음.',
        ],
    }
    print('[5/5] 결과 파일 저장')
    OUTPUT.mkdir(parents=True, exist_ok=True)
    review_json = OUTPUT / 'education_industry_2024_review.json'
    review_json.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    review_csv = OUTPUT / 'education_industry_2024_review.csv'
    with review_csv.open('w', encoding='utf-8-sig', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['class_code', 'class_nm', 'depth', '물금읍_사업체수',
                         '대치4동_사업체수', '물금읍_종사자수', '대치4동_종사자수'])
        for r in records:
            writer.writerow([r['class_code'], r['class_nm'], r['depth'],
                             r['물금읍']['corp_cnt'], r['대치4동']['corp_cnt'],
                             r['물금읍']['tot_worker'], r['대치4동']['tot_worker']])
    print(f'  검토 JSON: {review_json.relative_to(ROOT)}')
    print(f'  검토 CSV: {review_csv.relative_to(ROOT)}')
    public_path = OUTPUT / 'education_industry_2024.json'
    if company_verified_all:
        public_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
        print(f'  사업체 수 검증 통과. 공개용 JSON: {public_path.relative_to(ROOT)}')
        if not worker_verified_all:
            print('  [주의] 종사자 수는 별도 검증 미완료. 공개용 JSON의 worker_count_status 확인 필요')
    else:
        print('  사업체 수 검증 미통과: 검토 파일을 확인하세요.')
        if public_path.exists():
            print('  기존 공개용 JSON은 삭제하지 않았습니다. 이전 데이터일 수 있으니 확인하세요.')


if __name__ == '__main__':
    try:
        main()
    except (RuntimeError, requests.RequestException) as exc:
        print(f'\n[오류] {exc}', file=sys.stderr)
        sys.exit(1)
