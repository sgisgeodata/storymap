// ==================================================
// 06. SGIS 교육서비스업 세부 업종 비교
// 주요 7개 업종 막대그래프 + 전체 33개 업종 펼쳐보기
// ==================================================
const industryChart = document.getElementById('industry-chart');
const industrySummary = document.getElementById('industry-summary');
const industryTableBody = document.getElementById('industry-table-body');
let industryDataPromise = null;
let industryData = null;

const FEATURED_INDUSTRY_CODES = [
  'P85501', // 일반 교과 학원
  'P85621', // 음악학원
  'P85612', // 기타 스포츠 교육기관
  'P85611', // 태권도 및 무술 교육기관
  'P85622', // 미술학원
  'P85669', // 기타 기술 및 직업훈련학원
  'P85701'  // 교육관련 자문 및 평가업
];

function industryText(tag, className, value) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = String(value);
  return element;
}

function industryCount(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function industryFormatCount(value) {
  return value === null ? '미조회' : value.toLocaleString('ko-KR');
}

function loadIndustryData() {
  if (industryDataPromise) return industryDataPromise;

  // 데이터 로딩 중 안내 문구 표시
  if (industryChart) {
    industryChart.textContent = '데이터를 불러오는 중입니다.';
  }
  
  industryDataPromise = fetch('data/education_industry_2024.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      if (data.company_count_status !== 'verified' || !Array.isArray(data.categories)) {
        throw new Error('사업체 수 검증 상태 또는 업종 목록을 확인하세요.');
      }
      industryData = data;
      renderIndustryChart();
      return data;
    })
    .catch(error => {
      industryDataPromise = null;
      industryChart.replaceChildren(industryText('p', 'industry-error',
        `업종 데이터를 불러올 수 없습니다: ${error.message}. data/education_industry_2024.json 파일을 확인하세요.`));
      console.error('교육서비스업 세부 업종 데이터 오류:', error);
    });
  return industryDataPromise;
}

// ==================================================
// 06-1. 지역별 주요 7개 업종 파이차트
// ==================================================

const INDUSTRY_PIE_COLORS = [
  '#FFE680', // 레몬 옐로우
  '#FFB48F', // 피치 오렌지
  '#B9A7F5', // 라이트 퍼플
  '#8FD3FF', // 스카이 블루
  '#B5E88C', // 애플 그린
  '#E2B4FF', // 라일락
  '#82E2E5'  // 아쿠아 블루
];

function renderIndustryPie(targetId, featured, regionKey) {

  const target = document.getElementById(targetId);
  if (!target) return;

  target.replaceChildren();

  // 미조회 값을 0으로 바꾸지 않고 제외
  const valid = featured.filter(item =>
    typeof item[regionKey] === 'number' &&
    Number.isFinite(item[regionKey]) &&
    item[regionKey] > 0
  );

  const total = valid.reduce(
    (sum, item) => sum + item[regionKey],
    0
  );

  if (total === 0) {
    target.textContent = '표시할 데이터가 없습니다.';
    return;
  }

  let current = 0;
  const segments = [];

  valid.forEach((item, index) => {

    const percent = item[regionKey] / total * 100;
    const next = current + percent;

    segments.push(
      `${INDUSTRY_PIE_COLORS[index % INDUSTRY_PIE_COLORS.length]} ${current}% ${next}%`
    );

    current = next;
  });

  const pie = document.createElement('div');
  pie.className = 'industry-pie';
  pie.style.background =
    `conic-gradient(${segments.join(', ')})`;

  pie.setAttribute('role', 'img');
  pie.setAttribute(
    'aria-label',
    `주요 업종 구성비: ${valid.map(item =>
      `${item.name} ${(item[regionKey] / total * 100).toFixed(1)}%`
    ).join(', ')}`
  );

  const legend = document.createElement('div');
  legend.className = 'industry-pie-legend';

  valid.forEach((item, index) => {

    const row = document.createElement('div');
    row.className = 'industry-pie-legend-row';

    const swatch = document.createElement('span');
    swatch.className = 'industry-pie-swatch';
    swatch.style.background =
      INDUSTRY_PIE_COLORS[index % INDUSTRY_PIE_COLORS.length];

    const label = document.createElement('span');
    label.textContent = item.name;

    const value = document.createElement('strong');
    value.textContent =
      `${(item[regionKey] / total * 100).toFixed(1)}%`;

    row.append(swatch, label, value);
    legend.append(row);
  });

  target.append(pie, legend);

  if (valid.length < featured.length) {
    const note = document.createElement('p');
    note.className = 'industry-pie-note';
    note.textContent =
      '일부 업종은 0개 또는 미조회로 구성비 계산에서 제외되었습니다.';
    target.append(note);
  }
}

