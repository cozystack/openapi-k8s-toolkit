import _ from 'lodash'

type TDataMap = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export const parseMutliqueryText = ({ text, multiQueryData }: { text?: string; multiQueryData: TDataMap }) => {
  if (!text) return ''

  return text.replace(/\{reqs\[(\d+)\]\[((?:\s*['"][^'"]+['"]\s*,?)+)\]\}/g, (match, reqIndexStr, rawPath) => {
    try {
      const reqIndex = parseInt(reqIndexStr, 10)

      // Extract quoted keys into a path array using another regex
      // Matches: 'key', "another", 'deeply_nested'
      // Explanation:
      //   ['"]      - opening quote (single or double)
      //   ([^'"]+)  - capture group: any characters that are not quotes
      //   ['"]      - closing quote
      const path = Array.from(rawPath.matchAll(/['"]([^'"]+)['"]/g) as IterableIterator<RegExpMatchArray>).map(
        m => m[1],
      )

      // Use lodash.get to safely access deep value
      const value = _.get(multiQueryData[`req${reqIndex}`], path)
      return value != null ? String(value) : ''
    } catch {
      return match // fallback to original if anything fails
    }
  })
}

export const serializeLabels = (input: unknown): string => {
  // 1. Must be a non-null plain object
  if (
    typeof input !== 'object' ||
    input === null ||
    Array.isArray(input) ||
    Object.getPrototypeOf(input) !== Object.prototype
  ) {
    return 'Expected a plain object'
  }

  const entries = Object.entries(input)

  // 2. Validate all values are string|number
  if (!entries.map(([, v]) => v).every(v => typeof v === 'string' || typeof v === 'number')) {
    return 'All values must be string or number'
  }

  // 3+4. Build "k=v" pairs, join with commas, then URL‑encode
  return encodeURIComponent(entries.map(([k, v]) => `${k}=${v}`).join(','))
}
