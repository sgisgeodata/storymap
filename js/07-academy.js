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
    fillColor: isLocal ? '#C64A99' : '#DE93BF',
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

