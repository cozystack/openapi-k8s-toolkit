import React, { FC, useState, useEffect, ReactNode } from 'react'
import axios, { AxiosError } from 'axios'
import { Flex, Spin, Alert, TablePaginationConfig } from 'antd'
import { TJSON } from 'localTypes/JSON'
import { TPrepareTableReq, TPrepareTableRes } from 'localTypes/bff/table'
import { TAdditionalPrinterColumns } from 'localTypes/richTable'
import { EnrichedTable } from '../EnrichedTable'
import { prepare } from './utils'

export type TEnrichedTableProviderProps = {
  cluster: string
  theme: 'light' | 'dark'
  baseprefix?: string

  dataItems: TJSON[]
  resourceSchema?: TJSON
  dataForControls?: {
    cluster: string
    syntheticProject?: string
    pathPrefix: string
    apiVersion: string
    typeName: string
    backlink: string
    deletePathPrefix: string
    onDeleteHandle: (name: string, endpoint: string) => void
    permissions: {
      canUpdate?: boolean
      canDelete?: boolean
    }
  }

  customizationId?: string
  tableMappingsReplaceValues?: Record<string, string | undefined>
  forceDefaultAdditionalPrinterColumns?: TAdditionalPrinterColumns

  selectData?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (selectedRowKeys: React.Key[], selectedRowsData: { name: string; endpoint: string }[]) => void
    selectedRowKeys: React.Key[]
  }
  tableProps?: {
    borderless?: boolean
    paginationPosition?: TablePaginationConfig['position']
    isTotalLeft?: boolean
    editIcon?: ReactNode
    deleteIcon?: ReactNode
    maxHeight?: number
    virtual?: boolean
    disablePagination?: boolean
  }
  withoutControls?: boolean
}

export const EnrichedTableProvider: FC<TEnrichedTableProviderProps> = ({
  cluster,
  theme,
  baseprefix,
  dataItems,
  resourceSchema,
  dataForControls,
  customizationId,
  tableMappingsReplaceValues,
  forceDefaultAdditionalPrinterColumns,
  selectData,
  tableProps,
  withoutControls,
}) => {
  const [preparedProps, setPreparedProps] = useState<TPrepareTableRes>()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState<false | string | ReactNode>(false)

  useEffect(() => {
    setIsError(undefined)
    const payload: TPrepareTableReq = {
      customizationId,
      tableMappingsReplaceValues,
      forceDefaultAdditionalPrinterColumns,
    }
    axios
      .post<TPrepareTableRes>(`/api/clusters/${cluster}/openapi-bff/tables/tablePrepare/prepareTableProps`, payload)
      .then(({ data }) => {
        setPreparedProps(data)
        setIsError(undefined)
      })
      .catch((e: AxiosError) => {
        setIsError(e.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [cluster, customizationId, tableMappingsReplaceValues, forceDefaultAdditionalPrinterColumns])

  if (!preparedProps && isLoading) {
    return (
      <Flex justify="center">
        <Spin />
      </Flex>
    )
  }

  if (isError) {
    return <Alert message={isError} type="error" />
  }

  if (!preparedProps) {
    return (
      <Flex justify="center">
        <Spin />
      </Flex>
    )
  }

  const { dataSource, columns } = prepare({
    dataItems,
    resourceSchema,
    dataForControls,
    additionalPrinterColumns: preparedProps.additionalPrinterColumns,
  })

  return (
    <EnrichedTable
      theme={theme}
      baseprefix={baseprefix}
      dataSource={dataSource}
      columns={columns}
      pathToNavigate={preparedProps.pathToNavigate}
      recordKeysForNavigation={preparedProps.recordKeysForNavigation}
      additionalPrinterColumnsUndefinedValues={preparedProps.additionalPrinterColumnsUndefinedValues}
      additionalPrinterColumnsTrimLengths={preparedProps.additionalPrinterColumnsTrimLengths}
      additionalPrinterColumnsColWidths={preparedProps.additionalPrinterColumnsColWidths}
      selectData={selectData}
      tableProps={tableProps}
      withoutControls={withoutControls}
    />
  )
}
