/* eslint-disable @typescript-eslint/no-explicit-any */

const isRecordStringOrNumber = (value: unknown): value is Record<string, string | number> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  for (const key in value) {
    if (typeof key !== 'string') return false

    const val = (value as Record<string, unknown>)[key]
    if (typeof val !== 'string' && typeof val !== 'number') {
      return false
    }
  }

  return true
}

export const parseArrayOfAny = (value: any[]): { data?: Record<string, string | number>; error?: string } => {
  if (!Array.isArray(value)) {
    return { error: 'Value on jsonPath is not an array' }
  }

  if (isRecordStringOrNumber(value[0])) {
    return { data: value[0] }
  }

  return { error: 'Value on jsonPath is not a record array' }
}
