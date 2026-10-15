// ==================================================
// 1. 첫 번째 지도
//    물금읍 / 대치4동 위치
// ==================================================

const map = L.map('map').setView([36.3, 127.8], 7);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }
).addTo(map);


// 물금읍 위치
// const mulgeum = L.marker([35.31, 129.01])
//   .addTo(map)
//   .bindPopup('<b>경상남도 양산시 물금읍</b>');


// 대치4동 위치
// const daechi = L.marker([37.50, 127.06])
//   .addTo(map)
//   .bindPopup('<b>서울특별시 강남구 대치4동</b>');

// 지역별 색상 마커 생성
function createRegionIcon(color) {
  return L.divIcon({
    className: 'region-pin-icon',
    html: `
      <div class="region-pin" style="--pin-color:${color}">
        <div class="region-pin-center"></div>
      </div>
    `,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -40]
  });
}

// 물금읍: 청록색
const mulgeum = L.marker([35.31, 129.01], {
  icon: createRegionIcon('#36A99B')
})
  .addTo(map)
  .bindPopup('<b>경상남도 양산시 물금읍</b>');

// 대치4동: 코랄 핑크
const daechi = L.marker([37.50, 127.06], {
  icon: createRegionIcon('#E67E93')
})
  .addTo(map)
  .bindPopup('<b>서울특별시 강남구 대치4동</b>');

// ==================================================
// 2. 행정경계 비교 지도
//    강남구-대치4동 / 양산시-물금읍
// ==================================================


// 시군구 스타일
const sigunguStyle = {
  color: '#555555',
  weight: 2,
  fillColor: '#999999',
  fillOpacity: 0.08
};


// 읍면동 강조 스타일
const dongStyle = {
  color: '#d62728',
  weight: 3,
  fillColor: '#d62728',
  fillOpacity: 0.25
};


// 스크롤형 스토리 지도용 행정동 경계 스타일
const storyBoundaryStyle = {
  color: '#666666',
  weight: 1.5,
  fillOpacity: 0,
  interactive: false
};

// --------------------------------------------------
// 2-1. 강남구 지도
// --------------------------------------------------

const gangnamMap = L.map('gangnam-map');

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }
).addTo(gangnamMap);


// 강남구 경계
fetch('data/gangnam_boundary.geojson')
  .then(response => response.json())
  .then(data => {
    const gangnamLayer = L.geoJSON(data, {
      style: sigunguStyle
    }).addTo(gangnamMap);

    // 강남구 전체가 화면에 들어오도록 자동 확대
    gangnamMap.fitBounds(
      gangnamLayer.getBounds(),
      { padding: [20, 20] }
    );

    gangnamLayer.bindPopup(
      '<b>서울특별시 강남구</b>'
    );
  })
  .catch(error => {
    console.error('강남구 GeoJSON 불러오기 오류:', error);
  });


// 대치4동 경계
fetch('data/daechi4_boundary.geojson')
  .then(response => response.json())
  .then(data => {
    const daechiLayer = L.geoJSON(data, {
      style: dongStyle
    }).addTo(gangnamMap);

    daechiLayer.bindPopup(
      '<b>서울특별시 강남구 대치4동</b>'
    );
  })
  .catch(error => {
    console.error('대치4동 GeoJSON 불러오기 오류:', error);
  });



// --------------------------------------------------
// 2-2. 양산시 지도
// --------------------------------------------------

const yangsanMap = L.map('yangsan-map');

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }
).addTo(yangsanMap);


// 양산시 경계
fetch('data/yangsan_boundary.geojson')
  .then(response => response.json())
  .then(data => {
    const yangsanLayer = L.geoJSON(data, {
      style: sigunguStyle
    }).addTo(yangsanMap);

    // 양산시 전체가 화면에 들어오도록 자동 확대
    yangsanMap.fitBounds(
      yangsanLayer.getBounds(),
      { padding: [20, 20] }
    );

    yangsanLayer.bindPopup(
      '<b>경상남도 양산시</b>'
    );
  })
  .catch(error => {
    console.error('양산시 GeoJSON 불러오기 오류:', error);
  });


