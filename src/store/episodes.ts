import { reactive, ComputedRef, Ref, ref, toValue, watchEffect } from 'vue'
import { Store, defineStore } from 'pinia'
import { Episode, Optional } from '@/interfaces'

import api from '@/api'

export interface EpisodeStore extends Store {
  episodeData: Record<number, Optional<Episode>>;
  fetchEpisodeData: (id: ComputedRef<number>) => Ref<Optional<Episode> | null>;
}

function createEpisodeStore (): EpisodeStore {
  return defineStore('episodes', () => {
    const episodeData: Record<number, Optional<Episode>> = reactive({})

    function fetchEpisodeData (id: ComputedRef<number>) {
      const result: Ref<Optional<Episode> | null> = ref(null)

      watchEffect(() => {
        const episodeId = toValue(id)
        if (!episodeId) {
          result.value = null
          return
        }

        if (episodeData[episodeId]) {
          result.value = episodeData[episodeId]
          return
        }

        api.getEpisode(episodeId)
          .then(res => {
            episodeData[episodeId] = res
            result.value = episodeData[episodeId]
          })
      })

      return result
    }

    return { episodeData, fetchEpisodeData }
  }, { persist: true })()
}

export function useEpisodeStore (): EpisodeStore {
  const storeInstance: EpisodeStore = createEpisodeStore()
  // Avoid fetching data if id is already present in the StoreInstance data
  return storeInstance
}
