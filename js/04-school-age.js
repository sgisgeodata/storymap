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
// 학령인구 시계열 그래프 (2015~2024)
// ==================================================

const schoolAgePopulation = [
  { year: 2015, mulgeum: 9824, daechi4: 2665 },
  { year: 2016, mulgeum: 11128, daechi4: 2521 },
  { year: 2017, mulgeum: 13043, daechi4: 2421 },
  { year: 2018, mulgeum: 14437, daechi4: 2406 },
  { year: 2019, mulgeum: 15260, daechi4: 2232 },
  { year: 2020, mulgeum: 15977, daechi4: 2313 },
  { year: 2021, mulgeum: 16854, daechi4: 2178 },
  { year: 2022, mulgeum: 17448, daechi4: 2084 },
  { year: 2023, mulgeum: 17978, daechi4: 1944 },
  { year: 2024, mulgeum: 18097, daechi4: 1900 }
];

let schoolAgeTrendFrame = null;
let schoolAgeTrendToken = 0;

function stopSchoolAgeTrend() {
  schoolAgeTrendToken++;

  if (schoolAgeTrendFrame !== null) {
    cancelAnimationFrame(schoolAgeTrendFrame);
    schoolAgeTrendFrame = null;
  }
}

function renderSchoolAgeTrend() {
  const container = document.getElementById(
    'school-age-trend-chart'
  );

  if (!container) return;

  stopSchoolAgeTrend();

  const token = schoolAgeTrendToken;
  const NS = 'http://www.w3.org/2000/svg';

  const W = 800;
  const H = 400;

  const left = 75;
  const right = 100;
  const top = 45;
  const bottom = 60;

  const plotW = W - left - right;
  const plotH = H - top - bottom;

  const maxY = 20000;
  const lastIndex = schoolAgePopulation.length - 1;

  const x = i => left + (i / lastIndex) * plotW;
  const y = value => top + (1 - value / maxY) * plotH;

  const svg = document.createElementNS(NS, 'svg');

  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute(
    'aria-label',
    '2015년부터 2024년까지 물금읍과 대치4동 학령인구 변화'
  );

  function element(tag, attrs, text, parent = svg) {
    const el = document.createElementNS(NS, tag);

    Object.entries(attrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });

    if (text !== undefined) {
      el.textContent = text;
    }

    parent.appendChild(el);
    return el;
  }

  // Y축 눈금
  for (let value = 0; value <= 20000; value += 5000) {
    const yy = y(value);

    element('line', {
      x1: left,
      y1: yy,
      x2: W - right,
      y2: yy,
      stroke: '#e7eceb',
      'stroke-width': 1
    });

    element('text', {
      x: left - 12,
      y: yy + 4,
      'text-anchor': 'end',
      'font-size': 12,
      fill: '#777'
    }, value.toLocaleString('ko-KR'));
  }

  // X축 연도
  schoolAgePopulation.forEach((d, i) => {
    element('text', {
      x: x(i),
      y: H - bottom + 27,
      'text-anchor': 'middle',
      'font-size': 11,
      fill: '#777'
    }, String(d.year));
  });

  element('text', {
    x: left,
    y: 20,
    'font-size': 12,
    fill: '#777'
  }, '학령인구(명)');

  // 두 선을 같은 연도까지 보여주기 위한 클리핑 영역
  const defs = element('defs', {});

  const clipPath = element(
    'clipPath',
    { id: 'school-age-trend-clip' },
    undefined,
    defs
  );

  const clipRect = element('rect', {
    x: left - 4,
    y: 0,
    width: 4,
    height: H
  }, undefined, clipPath);

  const lineGroup = element('g', {
    'clip-path': 'url(#school-age-trend-clip)'
  });

  const series = [
    {
      key: 'mulgeum',
      color: '#36A99B'
    },
    {
      key: 'daechi4',
      color: '#E67E93'
    }
  ];

  const dots = [];
  // 연도별 포인트를 저장할 배열
  const yearPoints = [];
  const yearPointLabels = [];

  series.forEach(s => {
    const points = schoolAgePopulation.map((d, i) => ({
      x: x(i),
      y: y(d[s.key])
    }));
  // 각 연도 위치에 동그란 포인트 생성
  // 처음에는 숨겨 두었다가 선이 도달하면 표시
  const pointCircles = points.map((p, i) => {

    return element('circle', {
      cx: p.x,
      cy: p.y,
      r: 4.5,
      fill: s.color,
      stroke: '#ffffff',
      'stroke-width': 2,
      opacity: 0
    });

  });

yearPoints.push(pointCircles);

// 각 연도에 도착했을 때 남길 숫자
const pointValues = points.map((p, i) => {

  return element('text', {
    x: p.x,
    y: p.y - (i % 2 === 0 ? 13 : 27),
    'text-anchor': 'middle',
    'font-size': 11,
    'font-weight': 600,
    fill: s.color,
    opacity: 0
  }, schoolAgePopulation[i][s.key].toLocaleString('ko-KR'));

});

yearPointLabels.push(pointValues);

const pathData = points.map((p, i) =>
  `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
).join(' ');

element('path', {
  d: pathData,
  fill: 'none',
  stroke: s.color,
  'stroke-width': 3.5,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, undefined, lineGroup);

const dot = element('circle', {
  cx: points[0].x,
  cy: points[0].y,
  r: 5,
  fill: s.color,
  stroke: '#ffffff',
  'stroke-width': 2
});

dots.push({ dot, points, key: s.key });
});

container.replaceChildren(svg);

const duration = 3000;
let startTime = null;

function animate(timestamp) {
  if (token !== schoolAgeTrendToken) return;

  if (startTime === null) startTime = timestamp;

  const progress = Math.min(
    (timestamp - startTime) / duration,
    1
);

// 모든 선이 같은 연도 위치까지 나타남
const position = progress * lastIndex;

const currentIndex = Math.min(
  Math.floor(position),
  lastIndex - 1
);

const fraction = Math.min(
  position - currentIndex,
  1
);

const currentX = x(0) + progress * plotW;

// 현재 애니메이션이 도달한 연도까지 포인트 표시
// yearPoints.forEach(pointCircles => {

//   pointCircles.forEach((circle, i) => {

//     const reached = position >= i;

//     circle.setAttribute(
//       'opacity',
//       reached ? 1 : 0
//     );

//   });

// });
// 해당 연도에 도달하면 포인트와 숫자를 함께 표시
yearPoints.forEach((pointCircles, seriesIndex) => {

  pointCircles.forEach((circle, i) => {

    const reached = position >= i;

    circle.setAttribute('opacity', reached ? 1 : 0);

    yearPointLabels[seriesIndex][i].setAttribute(
      'opacity',
      reached ? 1 : 0
    );

  });

});



  clipRect.setAttribute(
    'width',
    Math.max(4, currentX - left + 4)
  );

  // 선 끝의 움직이는 포인트만 업데이트
  dots.forEach(({ dot, points }) => {
    const a = points[currentIndex];
    const b = points[currentIndex + 1];

    const currentY = a.y + (b.y - a.y) * fraction;

    dot.setAttribute('cx', currentX);
    dot.setAttribute('cy', currentY);
  });

  if (progress < 1) {
    schoolAgeTrendFrame = requestAnimationFrame(animate);
  } else {
    schoolAgeTrendFrame = null;
  }
}

  // 모션 감소 설정을 사용하는 이용자 배려
  if (window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches) {

    // 모든 연도 포인트 표시
    yearPoints.forEach(pointCircles => {
      pointCircles.forEach(circle => {
        circle.setAttribute('opacity', 1);
      });
    });

    // 모든 연도 숫자 표시
    yearPointLabels.forEach(pointValues => {
      pointValues.forEach(label => {
        label.setAttribute('opacity', 1);
      });
    });

    // 선 전체 표시
    clipRect.setAttribute('width', plotW + 4);

    // 움직이는 포인트를 마지막 연도로 이동
    dots.forEach(({ dot, points }) => {
      dot.setAttribute('cx', points[lastIndex].x);
      dot.setAttribute('cy', points[lastIndex].y);
    });

    return;
  }

  schoolAgeTrendFrame = requestAnimationFrame(animate);
}