// 물금읍 경계
fetch('data/mulgeum_boundary.geojson')
  .then(response => response.json())
  .then(data => {
    const mulgeumLayer = L.geoJSON(data, {
      style: dongStyle
    }).addTo(yangsanMap);

    mulgeumLayer.bindPopup(
      '<b>경상남도 양산시 물금읍</b>'
    );
  })
  .catch(error => {
    console.error('물금읍 GeoJSON 불러오기 오류:', error);
  });

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

// ==================================================
// 3-3-2. 학원·교습소 위치 레이어
// ==================================================

// // 대치4동과 물금읍 학원 레이어 그룹
// const daechiAcademyLayers = L.layerGroup();
// const mulgeumAcademyLayers = L.layerGroup();

// // 학원·교습소 GeoJSON 불러오기
// function loadAcademyLayer(file, targetGroup) {

//   fetch(file)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`${file} 불러오기 실패: ${response.status}`);
//       }
//       return response.json();
//     })
//     .then(data => {

//       L.geoJSON(data, {

//         // 학원 위치를 분홍색 원으로 표시
//         pointToLayer: function(feature, latlng) {

//           return L.circleMarker(latlng, {
//             radius: 3,
//             color: '#ffffff',
//             weight: 0.5,
//             fillColor: '#C64A99',
//             fillOpacity: 0.75
//           });

//         },

//         // 학원 클릭 시 정보 표시
//         onEachFeature: function(feature, layer) {

//           const properties = feature.properties || {};

//           const name =
//             properties['학원명'] ||
//             properties['교습소명'] ||
//             properties['시설명'] ||
//             '학원·교습소';

//           const category = properties['분야명'];

//           // HTML 특수문자 처리
//           function escapeHtml(value) {
//             return String(value).replace(/[&<>"']/g, function(char) {
//               return {
//                 '&': '&amp;',
//                 '<': '&lt;',
//                 '>': '&gt;',
//                 '"': '&quot;',
//                 "'": '&#39;'
//               }[char];
//             });
//           }

//           let popup = `<b>${escapeHtml(name)}</b>`;

//           if (category) {
//             popup += `<br>분야: ${escapeHtml(category)}`;
//           }

//           layer.bindPopup(popup);

//         }

//       }).addTo(targetGroup);

//     })
//     .catch(error => {
//       console.error('학원·교습소 데이터 오류:', error);
//     });

// }

// // 대치4동 학원·교습소
// loadAcademyLayer(
//   'data/daechi4_academy.geojson',
//   daechiAcademyLayers
// );

// // 물금읍 학원·교습소
// loadAcademyLayer(
//   'data/mulgeum_academy.geojson',
//   mulgeumAcademyLayers
// );
// ==================================================
// 3-3-2. 학원·교습소 위치 레이어
// ==================================================

const ACADEMY_LABEL_MIN_ZOOM = 17;

const daechiAcademyLayers = L.layerGroup();
const mulgeumAcademyLayers = L.layerGroup();

const gangnamAcademyLayers = L.layerGroup();
const yangsanAcademyLayers = L.layerGroup();

// 현재 선택된 표시 범위
const academyView = {
  daechi: 'local',
  mulgeum: 'local'
};

// 학원 전용 레이어 순서
[storyDaechiMap, storyMulgeumMap].forEach(map => {
  map.createPane('academyRegionPane');
  map.getPane('academyRegionPane').style.zIndex = 440;

  map.createPane('academyLocalPane');
  map.getPane('academyLocalPane').style.zIndex = 450;
});

