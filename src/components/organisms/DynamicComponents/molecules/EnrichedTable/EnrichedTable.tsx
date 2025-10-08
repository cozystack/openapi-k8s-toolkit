/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useState } from 'react'
import jp from 'jsonpath'
import _ from 'lodash'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Flex, Spin, Button } from 'antd'
import { PlusOutlined, ClearOutlined, MinusOutlined } from '@ant-design/icons'
import { EditIcon, DeleteIcon, PaddingContainer, DeleteModal, DeleteModalMany } from 'components/atoms'
import { EnrichedTableProvider } from 'components/molecules'
import { usePermissions } from 'hooks/usePermissions'
import { useDirectUnknownResource } from 'hooks/useDirectUnknownResource'
import { getLinkToForm } from 'utils/tableLocations'
import { prepareTemplate } from 'utils/prepareTemplate'
import { TDynamicComponentsAppTypeMap } from '../../types'
import { useMultiQuery } from '../../../DynamicRendererWithProviders/multiQueryProvider'
import { usePartsOfUrl } from '../../../DynamicRendererWithProviders/partsOfUrlContext'
import { useTheme } from '../../../DynamicRendererWithProviders/themeContext'
import { parseAll } from '../utils'
import { serializeLabels } from './utils'

export const EnrichedTable: FC<{ data: TDynamicComponentsAppTypeMap['EnrichedTable']; children?: any }> = ({
  data,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  children,
}) => {
  const location = useLocation()
  const params = useParams()
  const navigate = useNavigate()

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [selectedRowsData, setSelectedRowsData] = useState<{ name: string; endpoint: string }[]>([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<false | { name: string; endpoint: string }>(false)
  const [isDeleteModalManyOpen, setIsDeleteModalManyOpen] = useState<false | { name: string; endpoint: string }[]>(
    false,
  )

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
    namespace,
    dataForControls,
    baseprefix,
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

  const createPermission = usePermissions({
    group: dataForControls?.apiGroup,
    resource: dataForControls?.resource || '',
    namespace,
    clusterName,
    verb: 'create',
    refetchInterval: false,
  })

  const fetchUrlPrepared = parseAll({ text: fetchUrl, replaceValues, multiQueryData })

  let labelsSuffix: string | undefined
  if (labelsSelector) {
    const parsedObject: Record<string, string> = Object.fromEntries(
      Object.entries(labelsSelector).map(
        ([key, value]) => [key, parseAll({ text: value, replaceValues, multiQueryData })] as [string, string],
      ),
    )
    const serializedLabels = serializeLabels(parsedObject)
    labelsSuffix = serializeLabels.length > 0 ? `?labelSelector=${serializedLabels}` : undefined
  }

  if (labelsSelectorFull) {
    const value = Array.isArray(labelsSelectorFull.pathToLabels)
      ? _.get(multiQueryData[`req${labelsSelectorFull.reqIndex}`], labelsSelectorFull.pathToLabels)
      : jp.query(multiQueryData[`req${labelsSelectorFull.reqIndex}`], `$${labelsSelectorFull.pathToLabels}`)[0]
    const serializedLabels = serializeLabels(value)
    labelsSuffix = serializeLabels.length > 0 ? `?labelSelector=${serializedLabels}` : undefined
  }

  let fieldSelectorSuffix: string | undefined
  if (fieldSelector) {
    const preparedFieldSelectorValueText = parseAll({ text: fieldSelector?.parsedText, replaceValues, multiQueryData })

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
    queryKey: [`${fetchUrlPrepared}${labelsSuffix || ''}${fieldSelectorSuffix || ''}`],
    isEnabled: !isMultiqueryLoading,
  })

  if (isMultiqueryLoading) {
    return <div>Loading multiquery</div>
  }

  // if (!fetchedData) {
  //   return <div>No data has been fetched</div>
  // }

  if (isFetchedDataLoading) {
    return (
      <Flex justify="center">
        <Spin />
      </Flex>
    )
  }

  if (fetchedDataError) {
    return <div>Error: {JSON.stringify(fetchedDataError)}</div>
  }

  const items = Array.isArray(pathToItems)
    ? _.get(fetchedData, pathToItems)
    : jp.query(fetchedData, `$${pathToItems}`)[0]

  if (!items) {
    return <div>No data on this path {JSON.stringify(pathToItems)}</div>
  }

  const clearSelected = () => {
    setSelectedRowKeys([])
    setSelectedRowsData([])
  }

  const onDeleteHandle = (name: string, endpoint: string) => {
    setIsDeleteModalOpen({ name, endpoint })
  }

  const fullPath = `${location.pathname}${location.search}`

  return (
    <>
      <EnrichedTableProvider
        tableMappingsReplaceValues={replaceValues}
        cluster={clusterName}
        namespace={namespace}
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
        dataForControlsInternal={{ onDeleteHandle }}
        dataForControls={dataForControls}
        withoutControls={!dataForControls}
        baseprefix={baseprefix}
        {...props}
      />
      {dataForControls && (
        <PaddingContainer $padding="4px">
          <Flex justify="space-between">
            <Button
              type="primary"
              onClick={() => {
                const url = getLinkToForm({
                  cluster: clusterName,
                  baseprefix,
                  namespace,
                  syntheticProject: params.syntheticProject,
                  apiGroup: dataForControls?.apiGroup,
                  apiVersion: dataForControls?.apiVersion,
                  typeName: dataForControls?.resource,
                  fullPath,
                })
                navigate(url)
              }}
              loading={createPermission.isPending}
              disabled={!createPermission.data?.status.allowed}
            >
              <PlusOutlined />
              Add
            </Button>
            {selectedRowKeys.length > 0 && (
              <Flex gap={16}>
                <Button type="primary" onClick={clearSelected}>
                  <ClearOutlined />
                  Clear
                </Button>
                <Button type="primary" onClick={() => setIsDeleteModalManyOpen(selectedRowsData)}>
                  <MinusOutlined />
                  Delete
                </Button>
              </Flex>
            )}
          </Flex>
        </PaddingContainer>
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          name={isDeleteModalOpen.name}
          onClose={() => {
            setIsDeleteModalOpen(false)
            clearSelected()
          }}
          endpoint={isDeleteModalOpen.endpoint}
        />
      )}
      {isDeleteModalManyOpen !== false && (
        <DeleteModalMany
          data={isDeleteModalManyOpen}
          onClose={() => {
            setIsDeleteModalManyOpen(false)
            clearSelected()
          }}
        />
      )}
      {children}
    </>
  )
}
