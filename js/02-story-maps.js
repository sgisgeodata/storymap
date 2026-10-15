// // ==================================================
// // 3. 스크롤형 비교 스토리 지도
// // ==================================================


// // 대치4동
// const storyDaechiMap = L.map('story-daechi-map', {
//   zoomControl: false,
//   preferCanvas: true
// });

// L.tileLayer(
//   'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//   {
//     maxZoom: 19,
//     opacity: 0.55,
//     attribution: '&copy; OpenStreetMap contributors'
//   }
// ).addTo(storyDaechiMap);


// // 물금읍
// const storyMulgeumMap = L.map('story-mulgeum-map', {
//   zoomControl: false,
//   preferCanvas: true
// });

// L.tileLayer(
//   'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//   {
//     maxZoom: 19,
//     opacity: 0.55,
//     attribution: '&copy; OpenStreetMap contributors'
//   }
// ).addTo(storyMulgeumMap);

// // 행정경계를 인구 격자보다 위에 표시
// [storyDaechiMap, storyMulgeumMap].forEach(map => {
//   map.createPane('boundaryPane');
//   map.getPane('boundaryPane').style.zIndex = 460;
//   map.getPane('boundaryPane').style.pointerEvents = 'none';
// });


// // 대치4동 경계
// fetch('data/daechi4_boundary.geojson')
//   .then(response => response.json())
//   .then(data => {

//     const layer = L.geoJSON(data, {
//       pane: 'boundaryPane',
//       style: storyBoundaryStyle
//     }).addTo(storyDaechiMap);

//     storyDaechiMap.fitBounds(
//       layer.getBounds(),
//       { padding: [20, 20] }
//     );

//   });


// // 물금읍 경계
// fetch('data/mulgeum_boundary.geojson')
//   .then(response => response.json())
//   .then(data => {

//     const layer = L.geoJSON(data, {
//       pane: 'boundaryPane',
//       style: storyBoundaryStyle
//     }).addTo(storyMulgeumMap);

//     storyMulgeumMap.fitBounds(
//       layer.getBounds(),
//       { padding: [20, 20] }
//     );

//   });

//   // ==================================================
//   // 스토리 지도 레이어 표시 순서 설정
//   // ==================================================

//   // 총인구: 아래쪽
//   storyDaechiMap.createPane('populationPane');
//   storyMulgeumMap.createPane('populationPane');

//   storyDaechiMap.getPane('populationPane').style.zIndex = 410;
//   storyMulgeumMap.getPane('populationPane').style.zIndex = 410;

//   // 학령인구: 총인구 위
//   storyDaechiMap.createPane('schoolAgePane');
//   storyMulgeumMap.createPane('schoolAgePane');

//   storyDaechiMap.getPane('schoolAgePane').style.zIndex = 420;
//   storyMulgeumMap.getPane('schoolAgePane').style.zIndex = 420;

//   // 학교: 가장 위
//   storyDaechiMap.createPane('schoolPane');
//   storyMulgeumMap.createPane('schoolPane');

//   storyDaechiMap.getPane('schoolPane').style.zIndex = 430;
//   storyMulgeumMap.getPane('schoolPane').style.zIndex = 430;

// // ==================================================
// // 3-1. 총인구 격자 레이어
// // ==================================================


// // 총인구 값에 따른 색상
// function getPopulationColor(value) {
//   return value > 500 ? '#2171B5' :
//          value > 250 ? '#4292C6' :
//          value > 100 ? '#6BAED6' :
//          value > 50  ? '#9ECAE1' :
//          value > 0   ? '#DEEBF7' :
//                        'transparent';
// }


// // 총인구 격자 스타일
// function populationStyle(feature) {
//   const value = feature.properties.STAT_VAL || 0;

//   return {
//     fillColor: getPopulationColor(value),
//     weight: 0.25,
//     color: '#cccccc',
//     fillOpacity: value === 0 ? 0 : 0.75
//   };
// }


// // 대치4동 총인구
// let daechiPopulationLayer;

// fetch('data/daechi4_population.geojson')
//   .then(response => response.json())
//   .then(data => {

//     daechiPopulationLayer = L.geoJSON(data, {
//       pane: 'populationPane',
//       style: populationStyle,

//       onEachFeature: function(feature, layer) {
//         const population = feature.properties.STAT_VAL;

//         layer.bindPopup(
//           `<b>총인구</b><br>${population}명`
//         );
//       }

//     }).addTo(storyDaechiMap);

//   })
//   .catch(error => {
//     console.error('대치4동 총인구 GeoJSON 불러오기 오류:', error);
//   });


// // 물금읍 총인구
// let mulgeumPopulationLayer;

// fetch('data/mulgeum_population.geojson')
//   .then(response => response.json())
//   .then(data => {

//     mulgeumPopulationLayer = L.geoJSON(data, {
//       pane: 'populationPane',
//       style: populationStyle,

//       onEachFeature: function(feature, layer) {
//         const population = feature.properties.STAT_VAL;

