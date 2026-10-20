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

