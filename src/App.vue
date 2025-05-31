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
            <p>Search bar goes here</p>
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
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showModal = ref(false);

function closeModal() {
  showModal.value = false;
}
</script>
