
# 필요한 패키지
library(sf)
library(leaflet)
library(htmlwidgets)
library(htmltools)
library(DT)

# 1. 행정구역 데이터

# 읍면동 경계
geoheung_boundary_dong <- st_read("행정구역/bnd_dong_고흥군_2025.shp")
geoheung_boundary_dong_4326 <- st_transform(geoheung_boundary_dong, 4326)

# 시군구 경계
geoheung_boundary_sigungu <- st_read("행정구역/bnd_sigungu_고흥군_2025.shp")
geoheung_boundary_sigungu_4326 <- st_transform(geoheung_boundary_sigungu, 4326)

# 2. 의료서비스 접근성 영역

# 도보 20분 영역
geoheung_ORS_20walk <- st_read("ORS영역/지역보건의료기관 및 병원_도보20분.gpkg")
geoheung_ORS_20walk_4326 <- st_transform(geoheung_ORS_20walk, 4326)

# 자동차 5분 영역
geoheung_ORS_5drive <- st_read("ORS영역/지역보건의료기관 및 병원_자동차5분.gpkg")
geoheung_ORS_5drive_4326 <- st_transform(geoheung_ORS_5drive, 4326)

# 3. 의료기관 위치 데이터

# 병원
geoheung_hospital <- st_read("병원보건소/병원정보서비스_고흥군.gpkg")
geoheung_hospital_4326 <- st_transform(geoheung_hospital, 4326)

# 보건소 및 지역보건의료기관
geoheung_health_center <- st_read("병원보건소/지역보건의료기관_고흥군.gpkg")
geoheung_health_center_4326 <- st_transform(geoheung_health_center, 4326)

# 4. 인구 데이터

# 도보 20분 이내 인구
geoheung_pop_20walk <- st_read("격자인구/grid_고흥군_인구_1K_도보20분.shp")
geoheung_pop_20walk_4326 <- st_transform(geoheung_pop_20walk, 4326)

# 자동차 5분 이내 인구
geoheung_pop_5drive <- st_read("격자인구/grid_고흥군_인구_1K_자동차5분.shp")
geoheung_pop_5drive_4326 <- st_transform(geoheung_pop_5drive, 4326)

# 인구 데이터 통합
all_pop <- c(geoheung_pop_20walk_4326$age65plus, geoheung_pop_5drive_4326$age65plus)

# 단계구분도 계급 설정
pop_bins <- pretty(range(all_pop, na.rm = TRUE),n = 5)

# 단계구분도 계급 직접 지정
pop_bins <- c(0, 25, 50, 75, 100, 120, 145)


# 단계구분도 색상 설정
pal_pop <- colorBin(palette = "YlOrRd",domain = all_pop, bins = pop_bins, na.color = "transparent")

# 통합 지도 생성
map <- leaflet(options = leafletOptions(preferCanvas = TRUE))|>
  
  # 5. 배경지도
  # OpenStreetMap 일반지도
  addTiles(group = "OpenStreetMap") |>
  
  # Esri 위성지도
  addProviderTiles(providers$Esri.WorldImagery, group = "Esri 위성지도") |>
  
  # 행정구역 경계
  addPolygons(data = geoheung_boundary_sigungu_4326, color = "red", weight = 3, fill = FALSE, group = "고흥군 경계") |>
  addPolygons(data = geoheung_boundary_dong_4326, color = "blue", weight = 1.2, fill = FALSE, group = "읍면동 경계") |> 
  
  # 의료서비스 접근성 영역
  # 도보 20분 영역
  addPolygons(data = geoheung_ORS_20walk_4326, color = "#ff9422", weight = 2, fillColor = "#ff9422", fillOpacity = 0.25, group = "도보 20분 영역") |>
  
  # 자동차 5분 영역
  addPolygons(data = geoheung_ORS_5drive_4326, color = "#BA55D3", weight = 2, fillColor = "#BA55D3", fillOpacity = 0.25, group = "자동차 5분 영역") |>
  
  # 의료기관 위치
  # 병원
  addCircleMarkers(data = geoheung_hospital_4326, radius = 6, color = "white", weight = 1.5, fillColor = "red", fillOpacity = 1, 
                   group = "병원", popup = ~요양기관명, label = ~요양기관명) |>
  
  # 보건소 및 지역보건의료기관
  addCircleMarkers(data = geoheung_health_center_4326, radius = 7, color = "white", weight = 1.5, fillColor = "blue", fillOpacity = 1,
                   group = "보건의료기관", popup = ~보건기관명, label = ~보건기관명) |>
  
  # 도보 20분 인구 단계구분도
  addPolygons(data = geoheung_pop_20walk_4326, fillColor = ~pal_pop(age65plus), fillOpacity = 0.75, color = "white", weight = 0.3,
              group = "도보 20분 인구", popup = ~paste0("<b>도보 20분 인구</b><br>", "인구수: ", format(age65plus, big.mark = ","), "명")
  ) |>
  
  # 자동차 5분 인구 단계구분도
  addPolygons(data = geoheung_pop_5drive_4326, fillColor = ~pal_pop(age65plus), fillOpacity = 0.75, color = "white", weight = 0.3,
              group = "자동차 5분 인구", popup = ~paste0("<b>자동차 5분 인구</b><br>", "인구수: ", format(age65plus, big.mark = ","), "명")
  ) |>
  
  # 인구 범례 추가
  addLegend(position = "bottomright", pal = pal_pop, values = all_pop, title = "격자별 인구수(명)", opacity = 0.8, layerId = "population_legend",
            className = "info legend population-legend"
  ) |>
  
  # 레이어 선택 기능
  addLayersControl(baseGroups = c("OpenStreetMap","Esri 위성지도"),
    
  overlayGroups = c("병원", "보건의료기관", "고흥군 경계", "읍면동 경계", "도보 20분 영역", "자동차 5분 영역", "도보 20분 인구", "자동차 5분 인구"),
    
  options = layersControlOptions(collapsed = FALSE))

# 인구 레이어 선택에 따른 범례 표시 제어
map <- htmlwidgets::onRender(map,
  "function(el, x) {
   var map = this;
   // 범례 요소 찾기
    var legend = el.querySelector('.population-legend');

    var popLayers = ['도보 20분 인구', '자동차 5분 인구'];

    // 범례 표시 및 숨김 함수
    function updateLegend() {
      var showLegend = false;
      popLayers.forEach(function(name) {
      var layers = map.layerManager.getLayerGroup(name);
      if (layers && map.hasLayer(layers)) {showLegend = true;}
      });

      if (legend) {legend.style.display = showLegend ? '' : 'none';}
    }

    // 지도가 처음 실행될 때 범례 숨기기
    if (legend) {legend.style.display = 'none';}

    // 인구 레이어 선택 및 해제 감지
    map.on('overlayadd', updateLegend);
    map.on('overlayremove', updateLegend);
    updateLegend();
  }"
)
  
# 고흥군 전체 영역으로 화면 설정
bbox <- st_bbox(geoheung_boundary_sigungu_4326)

map <- map |>
  fitBounds(
    lng1 = unname(bbox["xmin"]),
    lat1 = unname(bbox["ymin"]),
    lng2 = unname(bbox["xmax"]),
    lat2 = unname(bbox["ymax"])
  )

# HTML 파일 저장
htmlwidgets::saveWidget(map, file = "Geoheung country ORS reach area analysis.html", selfcontained = TRUE)

# Viewer에 지도 출력
map