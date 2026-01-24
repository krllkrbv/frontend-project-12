export const pluralize = (count, forms) => {
  if (count % 10 === 1 && count % 100 !== 11) {
    return forms[0] // сообщение
  }
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return forms[1] // сообщения
  }
  return forms[2] // сообщений
}

export const pluralizeMessages = (count) => {
  return pluralize(count, ['сообщение', 'сообщения', 'сообщений'])
}