/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios'
import { TFormName } from 'localTypes/form'

export const handleSubmitError = ({
  error,
  expandedKeys,
}: {
  error: AxiosError<any, any>
  expandedKeys: TFormName[]
}): any[] => {
  const invalidPart: string | undefined = error.response?.data.message?.split('is invalid: ')?.[1]
  const errorPathUnsplit = invalidPart?.split(':')[0].trim()
  const errorPath = typeof errorPathUnsplit === 'string' ? errorPathUnsplit.split('.') : []
  const keys = Array.from({ length: errorPath.length }, (_, i) => errorPath.slice(0, i + 1))
  const possibleNewKeys = [...expandedKeys, ...keys]
  const seen = new Set<TFormName>()
  const uniqueKeys = possibleNewKeys.filter(item => {
    const key = Array.isArray(item) ? JSON.stringify(item) : item
    if (seen.has(key as TFormName)) {
      return false
    }
    seen.add(key as TFormName)
    return true
  })

  return uniqueKeys
}

export const handleValidationError = ({
  error,
  expandedKeys,
}: {
  error: { errorFields: { name: TFormName; errors: string[]; warnings: string[] }[] } & unknown
  expandedKeys: TFormName[]
}): any[] => {
  const keysToExpandFromError = error.errorFields.reduce((acc: TFormName[], field) => [...acc, field.name], [])
  const arrayedKeys = keysToExpandFromError.filter(key => Array.isArray(key))
  const arrayedKeysWithAllPossiblePrefixes = (arrayedKeys as (string[] | number[] | (string | number)[])[]).flatMap(
    keys => Array.from({ length: keys.length }, (_, i) => keys.slice(0, i + 1)),
  )
  const nonArrayedKeys = keysToExpandFromError.filter(key => !Array.isArray(key))
  const possibleNewKeys = [...expandedKeys, ...nonArrayedKeys, ...arrayedKeysWithAllPossiblePrefixes]
  const seen = new Set<TFormName>()
  const uniqueKeys = possibleNewKeys.filter(item => {
    const key = Array.isArray(item) ? JSON.stringify(item) : item
    if (seen.has(key as TFormName)) {
      return false
    }
    seen.add(key as TFormName)
    return true
  })

  return uniqueKeys
}