//         layer.bindPopup(
//           `<b>총인구</b><br>${population}명`
//         );
//       }

//     }).addTo(storyMulgeumMap);

//   })
//   .catch(error => {
//     console.error('물금읍 총인구 GeoJSON 불러오기 오류:', error);
//   });

// // ==================================================
// // 3-2. 학령인구 격자 레이어
// // ==================================================


// // 학령인구 값에 따른 색상
// function getSchoolAgeColor(value) {
//   return value > 120 ? '#CB181D' :
//          value > 90  ? '#EF3B2C' :
//          value > 60  ? '#FB6A4A' :
//          value > 30  ? '#FC9272' :
//          value > 0   ? '#FEE0D2' :
//                        'transparent';
// }


// // 학령인구 격자 스타일
// function schoolAgeStyle(feature) {
//   const value = feature.properties.SCH_POP || 0;

//   return {
//     fillColor: getSchoolAgeColor(value),
//     weight: 0.25,
//     color: '#cccccc',
//     fillOpacity: value === 0 ? 0 : 0.8
//   };
// }


// // 대치4동 학령인구
// let daechiSchoolAgeLayer;

// fetch('data/daechi4_school_age.geojson')
//   .then(response => response.json())
//   .then(data => {

//     daechiSchoolAgeLayer = L.geoJSON(data, {
//       pane: 'schoolAgePane',
//       style: schoolAgeStyle,

//       onEachFeature: function(feature, layer) {
//         const population = feature.properties.SCH_POP;

//         layer.bindPopup(
//           `<b>학령인구</b><br>${population.toFixed(1)}명`
//         );
//       }

//     });

//   })
//   .catch(error => {
//     console.error('대치4동 학령인구 GeoJSON 불러오기 오류:', error);
//   });


// // 물금읍 학령인구
// let mulgeumSchoolAgeLayer;

// fetch('data/mulgeum_school_age.geojson')
//   .then(response => response.json())
//   .then(data => {

//     mulgeumSchoolAgeLayer = L.geoJSON(data, {
//       pane: 'schoolAgePane',
//       style: schoolAgeStyle,

//       onEachFeature: function(feature, layer) {
//         const population = feature.properties.SCH_POP;

//         layer.bindPopup(
//           `<b>학령인구</b><br>${population.toFixed(1)}명`
//         );
//       }

//     });

//   })
//   .catch(error => {
//     console.error('물금읍 학령인구 GeoJSON 불러오기 오류:', error);
//   });

// // ==================================================
// // 3-3. 학교 위치 레이어
// // ==================================================

// const schoolColors = {
//   elementary: '#F2C94C',
//   middle: '#49A87A',
//   high: '#F2994A'
// };

// const daechiSchoolLayers = L.layerGroup();
// const mulgeumSchoolLayers = L.layerGroup();

// // 학교 GeoJSON 불러오기
// function loadSchoolLayer(file, schoolType, targetGroup) {
//   fetch(file)
//     .then(response => {
//       if (!response.ok) throw new Error(file);
//       return response.json();
//     })
//     .then(data => {
//       L.geoJSON(data, {
//         pointToLayer: function(feature, latlng) {
//           return L.circleMarker(latlng, {
//             pane: 'schoolPane',
//             radius: 7,
//             color: '#ffffff',
//             weight: 1.5,
//             fillColor: schoolColors[schoolType],
//             fillOpacity: 0.95
//           });
//         },
//         onEachFeature: function(feature, layer) {
//           const name = feature.properties['학교명'] || '학교';
//           const typeName = {
//             elementary: '초등학교',
//             middle: '중학교',
//             high: '고등학교'
//           }[schoolType];

//           layer.bindPopup(
//             `<b>${name}</b><br>학교급: ${typeName}`
//           );

//           // 학교명을 지도 위에 항상 표시 ---> 학교명 라벨 등록 (처음에는 숨김)
//           layer.bindTooltip(name, {
//             permanent: true,
//             direction: 'right',
//             offset: [8, 0],
//             className: 'school-label',
//             opacity: 0
//           });
//         }
//       }).addTo(targetGroup);

//       // 학교 데이터가 로드된 뒤에도 현재 확대 수준 반영
//       const targetMap = targetGroup === daechiSchoolLayers
//         ? storyDaechiMap
//         : storyMulgeumMap;

//       updateSchoolLabels(targetMap, targetGroup);
//       })
//     .catch(error => console.error('학교 데이터 오류:', error));
// }

// // 대치4동
// loadSchoolLayer(
//   'data/daechi4_elementary_school.geojson',
//   'elementary',
//   daechiSchoolLayers
// );

// // 물금읍
// loadSchoolLayer(
//   'data/mulgeum_elementary_school.geojson',
//   'elementary',
//   mulgeumSchoolLayers
// );

// loadSchoolLayer(
//   'data/mulgeum_middle_school.geojson',
//   'middle',
//   mulgeumSchoolLayers
// );

// loadSchoolLayer(
//   'data/mulgeum_high_school.geojson',
//   'high',
//   mulgeumSchoolLayers
// );

