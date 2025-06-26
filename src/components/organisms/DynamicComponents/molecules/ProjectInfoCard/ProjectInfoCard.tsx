/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import { get } from 'lodash'
import { ProjectInfoCard as Card } from 'components/molecules'
import { prepareTemplate } from 'utils/prepareTemplate'
import { TDynamicComponentsAppTypeMap } from '../../types'
import { useMultiQuery } from '../../../DynamicRendererWithProviders/multiQueryProvider'
import { usePartsOfUrl } from '../../../DynamicRendererWithProviders/partsOfUrlContext'

export const ProjectInfoCard: FC<{ data: TDynamicComponentsAppTypeMap['ProjectInfoCard']; children?: any }> = ({
  data,
  children,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, clusterNamePartOfUrl, namespacePartOfUrl, accessGroups, ...props } = data

  const { data: multiQueryData, isError, errors } = useMultiQuery()
  const partsOfUrl = usePartsOfUrl()

  const replaceValues = partsOfUrl.partsOfUrl.reduce<Record<string, string | undefined>>((acc, value, index) => {
    acc[index.toString()] = value
    return acc
  }, {})

  const clusterName = prepareTemplate({
    template: clusterNamePartOfUrl,
    replaceValues,
  })

  const namespace = prepareTemplate({
    template: namespacePartOfUrl,
    replaceValues,
  })

  const parsedAccessGroups = accessGroups.map(accessGroup => {
    const parsedMultiQueryAccessGroup = accessGroup.replace(
      /\{reqs\[(\d+)\]\[((?:\s*['"][^'"]+['"]\s*,?)+)\]\}/g,
      (match, reqIndexStr, rawPath) => {
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
      },
    )

    const parsedPartsOfUrlAccessGroup = prepareTemplate({
      template: parsedMultiQueryAccessGroup,
      replaceValues,
    })

    return parsedPartsOfUrlAccessGroup
  })

  if (isError) {
    return (
      <div>
        <h4>Errors:</h4>
        <ul>{errors.map((e, i) => e && <li key={i}>{e.message}</li>)}</ul>
      </div>
    )
  }

  return (
    <Card clusterName={clusterName} namespace={namespace} accessGroups={parsedAccessGroups} {...props}>
      {children}
    </Card>
  )
}
