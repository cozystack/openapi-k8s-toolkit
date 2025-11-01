/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import jp from 'jsonpath'
import _ from 'lodash'
import { Events as StandaloneEvents } from 'components/molecules'
import { prepareTemplate } from 'utils/prepareTemplate'
import { TDynamicComponentsAppTypeMap } from '../../types'
import { useMultiQuery } from '../../../DynamicRendererWithProviders/multiQueryProvider'
import { usePartsOfUrl } from '../../../DynamicRendererWithProviders/partsOfUrlContext'
import { useTheme } from '../../../DynamicRendererWithProviders/themeContext'
import { parseAll } from '../utils'
import { serializeLabelsWithNoEncoding } from './utils'

export const Events: FC<{ data: TDynamicComponentsAppTypeMap['Events']; children?: any }> = ({
  data,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  children,
}) => {
  const { data: multiQueryData, isLoading: isMultiqueryLoading } = useMultiQuery()

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    baseprefix,
    clusterNamePartOfUrl,
    wsUrl,
    pageSize,
    substractHeight,
    limit,
    labelsSelector,
    labelsSelectorFull,
    fieldSelector,
    baseFactoryNamespacedAPIKey,
    baseFactoryClusterSceopedAPIKey,
    baseFactoryNamespacedBuiltinKey,
    baseFactoryClusterSceopedBuiltinKey,
    baseNamespaceFactoryKey,
    ...props
  } = data

  const theme = useTheme()
  const partsOfUrl = usePartsOfUrl()

  const replaceValues = partsOfUrl.partsOfUrl.reduce<Record<string, string | undefined>>((acc, value, index) => {
    acc[index.toString()] = value
    return acc
  }, {})

  const clusterName = prepareTemplate({
    template: clusterNamePartOfUrl,
    replaceValues,
  })

  const wsUrlPrepared = parseAll({ text: wsUrl, replaceValues, multiQueryData })

  const params = new URLSearchParams()

  if (limit) {
    params.set('limit', limit.toString())
  }

  if (labelsSelector && Object.keys(labelsSelector).length > 0) {
    const parsedObject: Record<string, string> = Object.fromEntries(
      Object.entries(labelsSelector).map(
        ([k, v]) => [k, parseAll({ text: v, replaceValues, multiQueryData })] as [string, string],
      ),
    )
    const serializedLabels = serializeLabelsWithNoEncoding(parsedObject)
    if (serializedLabels.length > 0) params.set('labelSelector', serializedLabels)
  }

  if (labelsSelectorFull) {
    const root = multiQueryData[`req${labelsSelectorFull.reqIndex}`]
    const value = Array.isArray(labelsSelectorFull.pathToLabels)
      ? _.get(root, labelsSelectorFull.pathToLabels)
      : jp.query(root, `$${labelsSelectorFull.pathToLabels}`)[0]

    const serializedLabels = serializeLabelsWithNoEncoding(value)
    if (serializedLabels.length > 0) params.set('labelSelector', serializedLabels)
  }

  if (fieldSelector) {
    const preparedFieldSelectorValueText = parseAll({ text: fieldSelector?.parsedText, replaceValues, multiQueryData })

    const preparedFieldSelectorValueTextWithPartsOfUrl = prepareTemplate({
      template: preparedFieldSelectorValueText,
      replaceValues,
    })

    params.set('fieldSelector', `${fieldSelector.fieldName}=${preparedFieldSelectorValueTextWithPartsOfUrl}`)
  }

  const searchParams = params.toString()
  const wsUrlWithParams = `${wsUrlPrepared}${searchParams ? `?${searchParams}` : ''}`

  if (isMultiqueryLoading) {
    return <div>Loading multiquery</div>
  }

  return (
    <>
      <StandaloneEvents
        theme={theme}
        baseprefix={baseprefix}
        cluster={clusterName}
        wsUrl={wsUrlWithParams}
        pageSize={pageSize}
        substractHeight={substractHeight || 340}
        baseFactoryNamespacedAPIKey={baseFactoryNamespacedAPIKey}
        baseFactoryClusterSceopedAPIKey={baseFactoryClusterSceopedAPIKey}
        baseFactoryNamespacedBuiltinKey={baseFactoryNamespacedBuiltinKey}
        baseFactoryClusterSceopedBuiltinKey={baseFactoryClusterSceopedBuiltinKey}
        baseNamespaceFactoryKey={baseNamespaceFactoryKey}
        {...props}
      />
      {children}
    </>
  )
}
