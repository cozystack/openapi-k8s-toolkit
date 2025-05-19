import { TFormName } from 'localTypes/form'

export const getStringByName = (name: TFormName): string => {
  if (typeof name === 'string') {
    return name
  }
  if (Array.isArray(name)) {
    const res = name.slice(-1)[0]
    return typeof res === 'string' ? res : String(res)
  }
  // number
  return String(name)
}