// HTML 특수문자 처리
function academyEscape(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

// // 학원 데이터 불러오기
// function loadAcademyLayer(file, group, isLocal, map) {

//   fetch(file)
//     .then(response => {
//       if (!response.ok) throw new Error(file);
//       return response.json();
//     })
//     .then(data => {

//       const layer = L.geoJSON(data, {

//         pointToLayer: function(feature, latlng) {

//           return L.circleMarker(latlng, {
//             pane: isLocal
//               ? 'academyLocalPane'
//               : 'academyRegionPane',
//             radius: isLocal ? 3.5 : 2.5,
//             color: '#ffffff',
//             weight: isLocal ? 0.6 : 0.3,
//             fillColor: isLocal ? '#C64A99' : '#EAB4D3',
//             fillOpacity: isLocal ? 0.9 : 0.65
//           });
//         },

//         onEachFeature: function(feature, marker) {

//           const p = feature.properties || {};
//           const name = p['학원명'] || '학원·교습소';
//           const category = p['분야명'] || '정보 없음';

//           const address =
//             p['도로명주소'] ||
//             p['도로명�'] ||
//             '';

//           let popup =
//             `<b>${academyEscape(name)}</b>` +
//             `<br>분야: ${academyEscape(category)}`;

//           if (address) {
//             popup +=
//               `<br>주소: ${academyEscape(address)}`;
//           }

//           marker.bindPopup(popup);

//           // marker.bindTooltip(academyEscape(name), {
//           //   permanent: true,
//           //   direction: 'right',
//           //   offset: [5, 0],
//           //   className: 'academy-label',
//           //   opacity: 0
//           // });

//           // 학원명만 저장하고, 툴팁은 필요할 때 생성
//           marker.academyName = academyEscape(name);
//           marker.academyIsLocal = isLocal;
//         }

//       });

//       layer.addTo(group);
//       updateAcademyLabels(map);

//     })
//     .catch(error => {
//       console.error('학원 데이터 오류:', file, error);
//     });
// }

// // 대치4동과 강남구
// loadAcademyLayer(
//   'data/daechi4_academy.geojson',
//   daechiAcademyLayers,
//   true,
//   storyDaechiMap
// );

// loadAcademyLayer(
//   'data/gangnam_academy.geojson',
//   gangnamAcademyLayers,
//   false,
//   storyDaechiMap
// );

// // 물금읍과 양산시
// loadAcademyLayer(
//   'data/mulgeum_academy.geojson',
//   mulgeumAcademyLayers,
//   true,
//   storyMulgeumMap
// );

// loadAcademyLayer(
//   'data/yangsan_academy.geojson',
//   yangsanAcademyLayers,
//   false,
//   storyMulgeumMap
// );

// // 확대 수준에 따라 학원명 표시
// function updateAcademyLabels(map) {

//   const show = map.getZoom() >= ACADEMY_LABEL_MIN_ZOOM;

//   const groups = map === storyDaechiMap
//     ? [daechiAcademyLayers, gangnamAcademyLayers]
//     : [mulgeumAcademyLayers, yangsanAcademyLayers];

//   groups.forEach(group => {

//     // 화면에 표시되지 않는 레이어는 처리하지 않음
//     if (!map.hasLayer(group)) return;

//     group.eachLayer(geojson => {

//       geojson.eachLayer(marker => {

//         // 핵심 지역 학원만 이름 표시
//         // 강남구·양산시 전체 학원은 클릭 팝업으로 확인
//         const shouldShow = show && marker.academyIsLocal;

//         // const tooltip = marker.getTooltip();

//         // if (tooltip) {
//         //   tooltip.setOpacity(show ? 1 : 0);
//         // }

//         if (shouldShow) {

//           if (!marker.getTooltip()) {

//             marker.bindTooltip(marker.academyName, {
//               permanent: true,
//               direction: 'right',
//               offset: [5, 0],
//               className: 'academy-label'
//             });

//           }

//         } else {

//           if (marker.getTooltip()) {
//             marker.unbindTooltip();
//           }

//         }

//       });

//     });

//   });
// }

// storyDaechiMap.on('zoomend', () => {
//   updateAcademyLabels(storyDaechiMap);
// });

// storyMulgeumMap.on('zoomend', () => {
//   updateAcademyLabels(storyMulgeumMap);
// });

// ==================================================
// 학원·교습소 데이터: 20개씩 순차 표시
// ==================================================

const ACADEMY_BATCH_SIZE = 20;

// 데이터 로딩 상태
const academyLoading = new Map();

// 화면에 표시된 학원명만 관리
const academyVisibleLabels = new Map();

// 학원 포인트 생성
function createAcademyMarker(feature, isLocal) {

  if (!feature.geometry ||
      feature.geometry.type !== 'Point') {
    return null;
  }

  const coords = feature.geometry.coordinates;

  if (!Array.isArray(coords) || coords.length < 2) {
    return null;
  }

  const lng = Number(coords[0]);
  const lat = Number(coords[1]);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  const marker = L.circleMarker([lat, lng], {
    pane: isLocal
      ? 'academyLocalPane'
      : 'academyRegionPane',
    radius: isLocal ? 3.5 : 3.5,
    color: '#ffffff',
    weight: isLocal ? 0.6 : 0.3,
    fillColor: isLocal ? '#C64A99' : '#EAB4D3',
    fillOpacity: isLocal ? 0.9 : 0.65
  });

  const p = feature.properties || {};

  const name =
    p['학원명'] ||
    p['교습소명'] ||
    p['시설명'] ||
    '학원·교습소';

  const category = p['분야명'] || '정보 없음';

  const address =
    p['도로명주소'] ||
    p['주소'] ||
    '';

  marker.academyName = academyEscape(name);

  // 클릭 시 팝업 생성: 초기 처리량 감소
  // marker.bindPopup(function() {

  //   let html =
  //     `<b>${academyEscape(name)}</b>` +
  //     `<br>분야: ${academyEscape(category)}`;

  //   if (address) {
  //     html += `<br>주소: ${academyEscape(address)}`;
  //   }

  //   return html;
  // });

  // return marker;

  // 클릭 시 학원 정보 팝업
  let popup =
    `<b>${academyEscape(name)}</b>` +
    `<br>분야: ${academyEscape(category)}`;

  if (address) {
    popup += `<br>주소: ${academyEscape(address)}`;
  }

  marker.bindPopup(popup);

  return marker;
}


// 학원 데이터 다운로드 및 순차 추가
function loadAcademyLayer(file, group, isLocal, map) {

  if (academyLoading.has(file)) {
    return academyLoading.get(file);
  }

  const loadingPromise = fetch(file)
    .then(response => {

      if (!response.ok) {
        throw new Error(
          `${file}: HTTP ${response.status}`
        );
      }

      return response.json();
    })
    .then(data => {

      const features = data.features || [];
      let index = 0;

      return new Promise(resolve => {

        function addNextBatch() {

          const end = Math.min(
            index + ACADEMY_BATCH_SIZE,
            features.length
          );

          for (; index < end; index++) {

            const marker = createAcademyMarker(
              features[index],
              isLocal
            );

            if (marker) {
              group.addLayer(marker);
            }

          }

          // 20개를 추가한 뒤 브라우저에 화면 갱신 기회 제공
          if (index < features.length) {
            requestAnimationFrame(addNextBatch);
          } else {
            updateAcademyLabels(map);
            resolve();
          }

        }

        requestAnimationFrame(addNextBatch);
      });
    })
    .catch(error => {
      console.error('학원 데이터 오류:', file, error);
      academyLoading.delete(file);
    });

  academyLoading.set(file, loadingPromise);

  return loadingPromise;
}


// 대치4동 학원
loadAcademyLayer(
  'data/daechi4_academy.geojson',
  daechiAcademyLayers,
  true,
  storyDaechiMap
);

// 강남구 전체 학원
loadAcademyLayer(
  'data/gangnam_academy.geojson',
  gangnamAcademyLayers,
  false,
  storyDaechiMap
);

// 물금읍 학원
loadAcademyLayer(
  'data/mulgeum_academy.geojson',
  mulgeumAcademyLayers,
  true,
  storyMulgeumMap
);

// 양산시 전체 학원
loadAcademyLayer(
  'data/yangsan_academy.geojson',
  yangsanAcademyLayers,
  false,
  storyMulgeumMap
);


// ==================================================
// 확대 시 화면에 보이는 학원명 표시
// ==================================================

function updateAcademyLabels(map) {

  let visibleSet = academyVisibleLabels.get(map);

  if (!visibleSet) {
    visibleSet = new Set();
    academyVisibleLabels.set(map, visibleSet);
  }

  // 기존 학원명 툴팁 제거
  visibleSet.forEach(marker => {
    if (marker.getTooltip()) {
      marker.unbindTooltip();
    }
  });

  visibleSet.clear();

  // 05번 카드가 아니면 학원명 표시 안 함
  const activeStep = document.querySelector(
    '.story-step.active'
  );

  if (!activeStep ||
      activeStep.dataset.step !== 'academy') {
    return;
  }

  // 17배율 미만에서는 학원명 숨김
  if (map.getZoom() < ACADEMY_LABEL_MIN_ZOOM) {
    return;
  }

  const bounds = map.getBounds();

  const groups = map === storyDaechiMap
    ? [daechiAcademyLayers, gangnamAcademyLayers]
    : [mulgeumAcademyLayers, yangsanAcademyLayers];

  groups.forEach(group => {

    if (!map.hasLayer(group)) return;

    group.eachLayer(marker => {

      // 현재 화면 안에 있는 학원만 표시
      if (!bounds.contains(marker.getLatLng())) {
        return;
      }

      marker.bindTooltip(marker.academyName, {
        permanent: true,
        direction: 'right',
        offset: [5, 0],
        className: 'academy-label'
      });

      visibleSet.add(marker);
    });

  });
}


// 지도 이동·확대가 끝나면 학원명 갱신
[storyDaechiMap, storyMulgeumMap].forEach(map => {

  map.on('zoomend moveend', () => {
    updateAcademyLabels(map);
  });

});


// 지역별 학원 레이어 표시
function applyAcademyView(region) {

  const isDaechi = region === 'daechi';

  const map = isDaechi
    ? storyDaechiMap
    : storyMulgeumMap;

  const localGroup = isDaechi
    ? daechiAcademyLayers
    : mulgeumAcademyLayers;

  const regionGroup = isDaechi
    ? gangnamAcademyLayers
    : yangsanAcademyLayers;

  const mode = academyView[region];

  // 두 레이어를 먼저 제거
  map.removeLayer(localGroup);
  map.removeLayer(regionGroup);

  // 전체 지역은 아래, 핵심 지역은 위
  if (mode === 'all') {
    regionGroup.addTo(map);
  }

  localGroup.addTo(map);

  // 선택 범위에 맞춰 지도 이동
  const boundaryFile = isDaechi
    ? (mode === 'all'
        ? 'data/gangnam_boundary.geojson'
        : 'data/daechi4_boundary.geojson')
    : (mode === 'all'
        ? 'data/yangsan_boundary.geojson'
        : 'data/mulgeum_boundary.geojson');

  fetch(boundaryFile)
    // .then(response => response.json())
    // .then(data => {
    //   if (!document.querySelector(
    //     '.story-step[data-step="academy"].active'
    //   )) return;

    //   const bounds = L.geoJSON(data).getBounds();

    //   if (bounds.isValid()) {
    //     map.fitBounds(bounds, {
    //       padding: [20, 20]
    //     });
    //   }
    // });
    .then(response => {
    if (!response.ok) {
      throw new Error(
        `${boundaryFile}: HTTP ${response.status}`
      );
    }
    return response.json();
  })
  .then(data => {

    const activeStep = document.querySelector(
      '.story-step.active'
    );

    if (!activeStep ||
        activeStep.dataset.step !== 'academy') {
      return;
    }

    const bounds = L.geoJSON(data).getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [20, 20]
      });
    } else {
      console.error('지도 경계가 유효하지 않습니다:', boundaryFile);
    }

  })
  .catch(error => {
    console.error('학원 지도 범위 변경 실패:', error);
  });

  // updateAcademyLabels(map);
  requestAnimationFrame(() => {
    updateAcademyLabels(map);
  });
}

