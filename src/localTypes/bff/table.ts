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
  recordKeysForNavigation?: string[]
  recordKeysForNavigationSecond?: string[]
  recordKeysForNavigationThird?: string[]
}
