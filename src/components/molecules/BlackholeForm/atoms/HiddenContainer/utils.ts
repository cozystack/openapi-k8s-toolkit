import { TFormName } from 'localTypes/form'

// robust comparator: haystack is string[][], needle may have numbers
export const includesPath = (haystack: string[][], needle: (string | number)[]) =>
  haystack.some(h => h.length === needle.length && h.every((seg, i) => seg === String(needle[i])))

export const toArray = (p?: TFormName): (string | number)[] | undefined =>
  // eslint-disable-next-line no-nested-ternary
  p === undefined ? undefined : Array.isArray(p) ? p : [p]
