import { reactive } from 'vue'
import { Store, defineStore } from 'pinia'
import { Info, Character, Optional, CharacterFilter } from '@/interfaces'
import { stringifyFilter } from '@/common/utils'

import api from '@/api'

export interface CharacterStore extends Store {
  characterData: Record<number, Optional<Character>>;
  response: Record<string, Optional<Info<Character[]>>>;
  fetchCharactersData: (filter: CharacterFilter) => Promise<void>;
  fetchCharacterData: (id: number) => Promise<Optional<Character>>;
}

function createCharacterStore (): CharacterStore {
  return defineStore('characters', () => {
    const characterData: Record<number, Optional<Character>> = reactive({})
    const response: Record<string, Optional<Info<Character[]>>> = reactive({})

    async function fetchCharactersData (filter:CharacterFilter) {
      const query = stringifyFilter(filter)
      if (response[query] !== undefined) {
        return
      }
      const res = await api.getCharacters(filter)
      response[query] = res
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

export async function useCharacterStore (query: CharacterFilter): Promise<CharacterStore> {
  const storeInstance: CharacterStore = createCharacterStore()
  await storeInstance.fetchCharactersData(query)
  return storeInstance
}
