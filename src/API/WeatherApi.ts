import Axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Get weather by city name
async function getWeatherByCity(city: string) {
  try {
    const response = await Axios.get(BASE_URL, {
      params: {
        appid: API_KEY,
        q: city,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch weather by city:', error);
    throw new Error('Could not fetch weather by city.');
  }
}

// Get weather by ZIP code
async function getWeatherByZip(zip: string) {
  try {
    const response = await Axios.get(BASE_URL, {
      params: {
        appid: API_KEY,
        zip,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch weather by ZIP:', error);
    throw new Error('Could not fetch weather by ZIP.');
  }
}

// Get weather by coordinates
async function getWeatherByCoords(lat: number, lon: number) {
  try {
    const response = await Axios.get(BASE_URL, {
      params: {
        appid: API_KEY,
        lat,
        lon,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch weather by coordinates:', error);
    throw new Error('Could not fetch weather by coordinates.');
  }
}

export {
  getWeatherByCity,
  getWeatherByZip,
  getWeatherByCoords
};
