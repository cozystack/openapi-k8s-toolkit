/* eslint-disable react/no-unstable-nested-components */
import React, { FC, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, TableProps, PaginationProps, TablePaginationConfig } from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import { get } from 'lodash'
import {
  TAdditionalPrinterColumnsColWidths,
  TAdditionalPrinterColumnsTrimLengths,
  TAdditionalPrinterColumnsUndefinedValues,
} from 'localTypes/richTable'
import { TableComponents } from './atoms'
import { TInternalDataForControls } from './types'
import { getEnrichedColumns, getEnrichedColumnsWithControls } from './utils'

export type TEnrichedTableProps = {
  theme: 'light' | 'dark'
  baseprefix?: string
  dataSource: TableProps['dataSource']
  columns: TableProps['columns']
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
  withoutControls?: boolean
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
}

export const EnrichedTable: FC<TEnrichedTableProps> = ({
  theme,
  baseprefix,
  dataSource,
  columns,
  pathToNavigate,
  recordKeysForNavigation,
  additionalPrinterColumnsUndefinedValues,
  additionalPrinterColumnsTrimLengths,
  additionalPrinterColumnsColWidths,
  selectData,
  withoutControls = false,
  tableProps,
}) => {
  const navigate = useNavigate()

  if (!columns) {
    return null
  }

  const enrichedColumns = getEnrichedColumns({
    columns,
    additionalPrinterColumnsUndefinedValues,
    additionalPrinterColumnsTrimLengths,
    additionalPrinterColumnsColWidths,
  })

  if (!enrichedColumns) {
    return null
  }

  const columnsWithControls = withoutControls
    ? enrichedColumns
    : getEnrichedColumnsWithControls({
        enrichedColumns,
        navigate,
        baseprefix,
        editIcon: tableProps?.editIcon,
        deleteIcon: tableProps?.deleteIcon,
      })

  if (!columnsWithControls) {
    return null
  }

  const showTotal: PaginationProps['showTotal'] = total => `Total: ${total}`

  return (
    <TableComponents.TableContainer
      $isDark={theme === 'dark'}
      $isCursorPointer={!!pathToNavigate}
      $borderless={tableProps?.borderless}
      $isTotalLeft={tableProps?.isTotalLeft}
    >
      <TableComponents.HideableControls>
        <Table<AnyObject>
          dataSource={dataSource}
          columns={columnsWithControls}
          pagination={
            tableProps?.disablePagination
              ? false
              : {
                  position: tableProps?.paginationPosition || ['bottomLeft'],
                  showSizeChanger: true,
                  defaultPageSize: 10,
                  hideOnSinglePage: false,
                  showTotal,
                }
          }
          scroll={{ x: 'max-content', y: tableProps?.maxHeight }}
          virtual={tableProps?.virtual}
          rowSelection={
            selectData
              ? {
                  type: 'checkbox',
                  columnWidth: 48,
                  selectedRowKeys: selectData.selectedRowKeys,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange: (selectedRowKeys: React.Key[], selectedRows: AnyObject[]) => {
                    const rows = selectedRows as { internalDataForControls: TInternalDataForControls }[]
                    selectData.onChange(
                      selectedRowKeys,
                      rows.map(({ internalDataForControls }) => ({
                        name: internalDataForControls.entryName,
                        endpoint: `${internalDataForControls.deletePathPrefix}/${
                          internalDataForControls.apiGroupAndVersion
                        }${
                          internalDataForControls.namespace ? `/namespaces/${internalDataForControls.namespace}` : ''
                        }/${internalDataForControls.typeName}/${internalDataForControls.entryName}`,
                      })),
                    )
                  },
                }
              : undefined
          }
          onRow={record => {
            return {
              onClick: () => {
                if (pathToNavigate && recordKeysForNavigation) {
                  const recordValueRaw = get(record, recordKeysForNavigation)
                  const recordValue =
                    typeof recordValueRaw === 'string' ? recordValueRaw : JSON.stringify(recordValueRaw)
                  const newPath = pathToNavigate.replaceAll('~recordValue~', recordValue)
                  navigate(newPath)
                }
              },
            }
          }}
        />
      </TableComponents.HideableControls>
    </TableComponents.TableContainer>
  )
}