// // ==================================================
// // 3-3-1. 지도 확대 수준에 따른 학교명 표시
// // ==================================================

// // 학교명을 표시할 최소 확대 수준
// const SCHOOL_LABEL_MIN_ZOOM = 15;

// // 학교명 표시 / 숨김
// function updateSchoolLabels(map, schoolLayers) {

//   const showLabels = map.getZoom() >= SCHOOL_LABEL_MIN_ZOOM;

//   schoolLayers.eachLayer(function(geoJsonLayer) {

//     geoJsonLayer.eachLayer(function(schoolMarker) {

//       const tooltip = schoolMarker.getTooltip();

//       if (tooltip) {
//         tooltip.setOpacity(showLabels ? 1 : 0);
//       }

//     });

//   });
// }

// // 대치4동 확대 시
// storyDaechiMap.on('zoomend', function() {
//   updateSchoolLabels(storyDaechiMap, daechiSchoolLayers);
// });

// // 물금읍 확대 시
// storyMulgeumMap.on('zoomend', function() {
//   updateSchoolLabels(storyMulgeumMap, mulgeumSchoolLayers);
// });

// // ==================================================
// // 3-3-2. 학원·교습소 위치 레이어
// // ==================================================

// // // 대치4동과 물금읍 학원 레이어 그룹
// // const daechiAcademyLayers = L.layerGroup();
// // const mulgeumAcademyLayers = L.layerGroup();

// // // 학원·교습소 GeoJSON 불러오기
// // function loadAcademyLayer(file, targetGroup) {

// //   fetch(file)
// //     .then(response => {
// //       if (!response.ok) {
// //         throw new Error(`${file} 불러오기 실패: ${response.status}`);
// //       }
// //       return response.json();
// //     })
// //     .then(data => {

// //       L.geoJSON(data, {

// //         // 학원 위치를 분홍색 원으로 표시
// //         pointToLayer: function(feature, latlng) {

// //           return L.circleMarker(latlng, {
// //             radius: 3,
// //             color: '#ffffff',
// //             weight: 0.5,
// //             fillColor: '#C64A99',
// //             fillOpacity: 0.75
// //           });

// //         },

// //         // 학원 클릭 시 정보 표시
// //         onEachFeature: function(feature, layer) {

// //           const properties = feature.properties || {};

// //           const name =
// //             properties['학원명'] ||
// //             properties['교습소명'] ||
// //             properties['시설명'] ||
// //             '학원·교습소';

// //           const category = properties['분야명'];

// //           // HTML 특수문자 처리
// //           function escapeHtml(value) {
// //             return String(value).replace(/[&<>"']/g, function(char) {
// //               return {
// //                 '&': '&amp;',
// //                 '<': '&lt;',
// //                 '>': '&gt;',
// //                 '"': '&quot;',
// //                 "'": '&#39;'
// //               }[char];
// //             });
// //           }

// //           let popup = `<b>${escapeHtml(name)}</b>`;

// //           if (category) {
// //             popup += `<br>분야: ${escapeHtml(category)}`;
// //           }

// //           layer.bindPopup(popup);

// //         }

// //       }).addTo(targetGroup);

// //     })
// //     .catch(error => {
// //       console.error('학원·교습소 데이터 오류:', error);
// //     });

// // }

// // // 대치4동 학원·교습소
// // loadAcademyLayer(
// //   'data/daechi4_academy.geojson',
// //   daechiAcademyLayers
// // );

// // // 물금읍 학원·교습소
// // loadAcademyLayer(
// //   'data/mulgeum_academy.geojson',
// //   mulgeumAcademyLayers
// // );
// // ==================================================
// // 3-3-2. 학원·교습소 위치 레이어
// // ==================================================

// const ACADEMY_LABEL_MIN_ZOOM = 17;

// const daechiAcademyLayers = L.layerGroup();
// const mulgeumAcademyLayers = L.layerGroup();

// const gangnamAcademyLayers = L.layerGroup();
// const yangsanAcademyLayers = L.layerGroup();

// // 현재 선택된 표시 범위
// const academyView = {
//   daechi: 'local',
//   mulgeum: 'local'
// };

// // 학원 전용 레이어 순서
// [storyDaechiMap, storyMulgeumMap].forEach(map => {
//   map.createPane('academyRegionPane');
//   map.getPane('academyRegionPane').style.zIndex = 440;

//   map.createPane('academyLocalPane');
//   map.getPane('academyLocalPane').style.zIndex = 450;
// });

// // HTML 특수문자 처리
// function academyEscape(value) {
//   return String(value ?? '').replace(/[&<>"']/g, char => ({
//     '&': '&amp;',
//     '<': '&lt;',
//     '>': '&gt;',
//     '"': '&quot;',
//     "'": '&#39;'
//   })[char]);
// }

// // // 학원 데이터 불러오기
// // function loadAcademyLayer(file, group, isLocal, map) {

// //   fetch(file)
// //     .then(response => {
// //       if (!response.ok) throw new Error(file);
// //       return response.json();
// //     })
// //     .then(data => {

