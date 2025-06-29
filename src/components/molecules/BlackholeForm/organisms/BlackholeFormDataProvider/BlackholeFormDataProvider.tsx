/* eslint-disable max-lines-per-function */
/* eslint-disable no-console */
import React, { FC, useState, useEffect, ReactNode, useCallback } from 'react'
import { Alert } from 'antd'
import axios, { AxiosError } from 'axios'
import { TJSON } from 'localTypes/JSON'
import { OpenAPIV2 } from 'openapi-types'
import { TUrlParams, TPrepareFormRes } from 'localTypes/form'
import { TFormsPrefillsData, TFormsOverridesData } from 'localTypes/formExtensions'
import { YamlEditorSingleton } from '../../molecules/YamlEditorSingleton'
import { BlackholeForm } from '../BlackholeForm'

export type TBlackholeFormDataProviderProps = {
  theme: 'light' | 'dark'
  cluster: string
  urlParams: TUrlParams
  urlParamsForPermissions: {
    apiGroup?: string
    typeName?: string
  }
  namespacesData?: {
    items: ({ metadata: { name: string } & unknown } & unknown)[]
  }
  formsPrefillsData?: TFormsPrefillsData
  formsOverridesData?: TFormsOverridesData
  data:
    | {
        type: 'builtin'
        typeName: string
        prefillValuesSchema?: TJSON
        prefillValueNamespaceOnly?: string
      }
    | {
        type: 'apis'
        apiGroup: string
        apiVersion: string
        typeName: string
        prefillValuesSchema?: TJSON
        prefillValueNamespaceOnly?: string
      }
  isCreate?: boolean
  backlink?: string | null
  modeData?: {
    current: string
    onChange: (value: string) => void
    onDisabled: () => void
  }
  designNewLayout?: boolean
  designNewLayoutHeight?: number
}

export const BlackholeFormDataProvider: FC<TBlackholeFormDataProviderProps> = ({
  theme,
  cluster,
  urlParams,
  urlParamsForPermissions,
  formsPrefillsData,
  namespacesData,
  formsOverridesData,
  data,
  isCreate,
  backlink,
  modeData,
  designNewLayout,
  designNewLayoutHeight,
}) => {
  const [properties, setProperties] = useState<
    | {
        [name: string]: OpenAPIV2.SchemaObject
      }
    | undefined
  >(undefined)

  const [required, setRequired] = useState<string[]>([])
  const [hiddenPaths, setHiddenPaths] = useState<string[][]>([])
  const [expandedPaths, setExpandedPaths] = useState<string[][]>([])
  const [persistedPaths, setPersistedPaths] = useState<string[][]>([])

  const [kindName, setKindName] = useState<string>('')
  const [isNamespaced, setIsNamespaced] = useState<boolean>(false)
  const [isError, setIsError] = useState<false | string | ReactNode>(false)

  const fallbackToManualMode = useCallback(() => {
    if (modeData) {
      modeData.onChange('Manual')
      modeData.onDisabled()
    }
  }, [modeData])

  useEffect(() => {
    axios
      .post<TPrepareFormRes>('/openapi-bff/forms/formPrepare/prepareFormProps', {
        data,
        clusterName: cluster,
        formsOverridesData,
      })
      .then(({ data }) => {
        if (data.isNamespaced) {
          setIsNamespaced(true)
        }
        if (data.result === 'error') {
          setIsError(data.error)
          console.log(data.error)
          fallbackToManualMode()
        } else {
          if (data.kindName) {
            setKindName(data.kindName)
          }
          if (data.hiddenPaths) {
            setHiddenPaths(data.hiddenPaths)
          }
          if (data.expandedPaths) {
            setExpandedPaths(data.expandedPaths)
          }
          if (data.persistedPaths) {
            setPersistedPaths(data.persistedPaths)
          }
          if (data.properties) {
            setProperties(data.properties)
          }
          if (data.required) {
            setRequired(data.required)
          }
        }
      })
      .catch((e: AxiosError) => {
        setIsError(e.message)
      })
  }, [cluster, data, fallbackToManualMode, formsOverridesData])

  if (modeData?.current === 'Manual') {
    return (
      <YamlEditorSingleton
        theme={theme}
        cluster={cluster}
        prefillValuesSchema={data.prefillValuesSchema}
        isCreate={isCreate}
        type={data.type}
        isNameSpaced={isNamespaced ? namespacesData?.items.map(el => el.metadata.name) : false}
        apiGroupApiVersion={data.type === 'builtin' ? 'api/v1' : `${data.apiGroup}/${data.apiVersion}`}
        typeName={data.typeName}
        backlink={backlink}
        designNewLayout={designNewLayout}
        designNewLayoutHeight={designNewLayoutHeight}
      />
    )
  }

  if (!properties && !isError) {
    return null
  }

  if (isError) {
    return <Alert message={isError} type="error" />
  }

  return (
    <BlackholeForm
      cluster={cluster}
      theme={theme}
      urlParams={urlParams}
      urlParamsForPermissions={urlParamsForPermissions}
      formsPrefillsData={formsPrefillsData}
      staticProperties={properties}
      required={required}
      hiddenPaths={hiddenPaths}
      expandedPaths={expandedPaths}
      persistedPaths={persistedPaths}
      prefillValuesSchema={data.prefillValuesSchema}
      prefillValueNamespaceOnly={data.prefillValueNamespaceOnly}
      isCreate={isCreate}
      type={data.type}
      isNameSpaced={isNamespaced ? namespacesData?.items.map(el => el.metadata.name) : false}
      apiGroupApiVersion={data.type === 'builtin' ? 'api/v1' : `${data.apiGroup}/${data.apiVersion}`}
      kindName={kindName}
      typeName={data.typeName}
      backlink={backlink}
      designNewLayout={designNewLayout}
      designNewLayoutHeight={designNewLayoutHeight}
      key={JSON.stringify(properties) + JSON.stringify(required) + JSON.stringify(hiddenPaths) + JSON.stringify(data)}
    />
  )
}
