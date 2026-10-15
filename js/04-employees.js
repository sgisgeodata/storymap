// ==================================================
// 07. 사업체 수와 종사자 수 비교
// ==================================================
// 06번과 동일한 SGIS API 수집 JSON을 재사용
async function renderEmployeesChart() {
  const target = document.getElementById('employees-chart');
  if (!target || target.dataset.rendered === 'true') return;
  target.textContent = '데이터를 불러오는 중입니다.';

  try {
    const source = await loadIndustryData();
    if (!source || !source.totals) throw new Error('전체 집계 데이터가 없습니다.');

    const regionSpecs = [
      { id: 'mulgeum', name: '물금읍' },
      { id: 'daechi', name: '대치4동' }
    ];
    const data = regionSpecs.map(region => {
      const total = source.totals[region.name];
      const establishments = total?.corp_cnt;
      const employees = total?.tot_worker;
      if (!Number.isFinite(establishments) || establishments <= 0 ||
          !Number.isFinite(employees) || employees < 0 || total?.missing === true) {
        throw new Error(`${region.name} 전체 집계의 사업체 수 또는 종사자 수가 유효하지 않습니다.`);
      }
      return { ...region, establishments, employees, average: employees / establishments };
    });
    const [mulgeum, daechi] = data;
    const format = (value, digits = 0) => value.toLocaleString('ko-KR', {
      minimumFractionDigits: digits, maximumFractionDigits: digits
    });
    const specs = [
      { title: '교육서비스업 사업체 수', key: 'establishments', unit: '개', digits: 0 },
      { title: '교육서비스업 종사자 수', key: 'employees', unit: '명', digits: 0 },
      { title: '사업체당 평균 종사자 수', key: 'average', unit: '명/개', digits: 2 }
    ];
    target.replaceChildren();
    for (const spec of specs) {
      const section = document.createElement('section');
      section.className = 'employees-chart-group';
      section.append(industryText('h4', '', spec.title));
      const maximum = Math.max(1, ...data.map(item => item[spec.key]));
      for (const item of data) {
        const line = document.createElement('div');
        line.className = 'employees-bar-row';
        const track = document.createElement('div');
        track.className = 'employees-bar-track';
        const bar = document.createElement('div');
        bar.className = `employees-bar employees-bar-${item.id}`;
        bar.style.width = `${item[spec.key] / maximum * 100}%`;
        track.append(bar);
        line.append(industryText('span', '', item.name), track,
          industryText('strong', '', `${format(item[spec.key], spec.digits)}${spec.unit}`));
        section.append(line);
      }
      target.append(section);
    }

    const metrics = document.getElementById('employees-metrics');
    metrics.replaceChildren();
    for (const item of data) {
      const box = industryText('div', 'employees-metric', '');
      box.append(industryText('span', '', `${item.name} · 종사자 수`),
        industryText('strong', '', `${format(item.employees)}명`),
        industryText('span', '', `${format(item.establishments)}개 사업체`));
      metrics.append(box);
    }

    const establishmentDifference = mulgeum.establishments - daechi.establishments;
    const employeeDifference = mulgeum.employees - daechi.employees;
    const avgLeader = mulgeum.average === daechi.average ? null :
      (mulgeum.average > daechi.average ? mulgeum : daechi);
    const avgFollower = avgLeader === mulgeum ? daechi : mulgeum;
    const compare = (difference, unit) => difference === 0 ? `두 지역이 같습니다` :
      `${difference > 0 ? '물금읍' : '대치4동'}이 ${format(Math.abs(difference))}${unit} 더 많습니다`;
    const insight = document.getElementById('employees-insight-text');
    insight.textContent = `사업체 수는 ${compare(establishmentDifference, '개')}. ` +
      `종사자 수는 ${compare(employeeDifference, '명')}. ` +
      (avgLeader ? `사업체당 평균 종사자 수는 ${avgLeader.name} ${format(avgLeader.average, 2)}명, ` +
        `${avgFollower.name} ${format(avgFollower.average, 2)}명으로 ${avgLeader.name}이 더 높습니다.` :
        `사업체당 평균 종사자 수는 두 지역이 같습니다.`);

    const reviewNote = document.getElementById('employees-review-note');
    reviewNote.textContent = source.worker_count_status === 'verified' ? '' :
      '※ 종사자 수는 기존 JSON의 교육서비스업 전체 집계값을 사용했습니다. 세부 업종 종사자 수와의 합계 대조는 검증 미완료 상태입니다.';
    target.dataset.rendered = 'true';
  } catch (error) {
    target.replaceChildren(industryText('p', 'employees-error', `07번 데이터를 표시할 수 없습니다: ${error.message}`));
    document.getElementById('employees-metrics')?.replaceChildren();
    document.getElementById('employees-insight-text').textContent = '데이터를 확인한 후 결과를 표시합니다.';
    console.error('07번 종사자 수 데이터 오류:', error);
  }
}
