// 获取出租车数据并生成标记
function fetchTaxiData() {
    fetch("https://internetgisapi-e6aabmhqezhgf3b9.eastasia-01.azurewebsites.net/taxi")
        .then(response => response.json())
        .then(data => {
            if (data.value && Array.isArray(data.value)) {
                data.value.forEach(taxi => {
                    if (taxi.Latitude && taxi.Longitude) {
                        var marker = new google.maps.Marker({
                            position: { lat: taxi.Latitude, lng: taxi.Longitude },
                            map: taxiLayerVisible ? map : null,  // 只有在 taxiLayerVisible=true 时才显示
                            title: "Taxi Location",
                            icon: {
                                url: "Data/Taxi/taxii.png",
                                scaledSize: new google.maps.Size(20, 20),
                            },
                        });
                        taxiMarkers.push(marker);
                    }
                });
            }
        })
        .catch(error => console.error("Error fetching taxi data:", error));
}

// 绑定 Taxi 图层的复选框事件
document.getElementById("taxiLayer").addEventListener("change", (e) => {
    taxiLayerVisible = e.target.checked;

    // 如果是选中状态，且尚未加载数据，则先加载一次数据
    if (taxiLayerVisible && taxiMarkers.length === 0) {
        fetchTaxiData();
    } else {
        // 根据状态显示/隐藏出租车图层
        taxiMarkers.forEach(marker => {
            marker.setMap(taxiLayerVisible ? map : null);
        });
    }
});