// //       const layer = L.geoJSON(data, {

// //         pointToLayer: function(feature, latlng) {

// //           return L.circleMarker(latlng, {
// //             pane: isLocal
// //               ? 'academyLocalPane'
// //               : 'academyRegionPane',
// //             radius: isLocal ? 3.5 : 2.5,
// //             color: '#ffffff',
// //             weight: isLocal ? 0.6 : 0.3,
// //             fillColor: isLocal ? '#C64A99' : '#EAB4D3',
// //             fillOpacity: isLocal ? 0.9 : 0.65
// //           });
// //         },

// //         onEachFeature: function(feature, marker) {

// //           const p = feature.properties || {};
// //           const name = p['학원명'] || '학원·교습소';
// //           const category = p['분야명'] || '정보 없음';

// //           const address =
// //             p['도로명주소'] ||
// //             p['도로명�'] ||
// //             '';

// //           let popup =
// //             `<b>${academyEscape(name)}</b>` +
// //             `<br>분야: ${academyEscape(category)}`;

// //           if (address) {
// //             popup +=
// //               `<br>주소: ${academyEscape(address)}`;
// //           }

// //           marker.bindPopup(popup);

// //           // marker.bindTooltip(academyEscape(name), {
// //           //   permanent: true,
// //           //   direction: 'right',
// //           //   offset: [5, 0],
// //           //   className: 'academy-label',
// //           //   opacity: 0
// //           // });

// //           // 학원명만 저장하고, 툴팁은 필요할 때 생성
// //           marker.academyName = academyEscape(name);
// //           marker.academyIsLocal = isLocal;
// //         }

// //       });

// //       layer.addTo(group);
// //       updateAcademyLabels(map);

// //     })
// //     .catch(error => {
// //       console.error('학원 데이터 오류:', file, error);
// //     });
// // }

// // // 대치4동과 강남구
// // loadAcademyLayer(
// //   'data/daechi4_academy.geojson',
// //   daechiAcademyLayers,
// //   true,
// //   storyDaechiMap
// // );

// // loadAcademyLayer(
// //   'data/gangnam_academy.geojson',
// //   gangnamAcademyLayers,
// //   false,
// //   storyDaechiMap
// // );

// // // 물금읍과 양산시
// // loadAcademyLayer(
// //   'data/mulgeum_academy.geojson',
// //   mulgeumAcademyLayers,
// //   true,
// //   storyMulgeumMap
// // );

// // loadAcademyLayer(
// //   'data/yangsan_academy.geojson',
// //   yangsanAcademyLayers,
// //   false,
// //   storyMulgeumMap
// // );

// // // 확대 수준에 따라 학원명 표시
// // function updateAcademyLabels(map) {

// //   const show = map.getZoom() >= ACADEMY_LABEL_MIN_ZOOM;

// //   const groups = map === storyDaechiMap
// //     ? [daechiAcademyLayers, gangnamAcademyLayers]
// //     : [mulgeumAcademyLayers, yangsanAcademyLayers];

// //   groups.forEach(group => {

// //     // 화면에 표시되지 않는 레이어는 처리하지 않음
// //     if (!map.hasLayer(group)) return;

// //     group.eachLayer(geojson => {

// //       geojson.eachLayer(marker => {

// //         // 핵심 지역 학원만 이름 표시
// //         // 강남구·양산시 전체 학원은 클릭 팝업으로 확인
// //         const shouldShow = show && marker.academyIsLocal;

// //         // const tooltip = marker.getTooltip();

// //         // if (tooltip) {
// //         //   tooltip.setOpacity(show ? 1 : 0);
// //         // }

// //         if (shouldShow) {

// //           if (!marker.getTooltip()) {

// //             marker.bindTooltip(marker.academyName, {
// //               permanent: true,
// //               direction: 'right',
// //               offset: [5, 0],
// //               className: 'academy-label'
// //             });

// //           }

// //         } else {

// //           if (marker.getTooltip()) {
// //             marker.unbindTooltip();
// //           }

// //         }

// //       });

// //     });

// //   });
// // }

// // storyDaechiMap.on('zoomend', () => {
// //   updateAcademyLabels(storyDaechiMap);
// // });

// // storyMulgeumMap.on('zoomend', () => {
// //   updateAcademyLabels(storyMulgeumMap);
// // });

// // ==================================================
// // 학원·교습소 데이터: 20개씩 순차 표시
// // ==================================================

// const ACADEMY_BATCH_SIZE = 20;

// // 데이터 로딩 상태
// const academyLoading = new Map();

// // 화면에 표시된 학원명만 관리
// const academyVisibleLabels = new Map();

// // 학원 포인트 생성
// function createAcademyMarker(feature, isLocal) {

//   if (!feature.geometry ||
//       feature.geometry.type !== 'Point') {
//     return null;
//   }

//   const coords = feature.geometry.coordinates;

//   if (!Array.isArray(coords) || coords.length < 2) {
//     return null;
//   }

