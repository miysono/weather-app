"use strict";
///////////////////////////////////////////////////////
//VARIABLES/DATA
const key = `c4377e1d554c504fc7b74990072f97b3`;

///////////////////////////
//Elements
const searchBtn = document.querySelector(`.search-btn`);
const searchForm = document.querySelector(`.search-form`);
const weatherContainerWrapper = document.querySelector(
  `.weather-container-wrapper`
);
const weatherContainer = document.querySelector(`.weather-container`);
const loadingElem = document.querySelector(`.loader`);

//////////////////////////
//Container text/img
const feelsLikeTemperature = document.querySelector(`.temp-feels-like`);
const weatherDescription = document.querySelector(`.weather-img`);
const temperature = document.querySelector(`.celsius`);
const region = document.querySelector(`.zone-name`);
const humidity = document.querySelector(`.humidity-text`);
const wind = document.querySelector(`.wind-text`);

/////////////////////////////////////////////////////////

//EVENT LISTENER METHODS
const searchLogic = () => {
  const inputValue = searchForm.value;
  renderWeatherData(inputValue);
};

//LISTENERS

//Event listener for the input button
searchBtn.addEventListener(`click`, searchLogic);
//If user presses on enter instead
window.addEventListener(`keydown`, function (e) {
  if (e.key === `Enter` && searchForm.value) searchLogic();
  else return;
});

//////////////////////////////////////////////////
//PROMISES
const getUserCoordinates = new Promise(function (resolve, reject) {
  if (!navigator.geolocation) reject(`Cannot locate you. Try agian`);
  navigator.geolocation.getCurrentPosition(function (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    resolve([latitude, longitude]);
  });
});

processUserData();

//////////////////////////////////////////////////////
//METHODS

///////////////////
//ASYNC METHODS

async function getAreaCoords(area) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${area}&limit=1&appid=c4377e1d554c504fc7b74990072f97b3`
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
    //adds the spinner while function is processing
    loading();
    changeSearchFormMsg(`Search...`);
    const weatherData = await getZoneWeatherData(inputValue);
    assignAPIValues(weatherData);
    loading();
  } catch (err) {
    loading();
    processErr(err);
  }
}

async function renderUserWeatherData(coords) {
  try {
    loading();
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&appid=c4377e1d554c504fc7b74990072f97b3&units=metric`
    );
    const data = await response.json();
    assignAPIValues(data);
    loading();
  } catch (err) {
    processErr(err);
  }
}

async function processUserData() {
  try {
    const userCoords = await getUserCoordinates;
    renderUserWeatherData(userCoords);
  } catch (err) {
    throw err;
  }
}

/////////////
// SIMPLE METHODS

function assignAPIValues(weatherData) {
  //remove the input value;
  searchForm.value = "";

  //assign all related values
  //don't forget to change image
  feelsLikeTemperature.textContent = `Feels like ${Math.round(
    weatherData.main.feels_like
  )}°c`;
  console.log(weatherData);
  weatherDescription.src = `/weather-imgs/${weatherData.weather[0].main}.png`;

  temperature.textContent = `${convertToCelsius(weatherData.main.temp)}°c`;
  region.textContent = weatherData.name;
  humidity.textContent = `${weatherData.main.humidity}%`;
  wind.textContent = `${weatherData.wind.speed.toFixed(1)}km/h`;
}

function convertToCelsius(temperature) {
  return Math.round(temperature);
}

function processErr(err) {
  searchForm.value = ``;
  changeSearchFormMsg(err);
}

function changeSearchFormMsg(msg) {
  searchForm.setAttribute(`placeholder`, msg);
}

function loading() {
  weatherContainerWrapper.classList.toggle(`hidden`);
  loadingElem.classList.toggle(`hidden`);
}
