import React, { FC, ReactNode } from 'react'
import { TablePaginationConfig } from 'antd'
import {
  TAdditionalPrinterColumns,
  TAdditionalPrinterColumnsUndefinedValues,
  TAdditionalPrinterColumnsTrimLengths,
  TAdditionalPrinterColumnsColWidths,
} from 'localTypes/richTable'
import { TJSON } from 'localTypes/JSON'
import { EnrichedTable } from '../EnrichedTable'
import { prepareDataForEnrichedColumns } from './utils'

export type TEnrichedTableProviderProps = {
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
  additionalPrinterColumns?: TAdditionalPrinterColumns

  pathToNavigate?: string
  recordKeysForNavigation?: string[]
  additionalPrinterColumnsUndefinedValues?: TAdditionalPrinterColumnsUndefinedValues
  additionalPrinterColumnsTrimLengths?: TAdditionalPrinterColumnsTrimLengths
  additionalPrinterColumnsColWidths?: TAdditionalPrinterColumnsColWidths
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
  }
}

export const EnrichedTableProvider: FC<TEnrichedTableProviderProps> = ({
  theme,
  baseprefix,
  dataItems,
  resourceSchema,
  dataForControls,
  additionalPrinterColumns,
  pathToNavigate,
  recordKeysForNavigation,
  additionalPrinterColumnsUndefinedValues,
  additionalPrinterColumnsTrimLengths,
  additionalPrinterColumnsColWidths,
  selectData,
  tableProps,
}) => {
  if (!resourceSchema && !additionalPrinterColumns) {
    return null
  }

  const { dataSource, columns } = prepareDataForEnrichedColumns({
    dataItems,
    resourceSchema,
    dataForControls,
    additionalPrinterColumns,
  })

  return (
    <EnrichedTable
      theme={theme}
      baseprefix={baseprefix}
      dataSource={dataSource}
      columns={columns}
      pathToNavigate={pathToNavigate}
      recordKeysForNavigation={recordKeysForNavigation}
      additionalPrinterColumnsUndefinedValues={additionalPrinterColumnsUndefinedValues}
      additionalPrinterColumnsTrimLengths={additionalPrinterColumnsTrimLengths}
      additionalPrinterColumnsColWidths={additionalPrinterColumnsColWidths}
      selectData={selectData}
      tableProps={tableProps}
    />
  )
}
