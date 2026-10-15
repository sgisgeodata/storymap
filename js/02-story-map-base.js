// ==================================================
// 3. 스크롤형 비교 스토리 지도
// ==================================================


// 대치4동
const storyDaechiMap = L.map('story-daechi-map', {
  zoomControl: false,
  preferCanvas: true
});

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    maxZoom: 19,
    opacity: 0.55,
    attribution: '&copy; OpenStreetMap contributors'
  }
).addTo(storyDaechiMap);


// 물금읍
const storyMulgeumMap = L.map('story-mulgeum-map', {
  zoomControl: false,
  preferCanvas: true
});

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    maxZoom: 19,
    opacity: 0.55,
    attribution: '&copy; OpenStreetMap contributors'
  }
).addTo(storyMulgeumMap);

// 행정경계를 인구 격자보다 위에 표시
[storyDaechiMap, storyMulgeumMap].forEach(map => {
  map.createPane('boundaryPane');
  map.getPane('boundaryPane').style.zIndex = 460;
  map.getPane('boundaryPane').style.pointerEvents = 'none';
});


// 대치4동 경계
fetch('data/daechi4_boundary.geojson')
  .then(response => response.json())
  .then(data => {

    const layer = L.geoJSON(data, {
      pane: 'boundaryPane',
      style: storyBoundaryStyle
    }).addTo(storyDaechiMap);

    storyDaechiMap.fitBounds(
      layer.getBounds(),
      { padding: [20, 20] }
    );

  });


// 물금읍 경계
fetch('data/mulgeum_boundary.geojson')
  .then(response => response.json())
  .then(data => {

    const layer = L.geoJSON(data, {
      pane: 'boundaryPane',
      style: storyBoundaryStyle
    }).addTo(storyMulgeumMap);

    storyMulgeumMap.fitBounds(
      layer.getBounds(),
      { padding: [20, 20] }
    );

  });

  // ==================================================
  // 스토리 지도 레이어 표시 순서 설정
  // ==================================================

  // 총인구: 아래쪽
  storyDaechiMap.createPane('populationPane');
  storyMulgeumMap.createPane('populationPane');

  storyDaechiMap.getPane('populationPane').style.zIndex = 410;
  storyMulgeumMap.getPane('populationPane').style.zIndex = 410;

  // 학령인구: 총인구 위
  storyDaechiMap.createPane('schoolAgePane');
  storyMulgeumMap.createPane('schoolAgePane');

  storyDaechiMap.getPane('schoolAgePane').style.zIndex = 420;
  storyMulgeumMap.getPane('schoolAgePane').style.zIndex = 420;

  // 학교: 가장 위
  storyDaechiMap.createPane('schoolPane');
  storyMulgeumMap.createPane('schoolPane');

  storyDaechiMap.getPane('schoolPane').style.zIndex = 430;
  storyMulgeumMap.getPane('schoolPane').style.zIndex = 430;


// ==================================================
// 공통 범례
// ==================================================
// ==================================================
// 3-4. 스토리 지도 범례
// ==================================================

const storyLegend = document.getElementById('story-legend');


function updateLegend(type) {

  // 총인구
  if (type === 'population') {

    storyLegend.innerHTML = `
      <span class="legend-title">총인구(명)</span>

      <span class="legend-item">
        <span class="legend-color" style="background:#DEEBF7;"></span>
        1~50
      </span>

      <span class="legend-item">
        <span class="legend-color" style="background:#9ECAE1;"></span>
        51~100
      </span>

      <span class="legend-item">
        <span class="legend-color" style="background:#6BAED6;"></span>
        101~250
      </span>

      <span class="legend-item">
        <span class="legend-color" style="background:#4292C6;"></span>
        251~500
      </span>

      <span class="legend-item">
        <span class="legend-color" style="background:#2171B5;"></span>
        501 이상
      </span>
    `;
  }


  // 학령인구
  if (type === 'school-age') {

    storyLegend.innerHTML = `
      <span class="legend-title">학령인구(명)</span>

      <span class="legend-item">
        <span class="legend-color" style="background:#FEE0D2;"></span>
        1~30
      </span>

      <span class="legend-item">
        <span class="legend-color" style="background:#FC9272;"></span>
        31~60
      </span>

      <span class="legend-item">
        <span class="legend-color" style="background:#FB6A4A;"></span>
        61~90
      </span>

      <span class="legend-item">
        <span class="legend-color" style="background:#EF3B2C;"></span>
        91~120
      </span>

      <span class="legend-item">
        <span class="legend-color" style="background:#CB181D;"></span>
        121 이상
      </span>
    `;

  }

  // 학교
  if (type === 'school') {
      storyLegend.innerHTML = `
        <span class="legend-title">학교 구분</span>

        <span class="legend-item">
          <span class="legend-color"
                style="background:#F2C94C;"></span>
          초등학교
        </span>

        <span class="legend-item">
          <span class="legend-color"
                style="background:#49A87A;"></span>
          중학교
        </span>

        <span class="legend-item">
          <span class="legend-color"
                style="background:#F2994A;"></span>
          고등학교
        </span>
      `;
  }

  // 학원·교습소 범례
  if (type === 'academy') {

    storyLegend.innerHTML = `
      <span class="legend-title">학원·교습소</span>

      <span class="legend-item">
        <span class="legend-color"
              style="background:#EAB4D3;"></span>
        강남구·양산시
      </span>

      <span class="legend-item">
        <span class="legend-color"
              style="background:#C64A99;"></span>
        대치4동·물금읍
      </span>
    `;

  }

  // 도보권
  if (type === 'walking') {
    storyLegend.innerHTML = `
      <span class="legend-title">학교 도보 접근성</span>

      <span class="legend-item">
        <span class="legend-color"
              style="background:#9C79D0;"></span>
        도보 5분
      </span>

      <span class="legend-item">
        <span class="legend-color"
              style="background:#D9C9F2;"></span>
        도보 10분
      </span>
    `;
  }
}


// 최초 화면은 총인구 범례
updateLegend('population');

