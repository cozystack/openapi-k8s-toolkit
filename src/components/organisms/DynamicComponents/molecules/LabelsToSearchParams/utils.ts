/* eslint-disable @typescript-eslint/no-explicit-any */

const flattenOnce = (arr: unknown[][]): unknown[] => arr.reduce<unknown[]>((acc, row) => [...acc, ...row], [])

const isRecordArray = (val: unknown): val is Record<string, string | number>[] => {
  return (
    Array.isArray(val) &&
    val.every(
      item =>
        typeof item === 'object' &&
        item !== null &&
        !Array.isArray(item) &&
        Object.values(item).every(v => typeof v === 'string' || typeof v === 'number'),
    )
  )
}

export const parseArrayOfAny = (value: any[]): { data?: Record<string, string | number>[]; error?: string } => {
  if (!Array.isArray(value)) {
    return { error: 'Value on jsonPath is not an array' }
  }

  let flattenArrayOfUnknown: unknown[] = []
  try {
    flattenArrayOfUnknown = flattenOnce(value)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
    return { error: 'Error while flattening' }
  }

  if (isRecordArray(flattenArrayOfUnknown)) {
    return { data: flattenArrayOfUnknown }
  }

  return { error: 'Value on jsonPath is not a record array' }
}
