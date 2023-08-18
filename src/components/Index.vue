<template>
  <div class="full-container full-height">
    <div v-if="res && res.info" class="top-nav d-flex h-15">
      <h2>Results:{{ res.info.count }}, Pages: {{ res.info.pages }}</h2>
      <Pagination v-model="filter.page" :totalPages="res.info.pages"></Pagination>
      <select class="select-status" v-model="filter.status">
        <option></option>
        <option>Dead</option>
        <option>Alive</option>
        <option>Unknown</option>
      </select>

    </div>
    <div class="d-flex h-85">
      <div :class="layoutWidth" class="flex-container scroll-y" v-if="res?.results">
        <div v-for="character in res.results" :key="character.id">
          <ul>
            <li>
              <a @click="characterSelected(character)">{{ character.name }}</a>
            </li>
            <li>{{ character.species }}, {{ character.gender }}</li>
            <li><img width="60" height="60" :src="character.image" /></li>
            <li>
              Episodes:
              <span v-for="(episode, index) in character.episode.slice(0, 5)" :key="episode" >
                <a @click="episodeSelected(episode)">{{ getIdFromUrl(episode) }}</a>
                <span v-if="(index != 4) && (index + 1) < character.episode.length">, </span>
              </span>
              <span v-if="character.episode.length > 5">, ...</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="w-30 scroll-y" v-if="layoutWidth != 'full-width'">
        <div class="character" v-if="selectedCharacter">
          <CharacterDetail :character="selectedCharacter"/>
        </div>
        <div class="episode" v-if="selectedEpisode">
          <EpisodeDetail :episode="selectedEpisode" @update:character="onUpdateCharacter"  />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, Ref, watch } from 'vue'
import { Character, CharacterFilter, Episode } from '@/interfaces'
import { CharacterStore, useCharacterStore } from '@/store/characters'
import { EpisodeStore, useEpisodeStore } from '@/store/episodes'
import getIdFromUrl from '@/common/utils'
import CharacterDetail from '@/components/CharacterDetail.vue'
import EpisodeDetail from '@/components/EpisodeDetail.vue'
import Pagination from '@/components/Pagination.vue'

const selectedCharacter: Ref<Character|null> = ref(null)
const selectedEpisode: Ref<Episode|null> = ref(null)
const filter = reactive({
  page: 1,
  status: undefined
})

let episodeStore: EpisodeStore
// TODO SET FILTER
const chStore: CharacterStore = await useCharacterStore(filter)
const qs = JSON.stringify(filter)
const res = ref(chStore.response[qs])

const layoutWidth = computed((): string =>
  (selectedCharacter.value === null && selectedEpisode.value == null) ? 'full-width' : 'w-70')

function characterSelected (ch: Character) {
  selectedCharacter.value = (ch.id === selectedCharacter.value?.id) ? null : ch
}

async function onUpdateCharacter (id: number) {
  const character = await chStore.fetchCharacterData(id)
  if (character) {
    characterSelected(character)
  }
}

async function episodeSelected (ep: string) {
  const episode: number = getIdFromUrl(ep)
  if (episode === selectedEpisode.value?.id) {
    selectedEpisode.value = null
    return
  }
  episodeStore = await useEpisodeStore(episode)
  selectedEpisode.value = episodeStore.episodeData[episode]!
}

async function updateApiQuery (filter:CharacterFilter) {
  await chStore.fetchCharactersData(filter)
  const query = JSON.stringify(filter)
  res.value = chStore.response[query]
}

watch(() => filter, (newVal, oldVal) => {
  updateApiQuery(newVal)
}, { deep: true })

</script>

<style scoped>

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
  margin-left: -5px;
}
.flex-container > div {
  width: 160px;
  height: 160px;
  margin: 5px;
  border: 1px solid #ccc;
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

.w-30 {
  width: 30%;
}

.top-nav {
  align-items: center;
}

.select-status {
  color: #42b983;
  background: none;
  border: 1px solid #ccc;
  padding: 5px;
}
</style>
