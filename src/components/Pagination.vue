<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  pageCount: Number,
  currentPage: Number,
})

const emit = defineEmits(['update:currentPage'])


const prevPage = () => {
console.log('prevPage called', props.currentPage, props.pageCount)
  if (props.currentPage > 1) {
    emit('update:currentPage', props.currentPage - 1)
  }
}

const nextPage = () => {
    console.log('nextPage called', props.currentPage, props.pageCount)
  if (props.currentPage < props.pageCount) {
    emit('update:currentPage', props.currentPage + 1)
  }
}
</script>
<template>
          <nav class="pagination is-centered" role="navigation" aria-label="pagination" v-if="pageCount > 1">
            <a
              class="pagination-previous"
              @click="prevPage"
            >Previous</a>
            <a
              class="pagination-next"
              @click="nextPage"
            >Next</a>
            <ul class="pagination-list">
              <li v-for="page in pageCount" :key="page">
                <a
                  class="pagination-link"
                  :class="{ 'is-current': currentPage === page }"
                  @click="emit('update:currentPage', page)"
                >{{ page }}</a>
              </li>
            </ul>
          </nav>
</template>
