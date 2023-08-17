<template>
  <div class="episode d-flex">
    <ul>
     <li><strong>Episode:</strong> {{ episode.episode }}</li>
     <li><strong>Title:</strong> {{ episode.name }}</li>
     <li><strong>Air Date:</strong> {{ episode.air_date }}</li>
     <span v-for="(item, index) in episode.characters" :key="index">
       <a @click="onImageSelected(item)">
         <img class="m-5" width="60" height="60" :src="getImageUrl(item)" />
       </a>
     </span>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Episode } from '@/interfaces'
import getIdFromUrl from '@/common/utils'

defineProps<({
  episode: Episode,
})>()

// eslint-disable-next-line
const emit = defineEmits<({
  (e: 'update:character', id: number): void
})>()

function onImageSelected (characterUrl: string) {
  emit('update:character', getIdFromUrl(characterUrl))
}

function getImageUrl (characterUrl: string): string {
  const id = getIdFromUrl(characterUrl)
  return `https://rickandmortyapi.com/api/character/avatar/${id}.jpeg?`
}

</script>

<style scoped>
.episode {
  border: 1px solid #ccc;
  padding: 5px;
  margin: 5px;
  display: flex;
  flex-direction: column;
}

</style>
