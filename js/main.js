"use strict";
const key = `c4377e1d554c504fc7b74990072f97b3`;

//Elements
const searchBtn = document.querySelector(`.search-btn`);
const searchForm = document.querySelector(`.search-form`);
const weatherContainerWrapper = document.querySelector(
  `.weather-container-wrapper`
);
const weatherContainer = document.querySelector(`.weather-container`);
const loadingElem = document.querySelector(`.loader`);

//Container text/img
const feelsLikeTemperature = document.querySelector(`.temp-feels-like`);
const weatherDescription = document.querySelector(`.weather-img`);
const temperature = document.querySelector(`.celsius`);
const region = document.querySelector(`.zone-name`);
const humidity = document.querySelector(`.humidity-text`);
const wind = document.querySelector(`.wind-text`);

//EVENT LISTENER METHOD
const searchLogic = () => {
  console.log(`clicked on btn`);
  const inputValue = searchForm.value;
  renderWeatherData(inputValue);
};
//Event listener for the
searchBtn.addEventListener(`click`, searchLogic);

//ASYNC METHODS

async function getAreaCoords(area) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${area}&limit=5&appid=c4377e1d554c504fc7b74990072f97b3`
    );
    //CHECK FOR ERROR AFTER API CALL
    if (!response.ok) throw new Error(`Unexpected error! Try again!`);

    const data = await response.json();
    //CHECK FOR ANOTHER ERROR IF DATA IS NOT AVAILABLE
    if (!data.length) throw new Error(`Invalid name! Try again!`);

    //return values from data arr;
    const { lat, lon } = data[0];
    return [lat, lon];
  } catch (err) {
    throw err;
  }
}

async function getZoneWeatherData(zone) {
  try {
    //get coordinates and call the API
    const coords = await getAreaCoords(zone);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&appid=c4377e1d554c504fc7b74990072f97b3&units=metric`
    );
    if (!response.ok) throw new Error(`Unexpected error! Try again!`);

    //get data
    const data = await response.json();
    /////////////////////////////////ALSO GET TO CHECK FOR DATA ERR
    return data;
  } catch (err) {
    throw err;
  }
}

async function renderWeatherData(inputValue) {
  try {
    //add the spinner while function is processing
    loading();
    const weatherData = await getZoneWeatherData(inputValue);
    assignAPIValues(weatherData);
    loading();
  } catch (err) {
    console.log(err);
  }
}

// METHODS

function assignAPIValues(weatherData) {
  //remove the input value;
  searchForm.value = "";

  //assign all related values
  //don't forget to change image
  feelsLikeTemperature.textContent = `Feels like ${Math.round(
    weatherData.main.feels_like
  )}°c`;
  console.log(weatherData);
  temperature.textContent = `${convertToCelsius(weatherData.main.temp)}°c`;
  region.textContent = weatherData.name;
  humidity.textContent = `${weatherData.main.humidity}%`;
  wind.textContent = `${weatherData.wind.speed.toFixed(1)}km/h`;
}

function convertToCelsius(temperature) {
  return Math.round(temperature);
}

function loading() {
  weatherContainer.classList.toggle(`result-loading`);
  weatherContainerWrapper.classList.toggle(`hidden`);
  loadingElem.classList.toggle(`hidden`);
}
