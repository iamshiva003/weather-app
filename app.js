const apiKey = '8c43e732de513a08639719c6319ac53a'; // Replace with your Open Weather Map API key

// Get DOM elements
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const locationBtn = document.getElementById('location-btn');
const weatherEl = document.getElementById('weather');
const currentEl = document.getElementById('current');
const forecastEl = document.getElementById('forecast');
const place = document.getElementById('place');

// Get weather data from Open Weather Map API
const getWeatherData = async (location) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Get forecast data from Open Weather Map API
const getForecastData = async (location) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Show weather data in the UI
const showWeatherData = (weatherData, forecastData, location) => {
  // Set background image
  document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x1200/?${weatherData.name}')`;

  // Show current weather data
  newlocation = location.toUpperCase();
  place.innerHTML = `<h2>${newlocation} </h2>`;
  currentEl.innerHTML = `
    <img src="https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" alt="${weatherData.weather[0].description}">
    <p>${weatherData.main.temp.toFixed(1)}&deg;C</p>
  `;

  // Show weather forecast data
  let forecastHTML = '';
  for (let i = 0; i < forecastData.list.length; i += 8) {
    const forecast = forecastData.list[i];
    const date = new Date(forecast.dt * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const icon = forecast.weather[0].icon;
    const temp = forecast.main.temp.toFixed(1);
    forecastHTML += `
      <div class="day">
        <p>${day}</p>
        <img src="https://openweathermap.org/img/w/${icon}.png" alt="${forecast.weather[0].description}">
        <p>${temp}&deg;C</p>
      </div>
    `;
  }
  forecastEl.innerHTML = forecastHTML;

  // Show weather data
  weatherEl.style.display = 'block';
}

// Handle search form submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const location = input.value.trim();
  if (location) {
    const weatherData = await getWeatherData(location);
    const forecastData = await getForecastData(location);
    showWeatherData(weatherData, forecastData, location);
    input.value = '';
  }
});

// Handle location button click
locationBtn.addEventListener('click', async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();
      const forecastData = await getForecastData(data.name);
      showWeatherData(data, forecastData, data.name);
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
});
