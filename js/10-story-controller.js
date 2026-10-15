// ==================================================
// 모바일: 활성 카드 바로 아래로 기존 지도 패널 이동
// ==================================================

const storyMapPanel = document.querySelector('.story-map-panel');

// PC에서 지도가 있던 원래 위치를 기억
const storyMapHome = document.createComment(
  'story-map-original-position'
);

storyMapPanel.parentNode.insertBefore(
  storyMapHome,
  storyMapPanel
);

const mobileStoryQuery = window.matchMedia(
  '(max-width: 900px)'
);

function placeStoryMapPanel(stepName) {

  if (mobileStoryQuery.matches) {

    const card = document.querySelector(
      `.story-step[data-step="${stepName}"]`
    );

    if (card && card.nextElementSibling !== storyMapPanel) {

      card.insertAdjacentElement(
        'afterend',
        storyMapPanel
      );
    }

  } else if (storyMapHome.nextSibling !== storyMapPanel) {

    // PC로 돌아오면 지도를 원래 오른쪽 영역에 복귀
    storyMapHome.parentNode.insertBefore(
      storyMapPanel,
      storyMapHome.nextSibling
    );
  }

  // 지도 컨테이너 위치가 변경되면 Leaflet 크기 재계산
  requestAnimationFrame(() => {
    storyDaechiMap.invalidateSize({ pan: false });
    storyMulgeumMap.invalidateSize({ pan: false });
  });
}

// ==================================================
// 4. 스토리 단계 전환
//    스크롤 + 카드 클릭
// ==================================================

// ==================================================
// 카드 전환 시 지도 초점 초기화
// ==================================================

// 행정구역 경계 저장
const storyRegionBounds = {
  daechi: null,
  mulgeum: null
};

// 대치4동 경계 불러오기
fetch('data/daechi4_boundary.geojson')
  .then(response => response.json())
  .then(data => {
    storyRegionBounds.daechi = L.geoJSON(data).getBounds();
  });

// 물금읍 경계 불러오기
fetch('data/mulgeum_boundary.geojson')
  .then(response => response.json())
  .then(data => {
    storyRegionBounds.mulgeum = L.geoJSON(data).getBounds();
  });

// 두 지도 초점 초기화
function resetStoryMapView() {

  if (storyRegionBounds.daechi) {
    storyDaechiMap.fitBounds(
      storyRegionBounds.daechi,
      {
        padding: [20, 20],
        animate: true
      }
    );
  }

  if (storyRegionBounds.mulgeum) {
    storyMulgeumMap.fitBounds(
      storyRegionBounds.mulgeum,
      {
        padding: [20, 20],
        animate: true
      }
    );
  }
}

const storySteps = document.querySelectorAll('.story-step');


// --------------------------------------------------
// 단계에 따라 지도 레이어 변경
// --------------------------------------------------

// 현재 지도에 표시 중인 스토리 단계
let currentStoryStep = null;

