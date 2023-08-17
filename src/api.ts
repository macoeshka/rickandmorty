import axios from 'axios'

import { Character, Episode, Info, Optional } from './interfaces'
type C = Array<Character>;

class Api {
  constructor (readonly server:string) {
    this.server = server
  }

  async getCharacters (page: number): Promise<Optional<Info<C>>> {
    let charactersData
    await axios.get<Info<C>>(`${this.server}/character`, {
      // TODO ADD FILTER PARAMS
      params: {
        page: page
      }
    })
      .then((res) => {
        charactersData = res.data
      })
      .catch((err: NodeJS.ErrnoException) => {
        console.error(`Character API call error, ${err.message}`)
      })
    return charactersData
  }

  async getCharacter (id: number): Promise<Optional<Character>> {
    let characterData
    await axios.get<Character>(`${this.server}/character/${id}`)
      .then((res) => {
        characterData = res.data
      })
      .catch((err: NodeJS.ErrnoException) => {
        console.error(`Character API call error, ${err.message}`)
      })
    return characterData
  }

  async getEpisode (id: number): Promise<Optional<Episode>> {
    let episodeData
    await axios.get<Episode>(`${this.server}/episode/${id}`, {
    })
      .then((res) => {
        episodeData = res.data
      })
      .catch((err: NodeJS.ErrnoException) => {
        console.error(`Episode API call error, ${err.message}`)
      })
    return episodeData
  }
}

const api = new Api('https://rickandmortyapi.com/api')
export default api
