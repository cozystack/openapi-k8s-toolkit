/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import _ from 'lodash'
import { EditIcon, DeleteIcon } from 'components/atoms'
import { EnrichedTableProvider } from 'components/molecules'
import { useDirectUnknownResource } from 'hooks/useDirectUnknownResource'
import { prepareTemplate } from 'utils/prepareTemplate'
import { TDynamicComponentsAppTypeMap } from '../../types'
import { useMultiQuery } from '../../../DynamicRendererWithProviders/multiQueryProvider'
import { usePartsOfUrl } from '../../../DynamicRendererWithProviders/partsOfUrlContext'
import { useTheme } from '../../../DynamicRendererWithProviders/themeContext'
import { parseMutliqueryText, serializeLabels } from './utils'

export const EnrichedTable: FC<{ data: TDynamicComponentsAppTypeMap['EnrichedTable']; children?: any }> = ({
  data,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  children,
}) => {
  const { data: multiQueryData, isLoading: isMultiqueryLoading } = useMultiQuery()

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    fetchUrl,
    pathToItems,
    clusterNamePartOfUrl,
    labelsSelector,
    labelsSelectorFull,
    fieldSelector,
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

  const fetchUrlPrepared = prepareTemplate({
    template: fetchUrl,
    replaceValues,
  })

  let labelsSuffix: string | undefined
  if (labelsSelector) {
    const parsedObject: Record<string, string> = Object.fromEntries(
      Object.entries(labelsSelector).map(
        ([key, value]) =>
          [key, prepareTemplate({ template: parseMutliqueryText({ text: value, multiQueryData }), replaceValues })] as [
            string,
            string,
          ],
      ),
    )
    const serializedLabels = serializeLabels(parsedObject)
    labelsSuffix = serializeLabels.length > 0 ? `?labelSelector=${serializedLabels}` : undefined
  }

  if (labelsSelectorFull) {
    const value = _.get(multiQueryData[`req${labelsSelectorFull.reqIndex}`], labelsSelectorFull.pathToLabels)
    const serializedLabels = serializeLabels(value)
    labelsSuffix = serializeLabels.length > 0 ? `?labelSelector=${serializedLabels}` : undefined
  }

  let fieldSelectorSuffix: string | undefined
  if (fieldSelector) {
    const preparedFieldSelectorValueText = parseMutliqueryText({ text: fieldSelector?.parsedText, multiQueryData })

    const preparedFieldSelectorValueTextWithPartsOfUrl = prepareTemplate({
      template: preparedFieldSelectorValueText,
      replaceValues,
    })

    const preparedSelector = encodeURIComponent(
      `${fieldSelector.fieldName}=${preparedFieldSelectorValueTextWithPartsOfUrl}`,
    )
    const prefix = labelsSelector ? '&fieldSelector=' : '?fieldSelector='
    fieldSelectorSuffix = `${prefix}${preparedSelector}`
  }

  const {
    data: fetchedData,
    isLoading: isFetchedDataLoading,
    error: fetchedDataError,
  } = useDirectUnknownResource<unknown>({
    uri: `${fetchUrlPrepared}${labelsSuffix || ''}${fieldSelectorSuffix || ''}`,
    queryKey: [fetchUrlPrepared],
    isEnabled: !isMultiqueryLoading,
  })

  if (isMultiqueryLoading) {
    return <div>Loading multiquery</div>
  }

  if (!fetchedData) {
    return <div>No data has been fetched</div>
  }

  if (isFetchedDataLoading) {
    return <div>Loading...</div>
  }

  if (fetchedDataError) {
    return <div>Error: {JSON.stringify(fetchedDataError)}</div>
  }

  const items = _.get(fetchedData, pathToItems)

  if (!items) {
    return <div>No data on this path {JSON.stringify(pathToItems)}</div>
  }

  return (
    <>
      <EnrichedTableProvider
        tableMappingsReplaceValues={replaceValues}
        cluster={clusterName}
        theme={theme}
        dataItems={items}
        tableProps={{
          borderless: true,
          paginationPosition: ['bottomRight'],
          isTotalLeft: true,
          editIcon: <EditIcon />,
          deleteIcon: <DeleteIcon />,
          disablePagination: true,
        }}
        {...props}
        withoutControls
      />
      {children}
    </>
  )
}
