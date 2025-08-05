import _ from 'lodash'
import jp from 'jsonpath'
import { prepareTemplate } from 'utils/prepareTemplate'

export const parsePartsOfUrl = ({
  template,
  replaceValues,
}: {
  template: string
  replaceValues: Record<string, string | undefined>
}): string => {
  return prepareTemplate({ template, replaceValues })
}

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

export const parseJsonPathTemplate = ({
  text,
  multiQueryData,
}: {
  text?: string
  multiQueryData: TDataMap
}): string => {
  if (!text) return ''

  // Regex to match: {reqsJsonPath[<index>]['<jsonpath>']}
  const placeholderRegex = /\{reqsJsonPath\[(\d+)\]\s*\[\s*(['"])([^'"]+)\2\s*\]\}/g

  return text.replace(placeholderRegex, (match, reqIndexStr, _quote, jsonPathExpr) => {
    try {
      const reqIndex = parseInt(reqIndexStr, 10)
      const jsonRoot = multiQueryData[`req${reqIndex}`]

      if (jsonRoot === undefined) {
        return ''
      }

      // Evaluate JSONPath and pick first result
      const results = jp.query(jsonRoot, `$${jsonPathExpr}`)
      if (results.length === 0) {
        return ''
      }

      // Return first result as string
      const value = results[0]
      return value != null ? String(value) : ''
    } catch {
      // On any error, leave the placeholder as-is
      return match
    }
  })
}

export const parseAll = ({
  text,
  replaceValues,
  multiQueryData,
}: {
  text: string
  replaceValues: Record<string, string | undefined>
  multiQueryData: TDataMap
}): string => {
  return parsePartsOfUrl({
    template: parseJsonPathTemplate({
      text: parseMutliqueryText({
        text,
        multiQueryData,
      }),
      multiQueryData,
    }),
    replaceValues,
  })
}
