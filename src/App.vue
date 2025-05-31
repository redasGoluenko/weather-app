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
              placeholder="Enter city name, ZIP, or coordinates"
            />
            <button class="button is-info mt-3" @click="searchWeather" :disabled="loading">
              <span v-if="loading">Searching...</span>
              <span v-else>Search</span>
            </button>

            <!-- Error message -->
            <p v-if="error" class="has-text-danger mt-2">{{ error }}</p>

            <!-- Result preview -->
            <div v-if="forecast" class="mt-4 box">
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
              <button class="button is-success mt-3" @click="addForecast">
                Add Forecast
              </button>
            </div>
          </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="closeModal"></button>
      </div>

      <!-- List of added forecasts -->
      <div class="mt-5">
        <h2 class="title is-4">Added Forecasts</h2>
        <div v-if="forecasts.length === 0">
          <p>No forecasts added yet.</p>
        </div>
        <div v-else>
          <div
            v-for="(f, index) in forecasts"
            :key="f.id || index"
            class="box mb-3"
          >
            <p><strong>{{ f.name }}, {{ f.sys.country }}</strong></p>
            <p>Temperature: {{ f.main.temp }}°C</p>
            <p>Humidity: {{ f.main.humidity }}%</p>
            <p>Wind: {{ f.wind.speed }} m/s</p>
            <p>Pressure: {{ f.main.pressure }} hPa</p>
            <p>Sunrise: {{ formatTime(f.sys.sunrise) }}</p>
            <p>Sunset: {{ formatTime(f.sys.sunset) }}</p>
            <img
              :src="`https://openweathermap.org/img/wn/${f.weather[0].icon}@2x.png`"
              :alt="f.weather[0].description"
            />
            <button class="button is-danger mt-2" @click="removeForecast(index)">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { getWeatherByCity } from './API/WeatherApi'

const showModal = ref(false)
const searchTerm = ref('')
const forecast = ref<any | null>(null)
const loading = ref(false)
const error = ref('')
const forecasts = ref<any[]>([])

// Load saved forecasts from localStorage on start
onMounted(() => {
  const saved = localStorage.getItem('forecasts')
  if (saved) {
    forecasts.value = JSON.parse(saved)
  }
})

// Save forecasts to localStorage whenever they change
watch(forecasts, (newVal) => {
  localStorage.setItem('forecasts', JSON.stringify(newVal))
}, { deep: true })

function closeModal() {
  showModal.value = false
  searchTerm.value = ''
  forecast.value = null
  error.value = ''
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
    const data = await getWeatherByCity(searchTerm.value)
    forecast.value = data
  } catch (err) {
    error.value = 'Failed to fetch weather data.'
  } finally {
    loading.value = false
  }
}

function addForecast() {
  if (!forecast.value) return

  // Avoid duplicates by city id (or any unique key)
  const exists = forecasts.value.some(f => f.id === forecast.value.id)
  if (!exists) {
    forecasts.value.push(forecast.value)
  }

  closeModal()
}

function removeForecast(index: number) {
  forecasts.value.splice(index, 1)
}

function formatTime(unixTime: number): string {
  const date = new Date(unixTime * 1000)
  return date.toLocaleTimeString()
}
</script>