//   const lng = Number(coords[0]);
//   const lat = Number(coords[1]);

//   if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
//     return null;
//   }

//   const marker = L.circleMarker([lat, lng], {
//     pane: isLocal
//       ? 'academyLocalPane'
//       : 'academyRegionPane',
//     radius: isLocal ? 3.5 : 3.5,
//     color: '#ffffff',
//     weight: isLocal ? 0.6 : 0.3,
//     fillColor: isLocal ? '#C64A99' : '#EAB4D3',
//     fillOpacity: isLocal ? 0.9 : 0.65
//   });

//   const p = feature.properties || {};

//   const name =
//     p['학원명'] ||
//     p['교습소명'] ||
//     p['시설명'] ||
//     '학원·교습소';

//   const category = p['분야명'] || '정보 없음';

//   const address =
//     p['도로명주소'] ||
//     p['주소'] ||
//     '';

//   marker.academyName = academyEscape(name);

//   // 클릭 시 팝업 생성: 초기 처리량 감소
//   // marker.bindPopup(function() {

//   //   let html =
//   //     `<b>${academyEscape(name)}</b>` +
//   //     `<br>분야: ${academyEscape(category)}`;

//   //   if (address) {
//   //     html += `<br>주소: ${academyEscape(address)}`;
//   //   }

//   //   return html;
//   // });

//   // return marker;

//   // 클릭 시 학원 정보 팝업
//   let popup =
//     `<b>${academyEscape(name)}</b>` +
//     `<br>분야: ${academyEscape(category)}`;

//   if (address) {
//     popup += `<br>주소: ${academyEscape(address)}`;
//   }

//   marker.bindPopup(popup);

//   return marker;
// }


// // 학원 데이터 다운로드 및 순차 추가
// function loadAcademyLayer(file, group, isLocal, map) {

//   if (academyLoading.has(file)) {
//     return academyLoading.get(file);
//   }

//   const loadingPromise = fetch(file)
//     .then(response => {

//       if (!response.ok) {
//         throw new Error(
//           `${file}: HTTP ${response.status}`
//         );
//       }

//       return response.json();
//     })
//     .then(data => {

//       const features = data.features || [];
//       let index = 0;

//       return new Promise(resolve => {

//         function addNextBatch() {

//           const end = Math.min(
//             index + ACADEMY_BATCH_SIZE,
//             features.length
//           );

//           for (; index < end; index++) {

//             const marker = createAcademyMarker(
//               features[index],
//               isLocal
//             );

//             if (marker) {
//               group.addLayer(marker);
//             }

//           }

//           // 20개를 추가한 뒤 브라우저에 화면 갱신 기회 제공
//           if (index < features.length) {
//             requestAnimationFrame(addNextBatch);
//           } else {
//             updateAcademyLabels(map);
//             resolve();
//           }

//         }

//         requestAnimationFrame(addNextBatch);
//       });
//     })
//     .catch(error => {
//       console.error('학원 데이터 오류:', file, error);
//       academyLoading.delete(file);
//     });

//   academyLoading.set(file, loadingPromise);

//   return loadingPromise;
// }


// // 대치4동 학원
// loadAcademyLayer(
//   'data/daechi4_academy.geojson',
//   daechiAcademyLayers,
//   true,
//   storyDaechiMap
// );

// // 강남구 전체 학원
// loadAcademyLayer(
//   'data/gangnam_academy.geojson',
//   gangnamAcademyLayers,
//   false,
//   storyDaechiMap
// );

// // 물금읍 학원
// loadAcademyLayer(
//   'data/mulgeum_academy.geojson',
//   mulgeumAcademyLayers,
//   true,
//   storyMulgeumMap
// );

// // 양산시 전체 학원
// loadAcademyLayer(
//   'data/yangsan_academy.geojson',
//   yangsanAcademyLayers,
//   false,
//   storyMulgeumMap
// );


// // ==================================================
// // 확대 시 화면에 보이는 학원명 표시
// // ==================================================

// function updateAcademyLabels(map) {

//   let visibleSet = academyVisibleLabels.get(map);

//   if (!visibleSet) {
//     visibleSet = new Set();
//     academyVisibleLabels.set(map, visibleSet);
//   }

//   // 기존 학원명 툴팁 제거
//   visibleSet.forEach(marker => {
//     if (marker.getTooltip()) {
//       marker.unbindTooltip();
//     }
//   });

//   visibleSet.clear();

//   // 05번 카드가 아니면 학원명 표시 안 함
//   const activeStep = document.querySelector(
//     '.story-step.active'
//   );

//   if (!activeStep ||
//       activeStep.dataset.step !== 'academy') {
//     return;
//   }

//   // 17배율 미만에서는 학원명 숨김
//   if (map.getZoom() < ACADEMY_LABEL_MIN_ZOOM) {
//     return;
//   }

//   const bounds = map.getBounds();

//   const groups = map === storyDaechiMap
//     ? [daechiAcademyLayers, gangnamAcademyLayers]
//     : [mulgeumAcademyLayers, yangsanAcademyLayers];

