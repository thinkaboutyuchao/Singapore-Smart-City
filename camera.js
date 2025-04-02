// 获取交通摄像头数据并生成标记
function fetchCameraData() {
    fetch("https://internetgisapi-e6aabmhqezhgf3b9.eastasia-01.azurewebsites.net/traffic_image")
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                data.items.forEach(item => {
                    item.cameras.forEach(camera => {
                        if (camera.location && camera.location.latitude && camera.location.longitude) {
                            // 创建 Marker
                            var marker = new google.maps.Marker({
                                position: { lat: camera.location.latitude, lng: camera.location.longitude },
                                map: cameraLayerVisible ? map : null,  // 只有在 cameraLayerVisible=true 时才显示
                                title: `摄像头 ID: ${camera.camera_id}`,
                                icon: {
                                    url: "Data/Cameras/camera.png",
                                    scaledSize: new google.maps.Size(30, 30),
                                },
                            });
                            
                            // 创建 InfoWindow 用于显示摄像头图片
                            var infoWindow = new google.maps.InfoWindow({
                                content: `<div>
                                            <p>Time Stamp: ${camera.timestamp}</p>
                                            <img src="${camera.image}" alt="摄像头 ${camera.camera_id}" style="width:320px;height:240px;">
                                          </div>`
                            });
                            
                            // 给 Marker 绑定点击事件，点击后显示对应的图片
                            marker.addListener("click", function() {
                                infoWindow.open(map, marker);
                            });
                            
                            cameraMarkers.push(marker);
                        }
                    });
                });
            }
        })
        .catch(error => console.error("Error fetching camera data:", error));
}

// 绑定摄像头图层复选框的事件
document.getElementById("cameraLayer").addEventListener("change", (e) => {
    cameraLayerVisible = e.target.checked;
    // 如果摄像头图层可见并且摄像头数据还未加载，则先加载数据
    if (cameraLayerVisible && cameraMarkers.length === 0) {
        fetchCameraData();
    } else {
        // 根据状态显示或隐藏摄像头标记
        cameraMarkers.forEach(marker => {
            marker.setMap(cameraLayerVisible ? map : null);
        });
    }
});