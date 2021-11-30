import React, { useState, useEffect, useMemo } from "react";

import { WeatherCard } from "./WeatherCard.js";
import { useWeatherApi } from "./useWeatherApi.js";
import { WeatherSetting } from "./WeatherSetting.js";
import { findLocation } from "./utils.js";

import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";

// 匯入日落日出的資料
import sunriseAndSunsetData from "./sunrise-sunset.json";

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#757575",
    temperatureColor: "#757575",
    textColor: "#828282"
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#cccccc",
    temperatureColor: "#dddddd",
    textColor: "#cccccc"
  }
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// const WeatherCard = styled.div`
//   position: relative;
//   min-width: 360px;
//   box-shadow: ${({ theme }) => theme.boxShadow};
//   background-color: ${({ theme }) => theme.foregroundColor};
//   box-sizing: border-box;
//   padding: 30px 15px;
// `;

// 直接複製 PJ 大提供的資料整理函式
const getMoment = (locationName) => {
  // STEP 2：從日出日落時間中找出符合的地區
  const location = sunriseAndSunsetData.find(
    (data) => data.locationName === locationName
  );

  // STEP 3：找不到的話則回傳 null
  if (!location) return null;

  // STEP 4：取得當前時間
  const now = new Date();

  // STEP 5：將當前時間以 "2019-10-08" 的時間格式呈現
  const nowDate = Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
    .format(now)
    .replace(/\//g, "-");

  // STEP 6：從該地區中找到對應的日期
  const locationDate =
    location.time && location.time.find((time) => time.dataTime === nowDate);

  // STEP 7：將日出日落以及當前時間轉成時間戳記（TimeStamp）
  const sunriseTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunrise}`
  ).getTime();
  const sunsetTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunset}`
  ).getTime();
  const nowTimeStamp = now.getTime();

  // STEP 8：若當前時間介於日出和日落中間，則表示為白天，否則為晚上
  return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp
    ? "day"
    : "night";
};

export function WeatherApp() {
  console.log("--- involke function component ---");
  const storageCity = localStorage.getItem("cityName");
  const [currentCity, setCurrentCity] = useState(storageCity || "臺北市");
  const currentLocation = findLocation(currentCity);
  console.log("目前城市為", currentLocation);
  const [weatherElement, fetchData] = useWeatherApi(currentLocation);
  const { isLoading } = weatherElement;
  const [currentTheme, setCurrentTheme] = useState("light");
  const [currentPage, setCurrentPage] = useState("WeatherCard");

  const moment = useMemo(() => {
    getMoment(currentLocation.sunriseCityName);
  }, [currentLocation.sunriseCityName]);

  useEffect(() => {
    setCurrentTheme(moment === "day" ? "ligth" : "dark");
  }, [moment]);
  useEffect(() => {
    localStorage.setItem("cityName", currentCity);
  }, [currentCity]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {console.log("is Loading:", isLoading)}
        {currentPage === "WeatherCard" && (
          <WeatherCard
            cityName={currentLocation.cityName}
            fetchData={fetchData}
            moment={moment}
            weatherElement={weatherElement}
            setCurrentPage={setCurrentPage}
          ></WeatherCard>
        )}
        {currentPage === "WeatherSetting" && (
          <WeatherSetting
            setCurrentPage={setCurrentPage}
            cityName={currentLocation.cityName}
            setCurrentCity={setCurrentCity}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}
