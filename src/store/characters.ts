import { reactive, ref, Ref, watchEffect, ComputedRef, toValue } from 'vue'
import { Store, defineStore } from 'pinia'
import { Info, Character, Optional, CharacterFilter } from '@/interfaces'
import { stringifyFilter } from '@/common/utils'

import api from '@/api'

export interface ReactiveData {
  total: Ref<number>;
  pages: Ref<number>;
  data: Ref<Character[]>;
}

export interface CharacterStore extends Store {
  characterData: Record<number, Optional<Character>>;
  response: Record<string, Optional<Info<Character[]>>>;
  fetchCharactersData: (filter: ComputedRef<CharacterFilter>) => ReactiveData;
  fetchCharacterData: (id: ComputedRef<number>) => Ref<Optional<Character> | null>;
}

function createCharacterStore (): CharacterStore {
  return defineStore('characters', () => {
    const characterData: Record<number, Optional<Character>> = reactive({})
    const response: Record<string, Optional<Info<Character[]>>> = reactive({})

    function fetchCharactersData (filter: ComputedRef<CharacterFilter>) {
      const total: Ref<number> = ref(0)
      const pages: Ref<number> = ref(0)
      const data: Ref<Character[]> = ref([])

      const updateResult = (result: Optional<Info<Character[]>>, addToStore: boolean = false) => {
        if (!result) {
          return
        }

        total.value = result.info?.count || 0
        pages.value = result.info?.pages || 0
        data.value.length = 0
        result.results?.forEach(element => {
          data.value.push(element)
          if (addToStore) {
            characterData[element.id] = element
          }
        })
      }

      watchEffect(() => {
        const value = toValue(filter)
        const query = stringifyFilter(value)

        if (response[query] !== undefined) {
          updateResult(response[query])
          return
        }

        api.getCharacters(value)
          .then(res => {
            response[query] = res
            updateResult(res)
          })
      })
      return { total, data, pages }
    }

    function fetchCharacterData (id: ComputedRef<number>): Ref<Optional<Character> | null> {
      const ch: Ref<Optional<Character> | null> = ref(null)

      watchEffect(() => {
        const idValue = toValue(id)

        if (!idValue) {
          ch.value = null
          return
        }

        if (characterData[idValue]) {
          ch.value = characterData[idValue]
          return
        }

        api.getCharacter(idValue)
          .then(res => {
            characterData[idValue] = res
            ch.value = characterData[idValue]
          })
      })

      return ch
    }

    return { characterData, response, fetchCharactersData, fetchCharacterData }
  }, { persist: true })()
}

export async function useCharacterStore (query: CharacterFilter): Promise<CharacterStore> {
  const storeInstance: CharacterStore = createCharacterStore()
  return storeInstance
}
