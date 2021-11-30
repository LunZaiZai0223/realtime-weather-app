import React, { useState } from "react";
import styled from "@emotion/styled";

import { availableLocations } from "./utils.js";

const WeatherSettingWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 20px;
`;

const Title = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 30px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 15px;
`;

const StyledInputList = styled.input`
  display: block;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.textColor};
  outline: none;
  width: 100%;
  max-width: 100%;
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  padding: 7px 10px;
  margin-bottom: 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;

    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }

    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`;

const Back = styled.button`
  && {
    color: ${({ theme }) => theme.textColor};
    border-color: ${({ theme }) => theme.textColor};
  }
`;

const Save = styled.button`
  && {
    color: white;
    background-color: #40a9f3;
  }
`;

// 擷取 availableLocations 每個 object value 中的 cityName 的 value 做表單
const locations = availableLocations.map((loaction) => loaction.cityName);

export function WeatherSetting(props) {
  const { setCurrentPage, cityName, setCurrentCity } = props;
  const [locationName, setLocationName] = useState(cityName);
  function handleChange(event) {
    console.log(event.target.value);
    // 會觸發 WeatherSetting Component 的 re-render
    // 但是 re-render 完會更新 locationName 的值
    setLocationName(event.target.value);
  }
  function handleSave() {
    if (locations.includes(locationName)) {
      console.log(`目前的地址為 ${locationName}`);
      setCurrentCity(locationName);
      setCurrentPage("WeatherCard");
    } else {
      alert(`您輸入的 ${locationName} 為不有效的地方`);
    }
  }
  return (
    <WeatherSettingWrapper>
      <Title>設定</Title>
      {/* HTML label 標籤的 for attritube 會與 JS 的 for 關鍵字衝突，所以 Component 要用 htmlFor */}
      <StyledLabel htmlFor="location">地區</StyledLabel>
      <StyledInputList
        list="location-list"
        id="location"
        name="location"
        onChange={handleChange}
        placeholder={locationName}
      />
      <datalist id="location-list">
        {/* 定義 datalist 中的 options*/}
        {locations.map((location) => {
          return <option value={location} key={location} />;
        })}
      </datalist>
      <ButtonGroup>
        <Back onClick={() => setCurrentPage("WeatherCard")}>返回</Back>
        <Save onClick={handleSave}>儲存</Save>
      </ButtonGroup>
    </WeatherSettingWrapper>
  );
}
