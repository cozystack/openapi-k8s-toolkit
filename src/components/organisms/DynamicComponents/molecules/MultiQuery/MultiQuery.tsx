/* eslint-disable react/no-array-index-key */
import React, { FC, useMemo } from 'react'
import { get } from 'lodash'
import { TDynamicComponentsAppTypeMap } from '../../types'
import { useMultiQuery } from '../../../DynamicRendererWithProviders/multiQueryProvider'

export const MultiQuery: FC<{ data: TDynamicComponentsAppTypeMap['multiQuery'] }> = ({ data }) => {
  const { data: multiQueryData, isLoading, isError, errors } = useMultiQuery()

  const preparedText = useMemo(() => {
    if (!data?.text) return ''

    return data.text.replace(/\{reqs\[(\d+)\]\[((?:\s*['"][^'"]+['"]\s*,?)+)\]\}/g, (match, reqIndexStr, rawPath) => {
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
        const value = get(multiQueryData[`req${reqIndex}`], path)
        return value != null ? String(value) : ''
      } catch {
        return match // fallback to original if anything fails
      }
    })
  }, [data?.text, multiQueryData])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return (
      <div>
        <h4>Errors:</h4>
        <ul>{errors.map((e, i) => e && <li key={i}>{e.message}</li>)}</ul>
      </div>
    )
  }

  return <span>{preparedText}</span>
}
