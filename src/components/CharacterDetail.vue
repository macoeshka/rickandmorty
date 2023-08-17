<template>
  <div class="character flex-column">
    <div class="d-flex flex-center">
      <h3>{{ props.character.name }}</h3>
    </div>
    <div class="d-flex">
    <img class="character-image" :src=props.character.image />
    <ul>
      <li><strong>Species:</strong> {{ props.character.species }}</li>
      <li><strong>Gender:</strong> {{ props.character.gender }}</li>
      <li><strong>Status:</strong> {{ props.character.status }}</li>
      <li><strong>Location:</strong> {{ props.character.location.name }}</li>
    </ul>
  </div>
</div>
</template>

<script setup lang="ts">
import { Character } from '@/interfaces'

const props = defineProps<{
  character: Character;
}>()
</script>

<style scoped>

.character {
  border: 1px solid #ccc;
  padding: 5px;
  margin: 5px;
  display: flex;
  flex-direction: column;
}

.character-image {
  width: 150px;
  height: 150px;
}

.flex-center {
  justify-content: center;
}

</style>
