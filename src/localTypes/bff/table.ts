import { TableProps } from 'antd'
import { TJSON } from 'localTypes/JSON'
import {
  TAdditionalPrinterColumns,
  TAdditionalPrinterColumnsUndefinedValues,
  TAdditionalPrinterColumnsTrimLengths,
  TAdditionalPrinterColumnsColWidths,
} from 'localTypes/richTable'

export type TPrepareTableReq = {
  customizationId?: string
  tableMappingsReplaceValues?: Record<string, string | undefined>
  forceDefaultAdditionalPrinterColumns?: TAdditionalPrinterColumns

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
}

export type TPrepareTableRes = {
  dataSource: TableProps['dataSource']
  // dataSource: any[]
  columns: TableProps['columns']
  // columns: { title: string; dataIndex: string | string[]; key: string }[]

  additionalPrinterColumnsUndefinedValues?: TAdditionalPrinterColumnsUndefinedValues
  additionalPrinterColumnsTrimLengths?: TAdditionalPrinterColumnsTrimLengths
  additionalPrinterColumnsColWidths?: TAdditionalPrinterColumnsColWidths

  pathToNavigate?: string
  recordKeysForNavigation?: string[]
}
