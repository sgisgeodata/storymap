// ==================================================
// 3-3. 학교 위치 레이어
// ==================================================

const schoolColors = {
  elementary: '#F2C94C',
  middle: '#49A87A',
  high: '#F2994A'
};

const daechiSchoolLayers = L.layerGroup();
const mulgeumSchoolLayers = L.layerGroup();

// 학교 GeoJSON 불러오기
function loadSchoolLayer(file, schoolType, targetGroup) {
  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error(file);
      return response.json();
    })
    .then(data => {
      L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng, {
            pane: 'schoolPane',
            radius: 7,
            color: '#ffffff',
            weight: 1.5,
            fillColor: schoolColors[schoolType],
            fillOpacity: 0.95
          });
        },
        onEachFeature: function(feature, layer) {
          const name = feature.properties['학교명'] || '학교';
          const typeName = {
            elementary: '초등학교',
            middle: '중학교',
            high: '고등학교'
          }[schoolType];

          layer.bindPopup(
            `<b>${name}</b><br>학교급: ${typeName}`
          );

          // 학교명을 지도 위에 항상 표시 ---> 학교명 라벨 등록 (처음에는 숨김)
          layer.bindTooltip(name, {
            permanent: true,
            direction: 'right',
            offset: [8, 0],
            className: 'school-label',
            opacity: 0
          });
        }
      }).addTo(targetGroup);

      // 학교 데이터가 로드된 뒤에도 현재 확대 수준 반영
      const targetMap = targetGroup === daechiSchoolLayers
        ? storyDaechiMap
        : storyMulgeumMap;

      updateSchoolLabels(targetMap, targetGroup);
      })
    .catch(error => console.error('학교 데이터 오류:', error));
}

// 대치4동
loadSchoolLayer(
  'data/daechi4_elementary_school.geojson',
  'elementary',
  daechiSchoolLayers
);

// 물금읍
loadSchoolLayer(
  'data/mulgeum_elementary_school.geojson',
  'elementary',
  mulgeumSchoolLayers
);

loadSchoolLayer(
  'data/mulgeum_middle_school.geojson',
  'middle',
  mulgeumSchoolLayers
);

loadSchoolLayer(
  'data/mulgeum_high_school.geojson',
  'high',
  mulgeumSchoolLayers
);

// ==================================================
// 3-3-1. 지도 확대 수준에 따른 학교명 표시
// ==================================================

// 학교명을 표시할 최소 확대 수준
const SCHOOL_LABEL_MIN_ZOOM = 15;

// 학교명 표시 / 숨김
function updateSchoolLabels(map, schoolLayers) {

  const showLabels = map.getZoom() >= SCHOOL_LABEL_MIN_ZOOM;

  schoolLayers.eachLayer(function(geoJsonLayer) {

    geoJsonLayer.eachLayer(function(schoolMarker) {

      const tooltip = schoolMarker.getTooltip();

      if (tooltip) {
        tooltip.setOpacity(showLabels ? 1 : 0);
      }

    });

  });
}

// 대치4동 확대 시
storyDaechiMap.on('zoomend', function() {
  updateSchoolLabels(storyDaechiMap, daechiSchoolLayers);
});

// 물금읍 확대 시
storyMulgeumMap.on('zoomend', function() {
  updateSchoolLabels(storyMulgeumMap, mulgeumSchoolLayers);
});

