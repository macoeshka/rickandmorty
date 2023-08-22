<template>
  <div class="full-container full-height">
    <div class="top-nav d-flex h-15">
      <h2 v-if="total">Results:{{ total }}, Pages: {{ pages }}</h2>
      <h2 v-else>No Results</h2>
      <Pagination v-if="total" v-model="filter.page" :totalPages="pages"></Pagination>
      <select class="select-status" v-model="filter.status">
        <option></option>
        <option>Dead</option>
        <option>Alive</option>
        <option>Unknown</option>
      </select>
      <input class="input-name" type="text" v-model="filter.name"/>
    </div>
    <div class="d-flex h-85">
      <div :class="layoutWidth" class="flex-container scroll-y" v-if="total">
        <div v-for="character in data" :key="character.id">
          <ul>
            <li><a @click="selectedCharacterId = character.id">{{ character.name }}</a></li>
            <li>{{ character.species }}, {{ character.gender }}</li>
            <li><img width="60" height="60" :src="character.image" /></li>
            <li>Episodes:
              <span v-for="(episode, index) in character.episode.slice(0, 5)" :key="episode" >
                <a @click="episodeSelect(episode)">{{ getIdFromUrl(episode) }}</a>
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
          <EpisodeDetail :episode="selectedEpisode" @update:character="selectedCharacterId = $event"  />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, toValue, watch } from 'vue'
import { CharacterStore, useCharacterStore } from '@/store/characters'
import { EpisodeStore, useEpisodeStore } from '@/store/episodes'
import { getIdFromUrl } from '@/common/utils'
import CharacterDetail from '@/components/CharacterDetail.vue'
import EpisodeDetail from '@/components/EpisodeDetail.vue'
import Pagination from '@/components/Pagination.vue'

const filter = reactive({
  page: 1,
  status: undefined,
  name: undefined
})

const episodeStore: EpisodeStore = await useEpisodeStore()
const chStore: CharacterStore = await useCharacterStore(filter)

const { data, total, pages } = chStore.fetchCharactersData(computed(() => filter))

const selectedCharacterId = ref(0)
const selectedCharacter = chStore.fetchCharacterData(computed(() => toValue(selectedCharacterId)))

const selectedEpisodeId = ref(0)
const selectedEpisode = episodeStore.fetchEpisodeData(computed(() => toValue(selectedEpisodeId)))

const layoutWidth = computed((): string => (selectedCharacter.value === null && selectedEpisode.value == null) ? 'full-width' : 'w-70')

function episodeSelect (ep: string) {
  const episode: number = getIdFromUrl(ep)

  selectedEpisodeId.value = episode || 0
}

watch(() => filter.name, () => {
  filter.page = 1
})
watch(() => filter.status, () => {
  filter.page = 1
})

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

.select-status, .input-name {
  color: #42b983;
  background: none;
  border: 1px solid #ccc;
  padding: 5px;
  margin-right: 5px;
  width: 130px;
}
</style>
