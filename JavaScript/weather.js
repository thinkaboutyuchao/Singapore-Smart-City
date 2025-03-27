// 获取天气数据并更新天气面板
fetch("https://internetgisapi-e6aabmhqezhgf3b9.eastasia-01.azurewebsites.net/weather")
  .then(response => response.json())
  .then(data => {
    if (data.code !== 0 || !data.data) {
      console.error("API 返回错误数据:", data.errorMsg);
      return;
    }

    // 获取区域坐标数据和天气预报数据（注意 forecasts 位于 items 数组的第一个元素中）
    const areaData = data.data.area_metadata;
    const forecastData = data.data.items[0].forecasts;
    
    // 选择一个目标区域，这里以 areaData 的第一个区域为例
    const targetArea = areaData[0];  
    const name = targetArea.name;

    // 查找对应的天气预报
    const forecastItem = forecastData.find(item => item.area === name);
    const forecastText = forecastItem ? forecastItem.forecast : "暂无天气信息";

    //Weather image
    let imageHtml = "";
    if (forecastText.includes("Cloudy")) {
      imageHtml = `<img src="https://thinkaboutyuchao.github.io/Singapore-Smart-City/Data/Weather/Cloudy.gif" alt="Cloudy Weather" style="width:240px;height:200px;">`;
    }else if(forecastText.includes("Showers") || forecastText.includes("Rain")){
      imageHtml = `<img src="https://thinkaboutyuchao.github.io/Singapore-Smart-City/Data/Weather/Showers.gif" alt="Cloudy Weather" style="width:240px;height:200px;">`;
    }else{
      imageHtml = `<img src="https://thinkaboutyuchao.github.io/Singapore-Smart-City/Data/Weather/Sun.gif" alt="Cloudy Weather" style="width:240px;height:200px;">`;
    }
    // 获取天气信息面板，并更新内容
    const weatherPanel = document.getElementById("weather-panel");
    weatherPanel.innerHTML = `
      <h3>Weather Forecast</h3>
      <br>
      <div class="weather-info">
        ${imageHtml}
        <h4>Area:Singapore</h4>
        <p><strong>Forecast:</strong> ${forecastText}</p>
        <p><strong>Updated Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `;
  })
  .catch(error => console.error("数据请求失败:", error));
