// ==================================================
// 3-2. 학령인구 격자 레이어
// ==================================================


// 학령인구 값에 따른 색상
function getSchoolAgeColor(value) {
  return value > 120 ? '#CB181D' :
         value > 90  ? '#EF3B2C' :
         value > 60  ? '#FB6A4A' :
         value > 30  ? '#FC9272' :
         value > 0   ? '#FEE0D2' :
                       'transparent';
}


// 학령인구 격자 스타일
function schoolAgeStyle(feature) {
  const value = feature.properties.SCH_POP || 0;

  return {
    fillColor: getSchoolAgeColor(value),
    weight: 0.25,
    color: '#cccccc',
    fillOpacity: value === 0 ? 0 : 0.8
  };
}


// 대치4동 학령인구
let daechiSchoolAgeLayer;

fetch('data/daechi4_school_age.geojson')
  .then(response => response.json())
  .then(data => {

    daechiSchoolAgeLayer = L.geoJSON(data, {
      pane: 'schoolAgePane',
      style: schoolAgeStyle,

      onEachFeature: function(feature, layer) {
        const population = feature.properties.SCH_POP;

        layer.bindPopup(
          `<b>학령인구</b><br>${population.toFixed(1)}명`
        );
      }

    });

  })
  .catch(error => {
    console.error('대치4동 학령인구 GeoJSON 불러오기 오류:', error);
  });


// 물금읍 학령인구
let mulgeumSchoolAgeLayer;

fetch('data/mulgeum_school_age.geojson')
  .then(response => response.json())
  .then(data => {

    mulgeumSchoolAgeLayer = L.geoJSON(data, {
      pane: 'schoolAgePane',
      style: schoolAgeStyle,

      onEachFeature: function(feature, layer) {
        const population = feature.properties.SCH_POP;

        layer.bindPopup(
          `<b>학령인구</b><br>${population.toFixed(1)}명`
        );
      }

    });

  })
  .catch(error => {
    console.error('물금읍 학령인구 GeoJSON 불러오기 오류:', error);
  });