// 지도 내부 버튼 생성
function createAcademyControl(map, region) {

  const control = L.control({
    position: 'topright'
  });

  control.onAdd = function() {

    const container = L.DomUtil.create(
      'div',
      'academy-map-control'
    );

    const isDaechi = region === 'daechi';

    const localName = isDaechi
      ? '대치4동'
      : '물금읍';

    const regionName = isDaechi
      ? '강남구 전체'
      : '양산시 전체';

    container.innerHTML = `
      <button type="button" data-mode="local"
        class="selected">${localName}</button>
      <button type="button" data-mode="all">
        ${regionName}</button>
    `;

    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    container.querySelectorAll('button').forEach(button => {

      // button.addEventListener('click', () => {
      button.addEventListener('click', (event) => {

        event.preventDefault();
        event.stopPropagation();

        const mode = button.dataset.mode;

        console.log('학원 버튼 클릭:', region, mode);

        academyView[region] = mode;

        container.querySelectorAll('button').forEach(b => {
          b.classList.toggle(
            'selected',
            b.dataset.mode === mode
          );
        });

        applyAcademyView(region);
      });

    });

    return container;
  };

  control.addTo(map);
  return control.getContainer();
}

const daechiAcademyControl = createAcademyControl(
  storyDaechiMap,
  'daechi'
);

