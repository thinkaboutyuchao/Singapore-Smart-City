// 当复选框状态发生变化时更新图例面板
document.getElementById('layerPanel').addEventListener('change', updateLegend);

function updateLegend() {
  const legendPanel = document.getElementById('legend-panel');
  // 清空图例面板内容
  legendPanel.innerHTML = '<div class="legend-title">Legend:</div>';

  // 1. Taxi Distribution 被选中时加载 Taxi 图标
  if (document.getElementById('taxiLayer').checked) {
    // 注意：这里的 src 需要替换为实际 Taxi 图标的地址
    legendPanel.innerHTML += `
      <div class="legend-item">
        <img src="Data/Taxi/Taxi.png" alt="Taxi Icon" style="width:20px;height:20px;vertical-align:middle;">
        <span> Taxi Distribution</span>
      </div>
    `;
  }

  // 2 Rail Station Crowd Level 被选中时加载对应图标（示例）
  if (document.getElementById('railLayer').checked) {
    // 替换 src 为实际的 Rail Station 图标地址
    legendPanel.innerHTML += `
      <div class="legend-item">
        <span style="display:inline-block;width:20px;height:20px;background-color:#2e8b57;margin-right:5px;vertical-align:middle;"></span>
        <span>Light Congestion</span>
      </div>
      <div class="legend-item">
        <span style="display:inline-block;width:20px;height:20px;background-color:#FFD700;margin-right:5px;vertical-align:middle;"></span>
        <span>Moderate Congestion</span>
      </div>
      <div class="legend-item">
        <span style="display:inline-block;width:20px;height:20px;background-color:#FF0000;margin-right:5px;vertical-align:middle;"></span>
        <span>Severe Congestion</span>
      </div>
    `;
  }
  // 3 Rail Station Crowd Level 被选中时加载对应图标（示例）
  if (document.getElementById('networkLayer').checked) {
    // 替换 src 为实际的 Rail Station 图标地址
    legendPanel.innerHTML += `
      <div class="legend-item">
        <span style="display:inline-block;width:20px;height:20px;background-color:#2e8b57;margin-right:5px;vertical-align:middle;"></span>
        <span>Speed Range > 60</span>
      </div>
      <div class="legend-item">
        <span style="display:inline-block;width:20px;height:20px;background-color:#FFD700;margin-right:5px;vertical-align:middle;"></span>
        <span>Speed Range > 30</span>
      </div>
      <div class="legend-item">
        <span style="display:inline-block;width:20px;height:20px;background-color:#FF0000;margin-right:5px;vertical-align:middle;"></span>
        <span>Speed Range <= 30</span>
      </div>
    `;
  }


  // 4. Traffic Accident 被选中时加载 Incidents 图标
  if (document.getElementById('trafficAccidentLayer').checked) {
    // 替换 src 为实际的交通事故图标地址
    legendPanel.innerHTML += `
      <div class="legend-item">
        <img src="Data/Incidents/incidents.png" alt="Traffic Accident Icon" style="width:20px;height:20px;vertical-align:middle;">
        <span> Traffic Accident</span>
      </div>
    `;
  }

  // 5. Camera Distribution 被选中时加载 Cameras 图标
  if (document.getElementById('cameraLayer').checked) {
    // 替换 src 为实际的 Camera 图标地址
    legendPanel.innerHTML += `
      <div class="legend-item">
        <img src="Data/Cameras/camera.png" alt="Camera Icon" style="width:20px;height:20px;vertical-align:middle;">
        <span> Camera Distribution</span>
      </div>
    `;
  }
}