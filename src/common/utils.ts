import { CharacterFilter } from '@/interfaces'

function getIdFromUrl (url: string): number {
  const id = url.split('/').pop()
  if (!id) {
    throw new Error('Invalid url provided')
  }
  return parseInt(id)
}

function stringifyFilter (filter: CharacterFilter): string {
  return JSON.stringify(removeEmptyStrings(filter))
}

function removeEmptyStrings (filter: CharacterFilter): CharacterFilter {
  if (filter.name === '') {
    filter.name = undefined
  }
  if (filter.status === '') {
    filter.status = undefined
  }
  return filter
}

export { getIdFromUrl, removeEmptyStrings, stringifyFilter }
