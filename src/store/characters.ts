import { reactive, ref, Ref } from 'vue'
import { Store, defineStore } from 'pinia'
import { Info, Character, Optional } from '@/interfaces'

import api from '@/api'

export interface CharacterStore extends Store {
  characterData: Record<number, Optional<Character>>;
  response: Optional<Info<Character[]>>;
  fetchCharactersData: (page: number) => Promise<void>;
  fetchCharacterData: (id: number) => Promise<Optional<Character>>;
}

function createCharacterStore (): CharacterStore {
  return defineStore('characters', () => {
    const characterData: Record<number, Optional<Character>> = reactive({})
    const response: Ref<Optional<Info<Character[]>>> = ref(undefined)

    async function fetchCharactersData (page:number) {
      const res = await api.getCharacters(page)
      response.value = res
      if (res && res.results) {
        res.results.forEach(element => {
          characterData[element.id] = element
        })
      }
    }

    async function fetchCharacterData (id:number): Promise<Optional<Character>> {
      if (characterData[id]) {
        return characterData[id]
      }
      const res = await api.getCharacter(id)
      characterData[id] = res
      return characterData[id]
    }

    return { characterData, response, fetchCharactersData, fetchCharacterData }
  }, { persist: true })()
}

// TODO SET UP FILTER
export async function useCharacterStore (page: number): Promise<CharacterStore> {
  const storeInstance: CharacterStore = createCharacterStore()
  await storeInstance.fetchCharactersData(page)
  return storeInstance
}
