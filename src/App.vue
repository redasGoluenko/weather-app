<template>
  <section class="section">
    <div class="container">
      <!-- Add Forecast button -->
      <button class="button is-primary" @click="showModal = true">
        Add Forecast
      </button>

      <!-- Modal -->
      <div class="modal" :class="{ 'is-active': showModal }">
        <div class="modal-background" @click="closeModal"></div>
        <div class="modal-content">
          <div class="box">
            <input
              class="input"
              type="text"
              v-model="searchTerm"
              placeholder="Enter city name"
            />
            <button class="button is-info mt-3" @click="searchWeather" :disabled="loading">
              <span v-if="loading">Searching...</span>
              <span v-else>Search</span>
            </button>

            <!-- Error message -->
            <p v-if="error" class="has-text-danger mt-2">{{ error }}</p>

            <!-- Result preview -->
            <div v-if="forecast" class="mt-4">
              <p><strong>{{ forecast.name }}, {{ forecast.sys.country }}</strong></p>
              <p>Temperature: {{ forecast.main.temp }}°C</p>
              <p>Humidity: {{ forecast.main.humidity }}%</p>
              <p>Wind: {{ forecast.wind.speed }} m/s</p>
              <p>Pressure: {{ forecast.main.pressure }} hPa</p>
              <p>Sunrise: {{ formatTime(forecast.sys.sunrise) }}</p>
              <p>Sunset: {{ formatTime(forecast.sys.sunset) }}</p>
              <img
                :src="`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`"
                :alt="forecast.weather[0].description"
              />
            </div>
          </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="closeModal"></button>
      </div>

      <!-- Placeholder for forecasts list -->
      <div class="mt-5">
        <!-- Future list of added forecasts -->
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getWeatherByCity, getWeatherByZip, getWeatherByCoords } from './API/WeatherApi'

const showModal = ref(false)
const searchTerm = ref('')
const forecast = ref<any | null>(null)
const loading = ref(false)
const error = ref('')

function closeModal() {
  showModal.value = false
  searchTerm.value = ''
  forecast.value = null
  error.value = ''
}

function isZipCode(input: string): boolean {
  // Simple check: all digits, length between 3 and 10 (adjust if needed)
  return /^\d{3,10}$/.test(input.trim())
}

function isCoordinates(input: string): boolean {
  // Check format: "lat,lon" where lat and lon are decimal numbers
  const parts = input.split(',')
  if (parts.length !== 2) return false
  const lat = parseFloat(parts[0].trim())
  const lon = parseFloat(parts[1].trim())
  return !isNaN(lat) && !isNaN(lon)
}

async function searchWeather() {
  if (!searchTerm.value.trim()) {
    error.value = 'Please enter a search term.'
    return
  }

  loading.value = true
  error.value = ''
  forecast.value = null

  try {
    if (isCoordinates(searchTerm.value)) {
      const [latStr, lonStr] = searchTerm.value.split(',')
      const lat = parseFloat(latStr.trim())
      const lon = parseFloat(lonStr.trim())
      forecast.value = await getWeatherByCoords(lat, lon)
    } else if (isZipCode(searchTerm.value)) {
      forecast.value = await getWeatherByZip(searchTerm.value.trim())
    } else {
      forecast.value = await getWeatherByCity(searchTerm.value.trim())
    }
  } catch (err) {
    error.value = 'Failed to fetch weather data.'
  } finally {
    loading.value = false
  }
}

function formatTime(unixTime: number): string {
  const date = new Date(unixTime * 1000)
  return date.toLocaleTimeString()
}

</script>
