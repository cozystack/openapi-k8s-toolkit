import { TCrdResources } from 'localTypes/k8s'
import {
  TAdditionalPrinterColumns,
  TAdditionalPrinterColumnsUndefinedValues,
  TAdditionalPrinterColumnsColWidths,
  TAdditionalPrinterColumnsTrimLengths,
} from 'localTypes/richTable'
import {
  isWithAdditionalPrinterColumns,
  isWithAdditionalPrinterColumnsUndefinedValues,
  isWithAdditionalPrinterColumnsColWidths,
  isWithAdditionalPrinterColumnsTrimLengths,
} from './guards'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const parseCustomOverrides = ({
  columnsOverridesData,
  overrideType,
}: {
  columnsOverridesData?: TCrdResources
  overrideType: string
}): {
  ensuredCustomOverrides?: TAdditionalPrinterColumns
  ensuredCustomOverridesUndefinedValues?: TAdditionalPrinterColumnsUndefinedValues
  ensuredCustomOverridesTrimLengths?: TAdditionalPrinterColumnsTrimLengths
  ensuredCustomOverridesColWidths?: TAdditionalPrinterColumnsColWidths
} => {
  const specificCustomOverrides = columnsOverridesData?.items.find(
    item =>
      typeof item === 'object' &&
      !Array.isArray(item) &&
      item !== null &&
      item.spec &&
      typeof item.spec === 'object' &&
      !Array.isArray(item.spec) &&
      item.spec !== null &&
      typeof item.spec.overrideType === 'string' &&
      item.spec.overrideType === overrideType,
  )

  const ensuredCustomOverrides = isWithAdditionalPrinterColumns(specificCustomOverrides)
    ? specificCustomOverrides.spec.additionalPrinterColumns
    : undefined

  const ensuredCustomOverridesUndefinedValues = isWithAdditionalPrinterColumnsUndefinedValues(specificCustomOverrides)
    ? specificCustomOverrides.spec.additionalPrinterColumnsUndefinedValues
    : undefined

  const ensuredCustomOverridesTrimLengths = isWithAdditionalPrinterColumnsTrimLengths(specificCustomOverrides)
    ? specificCustomOverrides.spec.additionalPrinterColumnsTrimLengths
    : undefined

  const ensuredCustomOverridesColWidths = isWithAdditionalPrinterColumnsColWidths(specificCustomOverrides)
    ? specificCustomOverrides.spec.additionalPrinterColumnsColWidths
    : undefined

  return {
    ensuredCustomOverrides,
    ensuredCustomOverridesUndefinedValues,
    ensuredCustomOverridesTrimLengths,
    ensuredCustomOverridesColWidths,
  }
}
