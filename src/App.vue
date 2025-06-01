<template>
  <!-- Notification -->
  <div v-if="notification" class="notification is-info" style="position: fixed; top: 1rem; right: 1rem; z-index: 1000;">
    {{ notification }}
  </div>

  <!-- Filter Bar -->
  <div class="field mt-4">
    <label class="label">Filter Forecasts</label>
    <div class="control">
      <input
        class="input"
        type="text"
        v-model="filterText"
        placeholder="Search by city or country"
      />
    </div>
  </div>

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
              placeholder="Enter city name, ZIP, or coordinates (lat,lon)"
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
            v-for="(f, index) in paginatedForecasts"
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
            <button class="button is-danger mt-2" @click="removeForecast(f.id)">
              Remove
            </button>
          </div>

          <Pagination :page-count="pageCount" v-model:currentPage="currentPage"></Pagination>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, onUnmounted } from 'vue'
import { getWeatherByCity, getWeatherByZip, getWeatherByCoords } from './API/WeatherApi'
import Pagination from './components/Pagination.vue'

const showModal = ref(false)
const searchTerm = ref('')
const forecast = ref<any | null>(null)
const loading = ref(false)
const error = ref('')
const forecasts = ref<any[]>([])

// Filter text
const filterText = ref('')

// Pagination
const currentPage = ref(1)
const pageSize = 10

// Notification message and timeout
const notification = ref('')
let timeoutId: number | null = null

function showNotification(msg: string) {
  notification.value = msg
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = window.setTimeout(() => {
    notification.value = ''
    timeoutId = null
  }, 3000)
}

// Load saved forecasts from localStorage on start
onMounted(() => {
  const saved = localStorage.getItem('forecasts')
  if (saved) {
    forecasts.value = JSON.parse(saved)
  }
  startAutoRefresh()
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

function isCoordinates(input: string): boolean {
  return /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(input.trim())
}

function isZipCode(input: string): boolean {
  return /^\d{5}(,\w{2})?$/.test(input.trim())
}

async function searchWeather() {
  if (!searchTerm.value.trim()) {
    error.value = 'Please enter a search term.'
    return
  }

  loading.value = true
  error.value = ''
  forecast.value = null

  const input = searchTerm.value.trim()

  try {
    if (isCoordinates(input)) {
      const [latStr, lonStr] = input.split(',')
      forecast.value = await getWeatherByCoords(parseFloat(latStr), parseFloat(lonStr))
    } else if (isZipCode(input)) {
      forecast.value = await getWeatherByZip(input)
    } else {
      forecast.value = await getWeatherByCity(input)
    }
  } catch (err) {
    error.value = 'Failed to fetch weather data.'
  } finally {
    loading.value = false
  }
}

function addForecast() {
  if (!forecast.value) return
  const exists = forecasts.value.some(f => f.id === forecast.value.id)
  if (!exists) {
    forecasts.value.push(forecast.value)
    showNotification('Forecast added.')
  } else {
    showNotification('Forecast already exists.')
  }
  closeModal()
}

function removeForecast(id: number) {
  forecasts.value = forecasts.value.filter(f => f.id !== id)
  showNotification('Forecast removed.')
}

function formatTime(unixTime: number): string {
  return new Date(unixTime * 1000).toLocaleTimeString()
}

// Filtered + paginated forecasts
const filteredForecasts = computed(() => {
  const term = filterText.value.trim().toLowerCase()
  if (!term) return forecasts.value
  return forecasts.value.filter(f =>
    f.name.toLowerCase().includes(term) || f.sys.country.toLowerCase().includes(term)
  )
})

const paginatedForecasts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredForecasts.value.slice(start, start + pageSize)
})

const pageCount = computed(() => Math.ceil(filteredForecasts.value.length / pageSize))

watch([filteredForecasts, currentPage], () => {
  if (currentPage.value > pageCount.value) {
    currentPage.value = pageCount.value || 1
  }
})

// --- Periodic refresh logic ---
let refreshIntervalId: number | null = null
const REFRESH_INTERVAL = 10 * 60 * 1000 // 10 minutes

async function refreshForecasts() {
  if (forecasts.value.length === 0) return
  try {
    const updatedForecasts = await Promise.all(
      forecasts.value.map(async (f) => {
        try {
          const updated = await getWeatherByCity(f.name)
          return updated
        } catch {       
          return f
        }
      })
    )
    forecasts.value = updatedForecasts
    showNotification('Forecasts refreshed.')
  } catch {
  }
}

function startAutoRefresh() {
  refreshIntervalId = window.setInterval(refreshForecasts, REFRESH_INTERVAL)
}

onUnmounted(() => {
  if (refreshIntervalId) clearInterval(refreshIntervalId)
})
</script>