//   groups.forEach(group => {

//     if (!map.hasLayer(group)) return;

//     group.eachLayer(marker => {

//       // 현재 화면 안에 있는 학원만 표시
//       if (!bounds.contains(marker.getLatLng())) {
//         return;
//       }

//       marker.bindTooltip(marker.academyName, {
//         permanent: true,
//         direction: 'right',
//         offset: [5, 0],
//         className: 'academy-label'
//       });

//       visibleSet.add(marker);
//     });

//   });
// }


// // 지도 이동·확대가 끝나면 학원명 갱신
// [storyDaechiMap, storyMulgeumMap].forEach(map => {

//   map.on('zoomend moveend', () => {
//     updateAcademyLabels(map);
//   });

// });


// // 지역별 학원 레이어 표시
// function applyAcademyView(region) {

//   const isDaechi = region === 'daechi';

//   const map = isDaechi
//     ? storyDaechiMap
//     : storyMulgeumMap;

//   const localGroup = isDaechi
//     ? daechiAcademyLayers
//     : mulgeumAcademyLayers;

//   const regionGroup = isDaechi
//     ? gangnamAcademyLayers
//     : yangsanAcademyLayers;

//   const mode = academyView[region];

//   // 두 레이어를 먼저 제거
//   map.removeLayer(localGroup);
//   map.removeLayer(regionGroup);

//   // 전체 지역은 아래, 핵심 지역은 위
//   if (mode === 'all') {
//     regionGroup.addTo(map);
//   }

//   localGroup.addTo(map);

//   // 선택 범위에 맞춰 지도 이동
//   const boundaryFile = isDaechi
//     ? (mode === 'all'
//         ? 'data/gangnam_boundary.geojson'
//         : 'data/daechi4_boundary.geojson')
//     : (mode === 'all'
//         ? 'data/yangsan_boundary.geojson'
//         : 'data/mulgeum_boundary.geojson');

//   fetch(boundaryFile)
//     // .then(response => response.json())
//     // .then(data => {
//     //   if (!document.querySelector(
//     //     '.story-step[data-step="academy"].active'
//     //   )) return;

//     //   const bounds = L.geoJSON(data).getBounds();

//     //   if (bounds.isValid()) {
//     //     map.fitBounds(bounds, {
//     //       padding: [20, 20]
//     //     });
//     //   }
//     // });
//     .then(response => {
//     if (!response.ok) {
//       throw new Error(
//         `${boundaryFile}: HTTP ${response.status}`
//       );
//     }
//     return response.json();
//   })
//   .then(data => {

//     const activeStep = document.querySelector(
//       '.story-step.active'
//     );

//     if (!activeStep ||
//         activeStep.dataset.step !== 'academy') {
//       return;
//     }

//     const bounds = L.geoJSON(data).getBounds();

//     if (bounds.isValid()) {
//       map.fitBounds(bounds, {
//         padding: [20, 20]
//       });
//     } else {
//       console.error('지도 경계가 유효하지 않습니다:', boundaryFile);
//     }

//   })
//   .catch(error => {
//     console.error('학원 지도 범위 변경 실패:', error);
//   });

//   // updateAcademyLabels(map);
//   requestAnimationFrame(() => {
//     updateAcademyLabels(map);
//   });
// }

// // 지도 내부 버튼 생성
// function createAcademyControl(map, region) {

//   const control = L.control({
//     position: 'topright'
//   });

//   control.onAdd = function() {

//     const container = L.DomUtil.create(
//       'div',
//       'academy-map-control'
//     );

//     const isDaechi = region === 'daechi';

//     const localName = isDaechi
//       ? '대치4동'
//       : '물금읍';

//     const regionName = isDaechi
//       ? '강남구 전체'
//       : '양산시 전체';

//     container.innerHTML = `
//       <button type="button" data-mode="local"
//         class="selected">${localName}</button>
//       <button type="button" data-mode="all">
//         ${regionName}</button>
//     `;

//     L.DomEvent.disableClickPropagation(container);
//     L.DomEvent.disableScrollPropagation(container);

//     container.querySelectorAll('button').forEach(button => {

//       // button.addEventListener('click', () => {
//       button.addEventListener('click', (event) => {

//         event.preventDefault();
//         event.stopPropagation();

//         const mode = button.dataset.mode;

//         console.log('학원 버튼 클릭:', region, mode);

//         academyView[region] = mode;

//         container.querySelectorAll('button').forEach(b => {
//           b.classList.toggle(
//             'selected',
//             b.dataset.mode === mode
//           );
//         });

//         applyAcademyView(region);
//       });

//     });

//     return container;
//   };

//   control.addTo(map);
//   return control.getContainer();
// }

// const daechiAcademyControl = createAcademyControl(
//   storyDaechiMap,
//   'daechi'
// );

// const mulgeumAcademyControl = createAcademyControl(
//   storyMulgeumMap,
//   'mulgeum'
// );

// // 최초에는 버튼 숨김
// daechiAcademyControl.style.display = 'none';
// mulgeumAcademyControl.style.display = 'none';

