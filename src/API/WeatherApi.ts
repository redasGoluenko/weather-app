import Axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

async function GetWeatherByCity(city : string){
try{
const response = await Axios.get(BASE_URL, {params: {
    appid: API_KEY,
    q: city,
    units: 'metric',
    },
});
return response.data;
} catch(error){
console.error('failed to fetch weather:', error);
throw new Error('Could not fetch weather data.');
}}

export { GetWeatherByCity };