function renderIndustryChart() {
  if (!industryData) return;
  const categories = industryData.categories.map(item => ({
    code: item.class_code,
    name: item.class_nm,
    mulgeum: industryCount(item['물금읍']?.corp_cnt),
    daechi: industryCount(item['대치4동']?.corp_cnt)
  }));
  const byCode = new Map(categories.map(item => [item.code, item]));
  const featured = FEATURED_INDUSTRY_CODES.map(code => byCode.get(code)).filter(Boolean);
  
  // 물금읍 파이차트
  renderIndustryPie(
    'industry-pie-mulgeum',
    featured,
    'mulgeum'
  );

  // 대치4동 파이차트
  renderIndustryPie(
    'industry-pie-daechi',
    featured,
    'daechi'
  );

  const maxCount = Math.max(1, ...featured.flatMap(item => [item.mulgeum ?? 0, item.daechi ?? 0]));

  const totals = industryData.totals || {};
  industrySummary.replaceChildren();
  [['물금읍', totals['물금읍']?.corp_cnt], ['대치4동', totals['대치4동']?.corp_cnt]].forEach(([name, count]) => {
    const box = industryText('div', 'industry-total', '');
    box.append(industryText('span', '', name),
      industryText('strong', '', count == null ? '미조회' : `${count.toLocaleString('ko-KR')}개`));
    industrySummary.append(box);
  });

  industryChart.replaceChildren();
  if (!featured.length) {
    industryChart.append(industryText('p', 'industry-error', '주요 업종 코드가 데이터와 일치하지 않습니다.'));
  }
  for (const item of featured) {
    const row = industryText('div', 'industry-row', '');
    row.append(industryText('div', 'industry-name', item.name));
    for (const [key, label] of [['mulgeum', '물금읍'], ['daechi', '대치4동']]) {
      const line = industryText('div', 'industry-bar-line', '');
      line.append(industryText('span', 'industry-region-name', label));
      const track = industryText('div', 'industry-track', '');
      const bar = industryText('div', `industry-bar industry-bar-${key}`, '');
      if (item[key] !== null) bar.style.width = `${(item[key] / maxCount) * 100}%`;
      track.append(bar);
      line.append(track, industryText('strong', 'industry-count', industryFormatCount(item[key])));
      row.append(line);
    }
    industryChart.append(row);
  }

  // 33개 전체 업종은 그래프 대신 펼쳐보기 표로 제공한다.
  industryTableBody.replaceChildren();
  const sorted = [...categories].sort((a, b) =>
    Math.max(b.mulgeum ?? -1, b.daechi ?? -1) - Math.max(a.mulgeum ?? -1, a.daechi ?? -1));
  for (const item of sorted) {
    const tr = document.createElement('tr');
    tr.append(industryText('th', '', item.name),
      industryText('td', '', industryFormatCount(item.mulgeum)),
      industryText('td', '', industryFormatCount(item.daechi)));
    tr.firstChild.scope = 'row';
    industryTableBody.append(tr);
  }
}

