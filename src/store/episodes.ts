import { reactive } from 'vue'
import { Store, defineStore } from 'pinia'
import { Episode, Optional } from '@/interfaces'

import api from '@/api'

export interface EpisodeStore extends Store {
  episodeData: Record<number, Optional<Episode>>;
  fetchEpisodeData: (id: number) => Promise<void>;
}

function createEpisodeStore (): EpisodeStore {
  return defineStore('episodes', () => {
    const episodeData: Record<number, Optional<Episode>> = reactive({})

    async function fetchEpisodeData (id: number) {
      const res = await api.getEpisode(id)
      episodeData[id] = res
    }

    return { episodeData, fetchEpisodeData }
  }, { persist: true })()
}

export async function useEpisodeStore (id: number): Promise<EpisodeStore> {
  const storeInstance: EpisodeStore = createEpisodeStore()
  // Avoid fetching data if id is already present in the StoreInstance data
  if (storeInstance.episodeData[id] === undefined) {
    await storeInstance.fetchEpisodeData(id)
  }
  return storeInstance
}
