<template>
  <div class="full-container full-height">
    <div class="d-flex h-15">
      <h2>Results:{{ store.characterData?.info?.count }}, Pages: {{ store.characterData?.info?.pages }}</h2>
    </div>
    <div class="d-flex h-85">
      <div :class="layoutWidth" class="flex-container" v-if="store.characterData && store.characterData.results">
        <div v-for="character in store.characterData.results" :key="character.id">
          <ul>
            <li>
              <a @click="characterSelected(character)">{{ character.name }}</a>
            </li>
            <li>{{ character.species }}, {{ character.gender }}</li>
            <li><img width="60" height="60" :src="character.image" /></li>
            <li>
              Episodes:
              <span v-for="(episode, index) in character.episode.slice(0, 5)" :key="episode" >
                <a @click="episodeSelected(episode)">{{ episode.split('/').pop() }}</a>
                <span v-if="(index != 4) && (index + 1) < character.episode.length">, </span>
              </span>
              <span v-if="character.episode.length > 5">, ...</span>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="layoutWidth != 'full-width'">
        <div class="character" v-if="selectedCharacter">
          {{ selectedCharacter.id }}
          {{ selectedCharacter.name }}
        </div>
        <div class="episode" v-if="selectedEpisode">
          {{ selectedEpisode }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// API TEST, REMOVE
import { computed, ref, Ref } from 'vue'
import { Character } from '@/interfaces'
import { CharacterStore, useCharacterStore } from '@/store/characters'

const props = defineProps<{
  page: number;
}>()

const selectedCharacter: Ref<Character|null> = ref(null)
const selectedEpisode: Ref<string|null> = ref(null)

const layoutWidth = computed((): string =>
  (selectedCharacter.value === null && selectedEpisode.value == null) ? 'full-width' : 'w-70')

function characterSelected (ch: Character) {
  console.log('selected:', { ...ch })
  selectedCharacter.value = (ch.id === selectedCharacter.value?.id) ? null : ch
}

function episodeSelected (ep: string) {
  selectedEpisode.value = (ep === selectedEpisode.value) ? null : ep
  console.log('episode selected', ep)
}

const store: CharacterStore = await useCharacterStore(props.page)

</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
li {
  margin: 0 5px;
}
a {
  color: #42b983;
  cursor: pointer;
}

.full-container {
  max-height: 97%;
  display: flex;
  flex-direction: column;
  margin-bottom: 3%
}

.h-15 {
  height: 15%;
}

.h-85 {
  height: 85%;
}

.flex-container {
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;
  margin-left: -5px;
}
.flex-container > div {
  width: 160px;
  height: 160px;
  margin: 5px;
  border: 1px solid #ccc;
}

.d-flex {
  display: flex;
}

.full-height {
  height: 100%;
}

.full-width {
  width: 100%;
}

.w-70 {
  width: 70%;
}

</style>
