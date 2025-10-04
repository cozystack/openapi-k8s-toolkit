/* eslint-disable @typescript-eslint/no-explicit-any */

const isRecordStringNumber = (value: unknown): value is Record<string, string | number> =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  Object.entries(value).every(([k, v]) => typeof k === 'string' && (typeof v === 'string' || typeof v === 'number'))

export const parseArrayOfAny = (value: any[]): { data?: Record<string, string | number>; error?: string } => {
  if (!Array.isArray(value)) {
    return { error: 'Value on jsonPath is not an array' }
  }

  if (isRecordStringNumber(value[0])) {
    return { data: value[0] }
  }

  return { error: 'Value on jsonPath is not a record array' }
}

export const truncate = (text: string, max?: number): string => {
  if (!max) {
    return text
  }

  return text.length > max ? text.slice(0, max) + '...' : text
}
