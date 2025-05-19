import { TFormPrefill } from 'localTypes/formExtensions'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type SafeShallowShape<Type extends {}> = {
  [_ in keyof Type]?: unknown
}

export const isFormPrefill = (root: unknown): root is TFormPrefill => {
  if (!(typeof root === 'object' && root !== null)) {
    return false
  }
  const { spec }: SafeShallowShape<TFormPrefill> = root
  if (!(typeof spec === 'object' && spec !== null)) {
    return false
  }
  const { overrideType, values }: SafeShallowShape<TFormPrefill['spec']> = spec
  if (!(typeof overrideType === 'string')) {
    return false
  }
  if (!Array.isArray(values)) {
    return false
  }

  return true
}
