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

export const getRunningContainerNames = (
  pod: unknown & {
    status: unknown & {
      containerStatuses: { name: string; state?: unknown & { running?: unknown } }[]
      initContainerStatuses: { name: string }[]
    }
  },
): { containers: string[]; initContainers: string[] } => {
  const containers = (pod.status?.containerStatuses ?? []).filter(st => Boolean(st.state?.running)).map(st => st.name)
  const initContainers = (pod.status?.initContainerStatuses ?? []).map(st => st.name)
  return { containers, initContainers }
}
