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
}

export type TPrepareTableRes = {
  additionalPrinterColumns: TAdditionalPrinterColumns
  additionalPrinterColumnsUndefinedValues?: TAdditionalPrinterColumnsUndefinedValues
  additionalPrinterColumnsTrimLengths?: TAdditionalPrinterColumnsTrimLengths
  additionalPrinterColumnsColWidths?: TAdditionalPrinterColumnsColWidths

  pathToNavigate?: string
  recordKeysForNavigation?: string | string[] // jsonpath or keys as string[]
  recordKeysForNavigationSecond?: string | string[] // jsonpath or keys as string[]
  recordKeysForNavigationThird?: string | string[] // jsonpath or keys as string[]
}