function showStoryStep(stepName) {

  // 같은 단계라면 지도 레이어를 다시 그리지 않음
  if (currentStoryStep === stepName) return;

  currentStoryStep = stepName;

  // 06번 카드에서는 지도 대신 업종별 비교 그래프 표시
  const industryActive = stepName === 'industry';
  const employeesActive = stepName === 'employees';
  storyMapPanel.classList.toggle('industry-active', industryActive);
  storyMapPanel.classList.toggle('employees-active', employeesActive);
  document.getElementById('industry-panel').hidden = !industryActive;
  document.getElementById('employees-panel').hidden = !employeesActive;
  if (industryActive) loadIndustryData();
  if (employeesActive) renderEmployeesChart();

  // 모바일에서는 현재 카드 아래로 지도 이동
  placeStoryMapPanel(stepName);

  // 일반 카드에서는 행정동 경계로 초점 초기화
  // 05번은 선택된 학원 표시 범위에 맞춰 별도 설정
  if (stepName !== 'academy') {
    resetStoryMapView();
  }

  // 다른 단계로 이동하면 도보권 숨김
  // storyDaechiMap.removeLayer(daechiWalkingLayers);
  // storyMulgeumMap.removeLayer(mulgeumWalkingLayers);
  // 다른 단계로 이동하면 모든 도보권 숨김
  [5, 10].forEach(minutes => {
    storyDaechiMap.removeLayer(walkingLayers.daechi[minutes]);
    storyMulgeumMap.removeLayer(walkingLayers.mulgeum[minutes]);
  });

  // 04번 카드에서만 도보권 버튼 표시
  const isWalking = stepName === 'walking';

  daechiWalkingControl.style.display =
    isWalking ? 'flex' : 'none';

  mulgeumWalkingControl.style.display =
    isWalking ? 'flex' : 'none';

  // 05번 카드에서만 학원 버튼 표시
  const isAcademy = stepName === 'academy';

  daechiAcademyControl.style.display =
    isAcademy ? 'flex' : 'none';

  mulgeumAcademyControl.style.display =
    isAcademy ? 'flex' : 'none';

  // 다른 단계로 이동할 때 학원 레이어 제거
  storyDaechiMap.removeLayer(daechiAcademyLayers);
  storyDaechiMap.removeLayer(gangnamAcademyLayers);

  storyMulgeumMap.removeLayer(mulgeumAcademyLayers);
  storyMulgeumMap.removeLayer(yangsanAcademyLayers);

  // 모든 카드 강조 해제
  storySteps.forEach(step => {
    step.classList.remove('active');
  });

  // 현재 카드 강조
  const activeStep = document.querySelector(
    `.story-step[data-step="${stepName}"]`
  );

  if (activeStep) {
    activeStep.classList.add('active');
  }

  // 05번 카드 재진입 시 지도 초점 재설정
  if (stepName === 'academy') {
    requestAnimationFrame(() => {
      storyDaechiMap.invalidateSize({ pan: false });
      storyMulgeumMap.invalidateSize({ pan: false });

      applyAcademyView('daechi');
      applyAcademyView('mulgeum');
    });
  }


  // 06. 업종 비교: 다른 단계에서 사용한 지도 레이어 제거
  if (stepName === 'industry') {
    [daechiPopulationLayer, daechiSchoolAgeLayer, daechiSchoolLayers].forEach(layer => {
      if (layer) storyDaechiMap.removeLayer(layer);
    });
    [mulgeumPopulationLayer, mulgeumSchoolAgeLayer, mulgeumSchoolLayers].forEach(layer => {
      if (layer) storyMulgeumMap.removeLayer(layer);
    });
  }

  // ------------------------------------------
  // 01. 총인구
  // ------------------------------------------

  if (stepName === 'population') {

    // 학교 레이어 제거
    storyDaechiMap.removeLayer(daechiSchoolLayers);
    storyMulgeumMap.removeLayer(mulgeumSchoolLayers);

    // 학령인구 제거
    if (
      daechiSchoolAgeLayer &&
      storyDaechiMap.hasLayer(daechiSchoolAgeLayer)
    ) {
      storyDaechiMap.removeLayer(daechiSchoolAgeLayer);
    }

    if (
      mulgeumSchoolAgeLayer &&
      storyMulgeumMap.hasLayer(mulgeumSchoolAgeLayer)
    ) {
      storyMulgeumMap.removeLayer(mulgeumSchoolAgeLayer);
    }


    // 총인구 표시
    if (
      daechiPopulationLayer &&
      !storyDaechiMap.hasLayer(daechiPopulationLayer)
    ) {
      daechiPopulationLayer.addTo(storyDaechiMap);
    }

    if (
      mulgeumPopulationLayer &&
      !storyMulgeumMap.hasLayer(mulgeumPopulationLayer)
    ) {
      mulgeumPopulationLayer.addTo(storyMulgeumMap);
    }


    updateLegend('population');
  }


  // ------------------------------------------
  // 02. 학령인구
  // ------------------------------------------

  if (stepName === 'school-age') {

    // 학교 레이어 제거
    storyDaechiMap.removeLayer(daechiSchoolLayers);
    storyMulgeumMap.removeLayer(mulgeumSchoolLayers);

    // 총인구 제거
    if (
      daechiPopulationLayer &&
      storyDaechiMap.hasLayer(daechiPopulationLayer)
    ) {
      storyDaechiMap.removeLayer(daechiPopulationLayer);
    }

    if (
      mulgeumPopulationLayer &&
      storyMulgeumMap.hasLayer(mulgeumPopulationLayer)
    ) {
      storyMulgeumMap.removeLayer(mulgeumPopulationLayer);
    }


    // 학령인구 표시
    if (
      daechiSchoolAgeLayer &&
      !storyDaechiMap.hasLayer(daechiSchoolAgeLayer)
    ) {
      daechiSchoolAgeLayer.addTo(storyDaechiMap);
    }

    if (
      mulgeumSchoolAgeLayer &&
      !storyMulgeumMap.hasLayer(mulgeumSchoolAgeLayer)
    ) {
      mulgeumSchoolAgeLayer.addTo(storyMulgeumMap);
    }


    updateLegend('school-age');
  }

  
  // 03. 학교
  if (stepName === 'school') {
    // 총인구 제거
    if (daechiPopulationLayer) {
      storyDaechiMap.removeLayer(daechiPopulationLayer);
    }
    if (mulgeumPopulationLayer) {
      storyMulgeumMap.removeLayer(mulgeumPopulationLayer);
    }

    // 학령인구 제거
    if (daechiSchoolAgeLayer) {
      storyDaechiMap.removeLayer(daechiSchoolAgeLayer);
    }
    if (mulgeumSchoolAgeLayer) {
      storyMulgeumMap.removeLayer(mulgeumSchoolAgeLayer);
    }

    // 학교 표시
    daechiSchoolLayers.addTo(storyDaechiMap);
    mulgeumSchoolLayers.addTo(storyMulgeumMap);

    updateLegend('school');
  }

  // 05. 학원·교습소
  if (stepName === 'academy') {

    // 총인구 레이어 제거
    if (daechiPopulationLayer) {
      storyDaechiMap.removeLayer(daechiPopulationLayer);
    }

    if (mulgeumPopulationLayer) {
      storyMulgeumMap.removeLayer(mulgeumPopulationLayer);
    }

    // 학령인구 레이어 제거
    if (daechiSchoolAgeLayer) {
      storyDaechiMap.removeLayer(daechiSchoolAgeLayer);
    }

    if (mulgeumSchoolAgeLayer) {
      storyMulgeumMap.removeLayer(mulgeumSchoolAgeLayer);
    }

    // 초·중·고 학교 레이어 제거
    storyDaechiMap.removeLayer(daechiSchoolLayers);
    storyMulgeumMap.removeLayer(mulgeumSchoolLayers);

    // 학원·교습소 레이어 표시
    // daechiAcademyLayers.addTo(storyDaechiMap);
    // mulgeumAcademyLayers.addTo(storyMulgeumMap);

    // 선택된 표시 범위에 따라 학원 표시
    if (academyView.daechi === 'all') {
      gangnamAcademyLayers.addTo(storyDaechiMap);
    }
    daechiAcademyLayers.addTo(storyDaechiMap);

    if (academyView.mulgeum === 'all') {
      yangsanAcademyLayers.addTo(storyMulgeumMap);
    }
    mulgeumAcademyLayers.addTo(storyMulgeumMap);

    // 범례 변경
    updateLegend('academy');

  }

  // 04. 학교 도보 접근성
  if (stepName === 'walking') {

    // 기존 인구 및 학령인구 숨김
    if (daechiPopulationLayer) {
      storyDaechiMap.removeLayer(daechiPopulationLayer);
    }

    if (mulgeumPopulationLayer) {
      storyMulgeumMap.removeLayer(mulgeumPopulationLayer);
    }

    if (daechiSchoolAgeLayer) {
      storyDaechiMap.removeLayer(daechiSchoolAgeLayer);
    }

    if (mulgeumSchoolAgeLayer) {
      storyMulgeumMap.removeLayer(mulgeumSchoolAgeLayer);
    }

    // 학교와 도보권 표시
    // daechiWalkingLayers.addTo(storyDaechiMap);
    // mulgeumWalkingLayers.addTo(storyMulgeumMap);
    
    // 각 지도에 현재 선택된 도보권 표시
    updateWalkingView('daechi');
    updateWalkingView('mulgeum');

    daechiSchoolLayers.addTo(storyDaechiMap);
    mulgeumSchoolLayers.addTo(storyMulgeumMap);

    updateLegend('walking');
  }
}


