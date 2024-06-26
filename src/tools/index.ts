export const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))

export const getFirstNChars = (str: string, n: number): string => str.substring(0, n)
export const getCharsUntilLastN = (str: string, n: number): string => str.substring(0, str.length - n)
