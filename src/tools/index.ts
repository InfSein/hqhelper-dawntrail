export const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))