// ==================================================
// 4-1. 스크롤로 단계 변경
// ==================================================
let isClickScrolling = false;

// const stepObserver = new IntersectionObserver(
//   entries => {

//     // 카드 클릭으로 이동 중이면
//     // 스크롤 감지에 의한 단계 변경을 잠시 막음
//     if (isClickScrolling) {
//       return;
//     }

//     entries.forEach(entry => {

//       if (entry.isIntersecting) {

//         const stepName = entry.target.dataset.step;

//         showStoryStep(stepName);
//       }

//     });

//   },
//   {
//     threshold: 0.8
//   }
// );


// storySteps.forEach(step => {
//   stepObserver.observe(step);
// });
let scrollUpdatePending = false;

function updateStepFromScroll() {

  if (isClickScrolling) return;

  // 모바일: 카드 상단을 기준으로 단계 판단
  if (mobileStoryQuery.matches) {

    const activationY = window.innerHeight * 0.35;
    let activeCard = storySteps[0];

    storySteps.forEach(card => {

      if (card.getBoundingClientRect().top <= activationY) {
        activeCard = card;
      }

    });

    if (activeCard) {
      showStoryStep(activeCard.dataset.step);
    }

    return;
  }

  // PC: 기존 카드 중심점 기준 유지
  const targetY = window.innerHeight * 0.45;

  let closestStep = null;
  let closestDistance = Infinity;

  storySteps.forEach(step => {

    const rect = step.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const distance = Math.abs(centerY - targetY);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestStep = step;
    }

  });

  if (closestStep) {
    showStoryStep(closestStep.dataset.step);
  }
}