const mulgeumAcademyControl = createAcademyControl(
  storyMulgeumMap,
  'mulgeum'
);

// 최초에는 버튼 숨김
daechiAcademyControl.style.display = 'none';
mulgeumAcademyControl.style.display = 'none';

// ==================================================
// 3-3-3. 학교 도보 5분·10분 접근성
// ==================================================

// const daechiWalkingLayers = L.layerGroup();
// const mulgeumWalkingLayers = L.layerGroup();

// // 도보권은 학교 위치보다 아래에 표시
// [storyDaechiMap, storyMulgeumMap].forEach(map => {
//   map.createPane('walkingPane');
//   map.getPane('walkingPane').style.zIndex = 425;
// });

// function loadWalkingLayer(file, group, minutes) {
//   fetch(file)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`${file}: HTTP ${response.status}`);
//       }
//       return response.json();
//     })
//     .then(data => {
//       const layer = L.geoJSON(data, {
//         pane: 'walkingPane',
//         style: {
//           color: minutes === 5 ? '#835BB9' : '#A68BCE',
//           weight: 1,
//           fillColor: minutes === 5 ? '#9C79D0' : '#D9C9F2',
//           fillOpacity: minutes === 5 ? 0.55 : 0.45
//         },
//         onEachFeature: (feature, featureLayer) => {
//           featureLayer.bindPopup(`학교 도보 ${minutes}분 이내`);
//         }
//       });

