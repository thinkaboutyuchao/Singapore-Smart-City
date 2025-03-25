// 地铁线路定义
const TRAIN_LINES = ['CCL', 'CEL', 'CGL', 'DTL', 'EWL', 'NEL', 'NSL', 'BPL', 'SLRT', 'PLRT', 'TEL'];

// 根据拥挤度返回填充颜色的函数
function getFillColor(crowdLevel) {
    switch(crowdLevel) {
        case "l": return "#2e8b57";  // 低拥挤：绿色
        case "m": return "#FFD700";  // 中等：黄色
        case "h": return "#FF0000";  // 高：红色
        default:  return "#D3D3D3"  // 默认白色
    }
}

// 更新 fetchCrowdData 函数，确保正确匹配 GeoJSON 的 Code_for_L 和 API 返回的 Station
function fetchCrowdData() {
    fetch("https://internetgisapi-e6aabmhqezhgf3b9.eastasia-01.azurewebsites.net/crowd")
        .then(response => response.json())
        .then(data => {
            const stations = TRAIN_LINES.map(line => {
                if (data[line] && Array.isArray(data[line].value)) {
                    return data[line].value.map(station => ({
                        ...station,
                        line: line
                    }));
                } else {
                    console.warn(`No data found for line: ${line}`);
                    return [];
                }
            }).flat();

            stations.forEach(station => {
                const code = station.Station;  // 使用 Station 名称匹配 Code_for_L
                const crowdLevel = station.CrowdLevel;
                if (crowdLevel && stationFeatures[code]) {
                    // 遍历所有 feature，为每个 feature 更新样式
                    stationFeatures[code].forEach(feature => {
                        map.data.overrideStyle(feature, {
                            fillColor: getFillColor(crowdLevel),
                            fillOpacity: 0.6,
                            strokeColor: "#000000",
                            strokeWeight: 1
                        });
                    });
                } else {
                    console.warn(`No valid crowdLevel or station feature for station: ${station.Station}`);
                }
            });
        })
        .catch(error => console.error("Error fetching crowd data:", error));
}
