import { useEffect, useMemo, useCallback, useState } from "react";

// 原本是直接使用 useState 的 setXXX 來告訴 react 渲染畫面
// 現在只是負責資料傳遞，所以從 WeatherApp 抽出
function fetchCurrentWeather(locationName) {
  console.log("in fetchCurrentWeather");
  const url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-C20B184B-3718-4949-B864-BC009F8325A0&locationName=${locationName}`;
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // 一開始土法煉鋼 XD
      // locationData 是 array
      // const locationData = data.records.location[0];
      // wdsd 風速、temp 溫度、humd 濕度
      // const locationName = locationData.locationName;
      // const obsTime = locationData.time.obsTime;
      // const wdsd = locationData.weatherElement[2].elementValue;
      // const temp = locationData.weatherElement[3].elementValue;
      // const humd = locationData.weatherElement[4].elementValue;
      // setWeatherElement({
      //   locationName,
      //   description: "多雲時晴",
      //   obsTime,
      //   tempareture: temp,
      //   windSpeed: wdsd,
      //   humid: humd
      // });
      const locationData = data.records.location[0];
      console.log("目前的 city", locationData);
      const weatherEles = locationData.weatherElement.reduce(
        (obj, currentIndex) => {
          if (["WDSD", "TEMP", "HUMD"].includes(currentIndex.elementName)) {
            obj[currentIndex.elementName] = [currentIndex.elementValue];
          }
          return obj;
        },
        {}
      );

      // setWeatherElement({
      //   locationName: locationData.locationName,
      //   description: "多雲時晴",
      //   obsTime: locationData.time.obsTime,
      //   tempareture: weatherEles.TEMP,
      //   windSpeed: weatherEles.WDSD,
      //   humid: weatherEles.HUMD
      // });
      return {
        locationName: locationData.locationName,
        description: "多雲時晴",
        obsTime: locationData.time.obsTime,
        tempareture: weatherEles.TEMP,
        windSpeed: weatherEles.WDSD,
        humid: weatherEles.HUMD
      };
    });
}

// 只要補上 1)PoP 2)CI 3)Wx
function fetchWeatherForecast(cityName) {
  console.log("in fetchWeatherForecast");
  const url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-C20B184B-3718-4949-B864-BC009F8325A0&locationName=${cityName}`;
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0];
      const neededWeatherEles = locationData.weatherElement.reduce(
        (accumulator, currentValue) => {
          if (["Wx", "PoP", "CI"].includes(currentValue.elementName)) {
            accumulator[currentValue.elementName] =
              currentValue.time[0].parameter;
          }
          return accumulator;
        },
        {}
      );
      return {
        description: neededWeatherEles.Wx.parameterName,
        weatherCode: neededWeatherEles.Wx.parameterValue,
        rainPossibility: neededWeatherEles.PoP.parameterName,
        comfortability: neededWeatherEles.CI.parameterName
      };
    });
}

export function useWeatherApi(currentLocation) {
  console.log("weatherAPI 要的資料", currentLocation);
  const { cityName, locationName } = currentLocation;
  console.log(cityName, locationName);
  // 設定 useState 的起始
  const [weatherElement, setWeatherElement] = useState({
    locationName: "臺北市",
    description: "多雲時晴",
    obsTime: new Date(),
    tempareture: "27.5",
    windSpeed: "0.3",
    humid: "0.88",
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: "",
    // 預設值，因為一開始載入完會觸發 useEffect 接 API 資料
    isLoading: true
  });

  const fetchData = useCallback(() => {
    console.log("我會被執行幾次？");
    async function fetchingData() {
      console.log("fetch data");
      // 因為 Promise.all 輸入 Array 也會回傳 Array
      const [currentWeather, weatherForecast] = await Promise.all([
        fetchCurrentWeather(locationName),
        fetchWeatherForecast(cityName)
      ]);

      // console.log("data", data);
      // const  = data;
      // 解構物件
      // => 會自動找 keyName 覆蓋其 value
      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading: false
      });
    }

    setWeatherElement((prevState) => {
      console.log("先執行的");
      return {
        ...prevState,
        isLoading: true
      };
    });

    fetchingData();
  }, [locationName, cityName]);

  console.log(fetchData);

  useEffect(() => {
    console.log("Hi from useEffect in WeatherApp");
    fetchData();
  }, [fetchData]);

  return [weatherElement, fetchData];
}
