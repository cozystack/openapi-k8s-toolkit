/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import { EditIcon, DeleteIcon } from 'components/atoms'
import { EnrichedTableProvider } from 'components/molecules'
import { useDirectUnknownResource } from 'hooks/useDirectUnknownResource'
import { TJSON } from 'localTypes/JSON'
import { prepareTemplate } from 'utils/prepareTemplate'
import { TDynamicComponentsAppTypeMap } from '../../types'
import { usePartsOfUrl } from '../../../DynamicRendererWithProviders/partsOfUrlContext'
import { useTheme } from '../../../DynamicRendererWithProviders/themeContext'

export const EnrichedTable: FC<{ data: TDynamicComponentsAppTypeMap['EnrichedTable']; children?: any }> = ({
  data,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  children,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, fetchUrl, clusterNamePartOfUrl, ...props } = data

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

  const {
    data: fetchedData,
    isLoading: isFetchedDataLoading,
    error: fetchedDataError,
  } = useDirectUnknownResource<unknown & { items: TJSON[] }>({
    uri: fetchUrlPrepared,
    queryKey: [fetchUrlPrepared],
  })

  if (!fetchedData) {
    return <div>No data has been fetched</div>
  }

  if (isFetchedDataLoading) {
    return <div>Loading...</div>
  }

  if (fetchedDataError) {
    return <div>Error: {JSON.stringify(fetchedDataError)}</div>
  }

  return (
    <>
      <EnrichedTableProvider
        tableMappingsReplaceValues={replaceValues}
        cluster={clusterName}
        theme={theme}
        dataItems={fetchedData.items}
        tableProps={{
          borderless: true,
          paginationPosition: ['bottomRight'],
          isTotalLeft: true,
          editIcon: <EditIcon />,
          deleteIcon: <DeleteIcon />,
          disablePagination: true,
        }}
        {...props}
      />
      {children}
    </>
  )
}
