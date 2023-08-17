function getIdFromUrl (url: string): number {
  const id = url.split('/').pop()
  if (!id) {
    throw new Error('Invalid url provided')
  }
  return parseInt(id)
}

export default getIdFromUrl
