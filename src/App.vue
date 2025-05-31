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
import { GetWeatherByCity } from './API/WeatherApi'

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

async function searchWeather() {
  if (!searchTerm.value.trim()) {
    error.value = 'Please enter a city name.'
    return
  }

  loading.value = true
  error.value = ''
  forecast.value = null

  try {
    const data = await GetWeatherByCity(searchTerm.value)
    forecast.value = data
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
