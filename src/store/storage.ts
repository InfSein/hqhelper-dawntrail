export const getItem = <T>(key: string): T | null => {
  const data = window.localStorage.getItem(key)
  if (!data) return null
  try {
    return JSON.parse(data) as T
  } catch (e) {
    return null
  }
}
export const getString = (key: string): string => {
  const data = window.localStorage.getItem(key)
  return data ?? ''
}

export const setItem = (key: string, value: object | string | null) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

export const removeItem = (key: string) => {
  window.localStorage.removeItem(key)
}
