<template>
  <section class="section">
    <div class="container">   
      <button class="button is-primary" @click="showModal = true">
        Add Forecast
      </button>
      <div class="modal" :class="{ 'is-active': showModal }">
        <div class="modal-background" @click="closeModal"></div>
        <div class="modal-content">
          <div class="box">
            <input
              class="input"
              type="text"
              v-model="searchTerm"
              placeholder="Enter city, ZIP or coordinates"
            />
            <button class="button is-info mt-3" @click="searchWeather">
              Search
            </button>
          </div>
        </div>
        <button
          class="modal-close is-large"
          aria-label="close"
          @click="closeModal"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { GetWeatherByCity } from "./API/WeatherApi";

const showModal = ref(false);
const searchTerm = ref("");

function closeModal() {
  showModal.value = false;
}

async function searchWeather() {
  if (!searchTerm.value.trim()) {
    alert("Please enter a search term");
    return;
  }

  try {
    const data = await GetWeatherByCity(searchTerm.value);
    console.log("Weather data:", data);
    alert(`Weather in ${data.name}: ${data.main.temp}°C`);
  } catch (error) {
    alert("Failed to fetch weather data.");
  }

  closeModal();
}
</script>
