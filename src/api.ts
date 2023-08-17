import axios from 'axios'

import { Character, Info, Optional } from './interfaces'
type C = Array<Character>;

class Api {
  constructor (readonly server:string) {
    this.server = server
  }

  async getCharacters (page: number): Promise<Optional<Info<C>>> {
    let characterData
    await axios.get<Info<C>>(`${this.server}/character`, {
      params: {
        page: page
      }
    })
      .then((res) => {
        characterData = res.data
        console.log(res.data)
      })
      .catch((err: NodeJS.ErrnoException) => {
        console.error(`API call error, ${err.message}`)
      })
    return characterData
  }

  /* async getEpisodes()

async getLocations() */
}

const api = new Api('https://rickandmortyapi.com/api')
export default api
