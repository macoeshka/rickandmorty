<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination d-flex">
      <li class="page-item">
        <button type="button" class="page-link" v-if="currentPage != 1" @click="currentPage--"> Previous </button>
      </li>
      <li v-if="currentPage <= totalPages" class="page-item">
        <button type="button" :class=getPageClass(pageNumber) v-for="pageNumber in pageArray" :key="pageNumber" @click="currentPage = pageNumber"> {{pageNumber}} </button>
      </li>
      <li class="page-item">
        <button type="button" class="page-link" v-if="currentPage != totalPages" @click="currentPage++"> Next </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang='ts'>
import { computed } from 'vue'

const props = defineProps<{
  totalPages: number;
  modelValue: number;
}>()

// eslint-disable-next-line
const emit = defineEmits<({
  (e: 'update:modelValue', value: number): void
})>()

const currentPage = computed({
  get: () => props.modelValue,
  set: (value: number) => emit('update:modelValue', value)
})

const pageArray = computed((): number[] => {
  const count = Math.min(5, props.totalPages)
  const padding = Math.floor((count - 1) / 2)

  let start = currentPage.value - padding
  const stop = currentPage.value + padding

  if (start <= 0 || stop > props.totalPages) {
    start = 1
  }
  if (stop > props.totalPages) {
    start = props.totalPages - count + 1
  }

  return Array.from(new Array(count), (x, i) => i + start)
})

function getPageClass (p: number): string {
  return 'page-link' + (p === currentPage.value ? ' active' : '')
}
</script>

<style scoped>
button.page-link {
  color: #42b983;
  background: none;
  border: 1px solid #ccc;
  padding: 5px;
}

button.page-link.active {
  background-color: #42b983;
  color: white;
}
</style>
