import { DefaultOptionType } from 'antd/es/select'
import { OpenAPIV2 } from 'openapi-types'

export type TPrepareFormRes =
  | {
      result: 'error'
      error: string | undefined
      kindName: string | undefined
      fallbackToManualMode: true
      isNamespaced: boolean
    }
  | {
      result: 'success'
      properties: {
        [name: string]: OpenAPIV2.SchemaObject
      }
      required: string[] | undefined
      hiddenPaths: string[][] | undefined
      expandedPaths: string[][] | undefined
      persistedPaths: string[][] | undefined
      kindName: string | undefined
      isNamespaced: boolean
    }

export type TNamespaceData =
  | {
      filterSelectOptions: (input: string, option?: DefaultOptionType) => boolean
      selectValues: {
        label: string
        value: string
      }[]
      disabled: boolean
    }
  | undefined

export type TFormName = string | number | string[] | number[] | (string | number)[]

export type TExpandedControls = {
  onExpandOpen: (value: TFormName) => void
  onExpandClose: (value: TFormName) => void
  expandedKeys: TFormName[]
}

export type TPersistedControls = {
  onPersistMark: (value: TFormName, type?: 'str' | 'number' | 'arr' | 'obj') => void
  onPersistUnmark: (value: TFormName) => void
  persistedKeys: TFormName[]
  isPersistedKeysShown?: boolean
}

export type TUrlParams = {
  clusterName?: string
  namespace?: string
  syntheticProject?: string
  entryName?: string
}