// // ==================================================
// // 3-3-3. 학교 도보 5분·10분 접근성
// // ==================================================

// // const daechiWalkingLayers = L.layerGroup();
// // const mulgeumWalkingLayers = L.layerGroup();

// // // 도보권은 학교 위치보다 아래에 표시
// // [storyDaechiMap, storyMulgeumMap].forEach(map => {
// //   map.createPane('walkingPane');
// //   map.getPane('walkingPane').style.zIndex = 425;
// // });

// // function loadWalkingLayer(file, group, minutes) {
// //   fetch(file)
// //     .then(response => {
// //       if (!response.ok) {
// //         throw new Error(`${file}: HTTP ${response.status}`);
// //       }
// //       return response.json();
// //     })
// //     .then(data => {
// //       const layer = L.geoJSON(data, {
// //         pane: 'walkingPane',
// //         style: {
// //           color: minutes === 5 ? '#835BB9' : '#A68BCE',
// //           weight: 1,
// //           fillColor: minutes === 5 ? '#9C79D0' : '#D9C9F2',
// //           fillOpacity: minutes === 5 ? 0.55 : 0.45
// //         },
// //         onEachFeature: (feature, featureLayer) => {
// //           featureLayer.bindPopup(`학교 도보 ${minutes}분 이내`);
// //         }
// //       });

// //       layer.addTo(group);
// //     })
// //     .catch(error => {
// //       console.error('도보권 데이터 오류:', file, error);
// //     });
// // }

// // // 10분권을 먼저 추가하고 5분권을 나중에 추가
// // loadWalkingLayer(
// //   'data/daechi4_walk_10min.geojson',
// //   daechiWalkingLayers,
// //   10
// // );

// // loadWalkingLayer(
// //   'data/daechi4_walk_5min.geojson',
// //   daechiWalkingLayers,
// //   5
// // );

// // loadWalkingLayer(
// //   'data/mulgeum_walk_10min.geojson',
// //   mulgeumWalkingLayers,
// //   10
// // );

// // loadWalkingLayer(
// //   'data/mulgeum_walk_5min.geojson',
// //   mulgeumWalkingLayers,
// //   5
// // );

// // 지역별·시간별 도보권 레이어 분리
// const walkingLayers = {
//   daechi: {
//     5: L.layerGroup(),
//     10: L.layerGroup()
//   },
//   mulgeum: {
//     5: L.layerGroup(),
//     10: L.layerGroup()
//   }
// };

// // 버튼 선택 상태: 기본값은 모두 표시
// const walkingVisible = {
//   daechi: { 5: true, 10: true },
//   mulgeum: { 5: true, 10: true }
// };

// // 10분권은 아래, 5분권은 위, 학교는 가장 위
// [storyDaechiMap, storyMulgeumMap].forEach(map => {
//   map.createPane('walking10Pane');
//   map.getPane('walking10Pane').style.zIndex = 421;

//   map.createPane('walking5Pane');
//   map.getPane('walking5Pane').style.zIndex = 425;
// });

// // GeoJSON 불러오기
// function loadWalkingLayer(file, group, minutes) {
//   fetch(file)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`${file}: HTTP ${response.status}`);
//       }
//       return response.json();
//     })
//     .then(data => {
//       L.geoJSON(data, {
//         pane: minutes === 5
//           ? 'walking5Pane'
//           : 'walking10Pane',

//         style: {
//           color: minutes === 5 ? '#835BB9' : '#A68BCE',
//           weight: 1,
//           fillColor: minutes === 5 ? '#9C79D0' : '#D9C9F2',
//           fillOpacity: minutes === 5 ? 0.55 : 0.45
//         },

//         onEachFeature: (feature, layer) => {
//           layer.bindPopup(`학교 도보 ${minutes}분 이내`);
//         }
//       }).addTo(group);
//     })
//     .catch(error => {
//       console.error('도보권 데이터 오류:', file, error);
//     });
// }

// // 지역별 GeoJSON 로드
// loadWalkingLayer(
//   'data/daechi4_walk_5min.geojson',
//   walkingLayers.daechi[5],
//   5
// );

// loadWalkingLayer(
//   'data/daechi4_walk_10min.geojson',
//   walkingLayers.daechi[10],
//   10
// );

// loadWalkingLayer(
//   'data/mulgeum_walk_5min.geojson',
//   walkingLayers.mulgeum[5],
//   5
// );

// loadWalkingLayer(
//   'data/mulgeum_walk_10min.geojson',
//   walkingLayers.mulgeum[10],
//   10
// );

// // 선택 상태에 따라 지도 표시 갱신
// function updateWalkingView(region) {
//   const map = region === 'daechi'
//     ? storyDaechiMap
//     : storyMulgeumMap;

//   [5, 10].forEach(minutes => {
//     const layer = walkingLayers[region][minutes];

//     if (walkingVisible[region][minutes]) {
//       if (!map.hasLayer(layer)) {
//         layer.addTo(map);
//       }
//     } else {
//       if (map.hasLayer(layer)) {
//         map.removeLayer(layer);
//       }
//     }
//   });
// }

