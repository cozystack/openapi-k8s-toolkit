// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isFlatObject = (obj: Record<string, any>): boolean => {
  return Object.entries(obj).every(([, value]) => {
    // Allow null, but not other objects
    return value === null || typeof value !== 'object'
  })
}
