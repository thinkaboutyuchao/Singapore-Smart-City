function fetchIncidentData() {
    fetch("https://internetgisapi-e6aabmhqezhgf3b9.eastasia-01.azurewebsites.net/incidents")  
        .then(response => response.json())
        .then(data => {
            if (data.value && Array.isArray(data.value)) {
                data.value.forEach(incident => {
                    if (incident.Latitude && incident.Longitude) {
                        // 创建信息窗口（点击时显示 Message 和 Type）
                        const infoWindowContent = `
                            <div style="max-width: 300px; height: auto;">
                                <strong>Type:</strong> ${incident.Type}<br>
                                <strong>Message:</strong> ${incident.Message}
                            </div>
                        `;
                        const infoWindow = new google.maps.InfoWindow({
                            content: infoWindowContent,
                        });

                        var marker = new google.maps.Marker({
                            position: { lat: incident.Latitude, lng: incident.Longitude },
                            map: incidentLayerVisible ? map : null,  // 只有在 incidentLayerVisible=true 时才显示
                            title: incident.Message,
                            icon: {
                                url: "/Data/Incidents/incidents.png",
                                scaledSize: new google.maps.Size(30, 30),
                            },
                        });

                        // 点击标记时显示信息窗口
                        marker.addListener("click", () => {
                            infoWindow.open(map, marker);
                        });

                        incidentMarkers.push(marker);
                    }
                });
            }
        })
        .catch(error => console.error("Error fetching incident data:", error));
}
//绑定复选框
document.getElementById("trafficAccidentLayer").addEventListener("change", (e) => {
    incidentLayerVisible = e.target.checked;

    // 如果是选中状态，且尚未加载数据，则先加载一次数据
    if (incidentLayerVisible && incidentMarkers.length === 0) {
        fetchIncidentData();
    } else {
        // 根据状态显示/隐藏出租车图层
        incidentMarkers.forEach(marker => {
            marker.setMap(incidentLayerVisible ? map : null);
        });
    }
});