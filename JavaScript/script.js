let map;
// 1.出租车
var taxiMarkers = [];
let taxiLayerVisible = false;
// 2.地铁站
// 保存从 GeoJSON 加载的每个站点 feature（以 Station_Code 为 key）
const stationFeatures = {};
// 判断 GeoJSON 是否已加载
let railGeoJsonLoaded = false;
// 3.交通事故
var incidentMarkers = [];
let incidentLayerVisible = false;
// 4.交通拍照
var cameraMarkers = [];
let cameraLayerVisible = false;
// 5.路网数据
const networkFeatures = {};
let networkGeoJsonLoaded = false;
let networkData;

//1.初始化地图
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 1.3521, lng: 103.8198 }, // 新加坡
        zoom: 12,
        scaleControl: true,  // 启用比例尺
        rotateControl: true, // 启用旋转控件，显示指北针
        mapTypeControl: true, // 显示地图类型控件，方便切换视图
        streetViewControl: true, // 启用街景视图控件
        styles: [
            // =============== 隐藏商店及其标签 ===============
            {
                "featureType": "poi.business",
                "elementType": "all",
                "stylers": [
                    { "visibility": "off" }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [
                    { "visibility": "off" }
                ]
            },
            // =============== 整体深色背景 ===============
            {
                "elementType": "geometry",
                "stylers": [
                    { "color": "#1d2c4d" }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    { "color": "#8ec3b9" }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    { "color": "#1a3646" }
                ]
            },

            // =============== 行政区划 ===============
            {
                "featureType": "administrative.country",
                "elementType": "geometry.stroke",
                "stylers": [
                    { "color": "#4b6878" }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    { "color": "#e0e0e0" } // 行政标签文字
                ]
            },

            // =============== 自然景观（公园、草地等） ===============
            {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [
                    { "color": "#023e58" } // 深蓝绿色
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                    { "color": "#023e58" }
                ]
            },

            // =============== 道路 ===============
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    { "color": "#304a7d" }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    { "color": "#98a5be" }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.stroke",
                "stylers": [
                    { "color": "#1d2c4d" }
                ]
            },

            // =============== 高速公路 ===============
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    { "color": "#2c6675" }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    { "color": "#255763" }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                    { "color": "#b0d5ce" }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.stroke",
                "stylers": [
                    { "color": "#023e58" }
                ]
            },

            // =============== 交通线（地铁、公交等） ===============
            {
                "featureType": "transit",
                "elementType": "labels.text.fill",
                "stylers": [
                    { "color": "#98a5be" }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "labels.text.stroke",
                "stylers": [
                    { "color": "#1d2c4d" }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry.fill",
                "stylers": [
                    { "color": "#283d6a" }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [
                    { "color": "#3a4762" }
                ]
            },

            // =============== 水体 ===============
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    { "color": "#0e1626" }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    { "color": "#4e6d70" }
                ]
            },
                // =============== 隐藏小区名称 ===============
            {
                "featureType": "landscape",
                "elementType": "labels",
                "stylers": [
                    { "visibility": "off" }
                ]
            },
            // =============== 隐藏街道名称 ===============
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    { "visibility": "off" }
                ]
            }
                ]
    });

// 绑定 Rail Station 复选框事件
document.getElementById("railLayer").addEventListener("change", function(e) {
    const visible = e.target.checked;
    if (visible) {
        // 当复选框选中时，将 data 层绑定到地图上
        map.data.setMap(map);
        // 如果数据尚未加载，则加载 GeoJSON 并记录 feature 对象
        if (!railGeoJsonLoaded) {
            map.data.loadGeoJson("https://raw.githubusercontent.com/thinkaboutyuchao/Singapore-Smart-City/refs/heads/main/Data/RailStations/RailStations.geojson", null, function(features) {
                features.forEach(feature => {
                    // 假设每个 feature 的属性中有 "Code_for_L" 字段用于匹配
                    const code = feature.getProperty("Code_for_L");
                    if (code) {
                        // 如果 stationFeatures 中已存在该 code，则添加到数组，否则初始化数组
                        if (!stationFeatures[code]) {
                            stationFeatures[code] = [];
                        }
                        stationFeatures[code].push(feature);
                    }
                });
                // 初始样式（例如填充透明）
                map.data.setStyle({
                    fillOpacity: 0,
                    strokeWeight: 1,
                    strokeColor: "#FFFFFF"
                });
                railGeoJsonLoaded = true;
                // 加载完成后调用 API 数据更新样式
                fetchCrowdData();
            });
        } else {
            // 如果数据已加载，则直接调用 API 更新样式
            fetchCrowdData();
        }
    } else {
        // 当取消选中时，隐藏 GeoJSON 层
        map.data.setMap(null);
    }
});

networkData = new google.maps.Data();
// 使用 fetch 从相对路径加载 路网 数据
document.getElementById("networkLayer").addEventListener("change", function (e) {
    const visible = e.target.checked;
    console.log("networkLayer changed:", visible);
    
    if (visible) {
        networkData.setMap(map);
        
        if (!networkGeoJsonLoaded) {
            const networkGeoJsonUrl = new URL("https://raw.githubusercontent.com/thinkaboutyuchao/Singapore-Smart-City/refs/heads/main/Data/NetWork/NetWork.geojson", window.location.href).href;
            
            networkData.loadGeoJson(networkGeoJsonUrl, null, function (features) {
                console.log("路网 GeoJSON 加载完成，应用默认样式...");
                
                // 设置一个自定义默认样式，例如灰色线条
                networkData.setStyle({
                    strokeColor: '#EEEEEE', // 自定义默认颜色
                    strokeWeight: 0.75
                });

                networkGeoJsonLoaded = true;

                // 确保 GeoJSON 解析完成后再执行 fetchNetworkData
                setTimeout(() => {
                    fetchNetworkData();
                }, 500); // 增加少量延迟，避免异步问题
            });
        } else {
            fetchNetworkData();
        }
    } else {
        networkData.setMap(null);
    }
});


// 3. 面板显示/隐藏逻辑
const layerPanel = document.getElementById("layerPanel");
const toggleButton = document.getElementById("LayerButton");

toggleButton.addEventListener("click", () => {
    layerPanel.style.right = layerPanel.style.right === "60px" ? "-240px" : "60px";
});

}