function requestStepUpdate() {

  if (scrollUpdatePending) return;

  scrollUpdatePending = true;

  requestAnimationFrame(() => {

    scrollUpdatePending = false;
    updateStepFromScroll();

  });
}

window.addEventListener('scroll', requestStepUpdate, {
  passive: true
});

// window.addEventListener('resize', requestStepUpdate);
window.addEventListener('resize', () => {
  placeStoryMapPanel(currentStoryStep || 'population');
  requestStepUpdate();
});

// 초기 단계 표시
showStoryStep('population');


// ==================================================
// 4-2. 카드 클릭으로 단계 변경
// ==================================================

storySteps.forEach(step => {

  step.addEventListener('click', () => {

    const stepName = step.dataset.step;

    // 클릭 이동 중에는 IntersectionObserver 잠시 중지
    isClickScrolling = true;

    // 해당 단계 지도 표시
    showStoryStep(stepName);

    // 클릭한 카드를 화면 중앙으로 부드럽게 이동
    step.scrollIntoView({
      behavior: 'smooth',
      // block: 'center'
      block: mobileStoryQuery.matches ? 'start' : 'center'
    });

    // 이동이 끝난 뒤 다시 스크롤 감지 허용
    setTimeout(() => {
      isClickScrolling = false;
    }, 700);

  });

});