//       layer.addTo(group);
//     })
//     .catch(error => {
//       console.error('도보권 데이터 오류:', file, error);
//     });
// }

// // 10분권을 먼저 추가하고 5분권을 나중에 추가
// loadWalkingLayer(
//   'data/daechi4_walk_10min.geojson',
//   daechiWalkingLayers,
//   10
// );

// loadWalkingLayer(
//   'data/daechi4_walk_5min.geojson',
//   daechiWalkingLayers,
//   5
// );

// loadWalkingLayer(
//   'data/mulgeum_walk_10min.geojson',
//   mulgeumWalkingLayers,
//   10
// );

// loadWalkingLayer(
//   'data/mulgeum_walk_5min.geojson',
//   mulgeumWalkingLayers,
//   5
// );

// 지역별·시간별 도보권 레이어 분리
const walkingLayers = {
  daechi: {
    5: L.layerGroup(),
    10: L.layerGroup()
  },
  mulgeum: {
    5: L.layerGroup(),
    10: L.layerGroup()
  }
};

// 버튼 선택 상태: 기본값은 모두 표시
const walkingVisible = {
  daechi: { 5: true, 10: true },
  mulgeum: { 5: true, 10: true }
};

// 10분권은 아래, 5분권은 위, 학교는 가장 위
[storyDaechiMap, storyMulgeumMap].forEach(map => {
  map.createPane('walking10Pane');
  map.getPane('walking10Pane').style.zIndex = 421;

  map.createPane('walking5Pane');
  map.getPane('walking5Pane').style.zIndex = 425;
});

