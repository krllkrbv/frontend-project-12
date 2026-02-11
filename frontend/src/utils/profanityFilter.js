const profaneWords = ['boobs', 'fuck', 'shit', 'ass', 'bitch', 'dick', 'pussy', 'cock']
export const filterProfanity = (text) => {
  if (!text) return text
  let filteredText = text
  profaneWords.forEach((word) => {
    const regex = new RegExp(word, 'gi')
    filteredText = filteredText.replace(regex, '*'.repeat(word.length))
  })
  return filteredText
}
export const isProfane = (text) => {
  if (!text) return false
  return profaneWords.some((word) => {
    const regex = new RegExp(word, 'gi')
    return regex.test(text)
  })
}
