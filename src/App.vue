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
            <!-- Search input and button -->
            <input
              class="input"
              type="text"
              v-model="searchTerm"
              placeholder="Enter city name"
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

      <!-- Placeholder for forecasts list -->
      <div class="mt-5">
        <!-- Forecasts will be rendered here later -->
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showModal = ref(false)
const searchTerm = ref('')

function closeModal() {
  showModal.value = false
}

function searchWeather() {
  if (!searchTerm.value.trim()) {
    alert('Please enter a search term')
    return
  }

  // Placeholder for actual search logic
  console.log('Searching for weather in:', searchTerm.value)

  closeModal()
}
</script>