// GeoJSON 불러오기
function loadWalkingLayer(file, group, minutes) {
  fetch(file)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${file}: HTTP ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      L.geoJSON(data, {
        pane: minutes === 5
          ? 'walking5Pane'
          : 'walking10Pane',

        style: {
          color: minutes === 5 ? '#835BB9' : '#A68BCE',
          weight: 1,
          fillColor: minutes === 5 ? '#9C79D0' : '#D9C9F2',
          fillOpacity: minutes === 5 ? 0.55 : 0.45
        },

        onEachFeature: (feature, layer) => {
          layer.bindPopup(`학교 도보 ${minutes}분 이내`);
        }
      }).addTo(group);
    })
    .catch(error => {
      console.error('도보권 데이터 오류:', file, error);
    });
}

// 지역별 GeoJSON 로드
loadWalkingLayer(
  'data/daechi4_walk_5min.geojson',
  walkingLayers.daechi[5],
  5
);

loadWalkingLayer(
  'data/daechi4_walk_10min.geojson',
  walkingLayers.daechi[10],
  10
);

loadWalkingLayer(
  'data/mulgeum_walk_5min.geojson',
  walkingLayers.mulgeum[5],
  5
);

loadWalkingLayer(
  'data/mulgeum_walk_10min.geojson',
  walkingLayers.mulgeum[10],
  10
);

// 선택 상태에 따라 지도 표시 갱신
function updateWalkingView(region) {
  const map = region === 'daechi'
    ? storyDaechiMap
    : storyMulgeumMap;

  [5, 10].forEach(minutes => {
    const layer = walkingLayers[region][minutes];

    if (walkingVisible[region][minutes]) {
      if (!map.hasLayer(layer)) {
        layer.addTo(map);
      }
    } else {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    }
  });
}

// 지도 오른쪽 상단 ON/OFF 버튼 생성
function createWalkingControl(map, region) {
  const control = L.control({ position: 'topright' });

  control.onAdd = function() {
    const container = L.DomUtil.create(
      'div',
      'walking-map-control'
    );

    container.innerHTML = `
      <button type="button" data-minutes="5" class="selected">
        도보 5분
      </button>
      <button type="button" data-minutes="10" class="selected">
        도보 10분
      </button>
    `;

    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    container.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        const minutes = Number(button.dataset.minutes);

        walkingVisible[region][minutes] =
          !walkingVisible[region][minutes];

        button.classList.toggle(
          'selected',
          walkingVisible[region][minutes]
        );

        updateWalkingView(region);
      });
    });

    return container;
  };

  control.addTo(map);
  return control.getContainer();
}

const daechiWalkingControl = createWalkingControl(
  storyDaechiMap,
  'daechi'
);

const mulgeumWalkingControl = createWalkingControl(
  storyMulgeumMap,
  'mulgeum'
);

// 최초에는 버튼 숨김
daechiWalkingControl.style.display = 'none';
mulgeumWalkingControl.style.display = 'none';
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
