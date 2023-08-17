import { ref, Ref } from 'vue'
import { Store, defineStore } from 'pinia'
import { Info, Character, Optional } from '@/interfaces'

import api from '@/api'

type Characters = Info<Character[]>

export interface CharacterStore extends Store {
  characterData: Optional<Characters>;
  fetchCharacterData: () => Promise<void>;
}

function createCharacterStore (page: number): CharacterStore {
  return defineStore(`characters-${page}`, () => {
    const characterData: Ref<Optional<Characters>> = ref(undefined)

    async function fetchCharacterData () {
      const res = await api.getCharacters(page)
      characterData.value = res
    }

    return { characterData, fetchCharacterData }
  }, { persist: true })()
}

export async function useCharacterStore (page: number): Promise<CharacterStore> {
  const storeInstance: CharacterStore = createCharacterStore(page)
  // Avoid fetching data if store instance is already present for this page
  if (storeInstance.characterData === undefined) {
    await storeInstance.fetchCharacterData()
  }
  return storeInstance
}
