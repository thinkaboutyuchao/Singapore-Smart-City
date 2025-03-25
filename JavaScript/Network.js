// 根据 SpeedBand 返回颜色，SpeedBand 值越大表示越不拥堵
function getRoadColor(speedBand) {
    const band = Number(speedBand);
    // 这里假设 SpeedBand 范围较大，根据实际情况调整临界值
    if (band >= 8) {
        return "#2e8b57";  // 低拥堵：绿色
    } else if (band >= 5) {
        return "#FFD700";  // 中等：黄色
    } else {
        return "#FF0000";  // 高拥堵：红色
    }
}

// 更新路网数据染色函数
function fetchNetworkData() {
    fetch("https://internetgisapi-e6aabmhqezhgf3b9.eastasia-01.azurewebsites.net/traffic_speed")
        .then(response => {
            console.log("API 请求成功，状态码：", response.status);
            return response.json();
        })
        .then(data => {
            console.log("API 返回的数据：", data);

            if (!networkGeoJsonLoaded) {
                console.warn("GeoJSON 数据未加载，无法更新路网颜色！");
                return;
            }
        
            // 如果 data.value 存在，则使用它作为路网数组(一开始没有处理好，直接把返回的数据当value了，返回的数据前两个是时间戳)
            const roads = data.value ? data.value : (Array.isArray(data) ? data : [data]);
        
            roads.forEach(road => {
                const roadName = road.RoadName ? road.RoadName.trim().toLowerCase() : "";
                const speedBand = road.SpeedBand;
        
                if (!roadName || speedBand === undefined) {
                    console.warn(`无效的路网数据：${JSON.stringify(road)}`);
                    return;
                }
        
                let found = false;
        
                networkData.forEach(dataFeature => {
                    const featureRoadName = dataFeature.getProperty("Name_Link");
                    if (!featureRoadName) return;
        
                    if (featureRoadName.trim().toLowerCase().includes(roadName)) {
                        found = true;
                        const color = getRoadColor(speedBand);
                        console.log(`道路 ${roadName} 的速度等级 ${speedBand}，染色 ${color}`);
        
                        networkData.overrideStyle(dataFeature, {
                            strokeColor: color,
                            strokeWeight: 2.4
                        });
                    }
                });
        
                if (!found) {
                    console.warn(`未找到匹配的道路：${roadName}`);
                }
            });
        })
        .catch(error => {
            console.error("加载路网数据出错：", error);
        });
}


