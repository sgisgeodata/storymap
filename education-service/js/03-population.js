// ==================================================
// 3-1. 총인구 격자 레이어
// ==================================================


// 총인구 값에 따른 색상
function getPopulationColor(value) {
  return value > 500 ? '#2171B5' :
         value > 250 ? '#4292C6' :
         value > 100 ? '#6BAED6' :
         value > 50  ? '#9ECAE1' :
         value > 0   ? '#DEEBF7' :
                       'transparent';
}


// 총인구 격자 스타일
function populationStyle(feature) {
  const value = feature.properties.STAT_VAL || 0;

  return {
    fillColor: getPopulationColor(value),
    weight: 0.25,
    color: '#cccccc',
    fillOpacity: value === 0 ? 0 : 0.75
  };
}


// 대치4동 총인구
let daechiPopulationLayer;

fetch('data/daechi4_population.geojson')
  .then(response => response.json())
  .then(data => {

    daechiPopulationLayer = L.geoJSON(data, {
      pane: 'populationPane',
      style: populationStyle,

      onEachFeature: function(feature, layer) {
        const population = feature.properties.STAT_VAL;

        layer.bindPopup(
          `<b>총인구</b><br>${population}명`
        );
      }

    }).addTo(storyDaechiMap);

  })
  .catch(error => {
    console.error('대치4동 총인구 GeoJSON 불러오기 오류:', error);
  });


// 물금읍 총인구
let mulgeumPopulationLayer;

fetch('data/mulgeum_population.geojson')
  .then(response => response.json())
  .then(data => {

    mulgeumPopulationLayer = L.geoJSON(data, {
      pane: 'populationPane',
      style: populationStyle,

      onEachFeature: function(feature, layer) {
        const population = feature.properties.STAT_VAL;

        layer.bindPopup(
          `<b>총인구</b><br>${population}명`
        );
      }

    }).addTo(storyMulgeumMap);

  })
  .catch(error => {
    console.error('물금읍 총인구 GeoJSON 불러오기 오류:', error);
  });

