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