// // 지도 오른쪽 상단 ON/OFF 버튼 생성
// function createWalkingControl(map, region) {
//   const control = L.control({ position: 'topright' });

//   control.onAdd = function() {
//     const container = L.DomUtil.create(
//       'div',
//       'walking-map-control'
//     );

//     container.innerHTML = `
//       <button type="button" data-minutes="5" class="selected">
//         도보 5분
//       </button>
//       <button type="button" data-minutes="10" class="selected">
//         도보 10분
//       </button>
//     `;

//     L.DomEvent.disableClickPropagation(container);
//     L.DomEvent.disableScrollPropagation(container);

//     container.querySelectorAll('button').forEach(button => {
//       button.addEventListener('click', event => {
//         event.preventDefault();
//         event.stopPropagation();

//         const minutes = Number(button.dataset.minutes);

//         walkingVisible[region][minutes] =
//           !walkingVisible[region][minutes];

//         button.classList.toggle(
//           'selected',
//           walkingVisible[region][minutes]
//         );

//         updateWalkingView(region);
//       });
//     });

//     return container;
//   };

//   control.addTo(map);
//   return control.getContainer();
// }

// const daechiWalkingControl = createWalkingControl(
//   storyDaechiMap,
//   'daechi'
// );

// const mulgeumWalkingControl = createWalkingControl(
//   storyMulgeumMap,
//   'mulgeum'
// );

// // 최초에는 버튼 숨김
// daechiWalkingControl.style.display = 'none';
// mulgeumWalkingControl.style.display = 'none';
// // ==================================================
// // 3-4. 스토리 지도 범례
// // ==================================================

// const storyLegend = document.getElementById('story-legend');


// function updateLegend(type) {

//   // 총인구
//   if (type === 'population') {

//     storyLegend.innerHTML = `
//       <span class="legend-title">총인구(명)</span>

//       <span class="legend-item">
//         <span class="legend-color" style="background:#DEEBF7;"></span>
//         1~50
//       </span>

//       <span class="legend-item">
//         <span class="legend-color" style="background:#9ECAE1;"></span>
//         51~100
//       </span>

//       <span class="legend-item">
//         <span class="legend-color" style="background:#6BAED6;"></span>
//         101~250
//       </span>

//       <span class="legend-item">
//         <span class="legend-color" style="background:#4292C6;"></span>
//         251~500
//       </span>

//       <span class="legend-item">
//         <span class="legend-color" style="background:#2171B5;"></span>
//         501 이상
//       </span>
//     `;
//   }


//   // 학령인구
//   if (type === 'school-age') {

//     storyLegend.innerHTML = `
//       <span class="legend-title">학령인구(명)</span>

//       <span class="legend-item">
//         <span class="legend-color" style="background:#FEE0D2;"></span>
//         1~30
//       </span>

//       <span class="legend-item">
//         <span class="legend-color" style="background:#FC9272;"></span>
//         31~60
//       </span>

//       <span class="legend-item">
//         <span class="legend-color" style="background:#FB6A4A;"></span>
//         61~90
//       </span>

//       <span class="legend-item">
//         <span class="legend-color" style="background:#EF3B2C;"></span>
//         91~120
//       </span>

//       <span class="legend-item">
//         <span class="legend-color" style="background:#CB181D;"></span>
//         121 이상
//       </span>
//     `;

//   }

//   // 학교
//   if (type === 'school') {
//       storyLegend.innerHTML = `
//         <span class="legend-title">학교 구분</span>

//         <span class="legend-item">
//           <span class="legend-color"
//                 style="background:#F2C94C;"></span>
//           초등학교
//         </span>

//         <span class="legend-item">
//           <span class="legend-color"
//                 style="background:#49A87A;"></span>
//           중학교
//         </span>

//         <span class="legend-item">
//           <span class="legend-color"
//                 style="background:#F2994A;"></span>
//           고등학교
//         </span>
//       `;
//   }

//   // 학원·교습소 범례
//   if (type === 'academy') {

//     storyLegend.innerHTML = `
//       <span class="legend-title">학원·교습소</span>

//       <span class="legend-item">
//         <span class="legend-color"
//               style="background:#EAB4D3;"></span>
//         강남구·양산시
//       </span>

//       <span class="legend-item">
//         <span class="legend-color"
//               style="background:#C64A99;"></span>
//         대치4동·물금읍
//       </span>
//     `;

//   }

//   // 도보권
//   if (type === 'walking') {
//     storyLegend.innerHTML = `
//       <span class="legend-title">학교 도보 접근성</span>

//       <span class="legend-item">
//         <span class="legend-color"
//               style="background:#9C79D0;"></span>
//         도보 5분
//       </span>

//       <span class="legend-item">
//         <span class="legend-color"
//               style="background:#D9C9F2;"></span>
//         도보 10분
//       </span>
//     `;
//   }
// }


// // 최초 화면은 총인구 범례
// updateLegend('population');