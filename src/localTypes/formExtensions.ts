export type TFormPrefill = {
  spec: {
    customizationId: string
    values: {
      path: (string | number)[]
      value: unknown
    }[]
  }
}

type TRangeInputCustomValue =
  | {
      type: 'number'
      value: number
    }
  | {
      type: 'substractResourceValues'
      firstValueUri: string
      firstValuesKeysToValue: string[]
      secondValueUri: string
      secondValuesKeysToValue: string[]
    }
  | {
      type: 'addResourceValues'
      firstValueUri: string
      firstValuesKeysToValue: string[]
      secondValueUri: string
      secondValuesKeysToValue: string[]
    }
  | {
      type: 'resourceValue'
      valueUri: string
      keysToValue: string[]
    }

export type TRangeInputCustomValuesBlock = {
  min: TRangeInputCustomValue
  max: TRangeInputCustomValue
  step: number
}

export type TRangeInputCustomProps = {
  logic: 'memoryLike' | 'cpuLike'
  add: TRangeInputCustomValuesBlock
  edit: TRangeInputCustomValuesBlock
}

export type TListInputCustomProps = {
  valueUri: string
  keysToValue: string[]
  keysToLabel?: string[]
  mode?: 'multiple' | 'tags'
  criteria?: {
    keysToValue: string[]
    type: 'equals' | 'notEquals'
    value: unknown
    keepPrefilled?: boolean
  }
}
