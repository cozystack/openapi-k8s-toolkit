/* eslint-disable max-lines-per-function */
/* eslint-disable no-console */
import React, { FC, useState, useEffect, ReactNode, useCallback } from 'react'
import { Alert } from 'antd'
import _ from 'lodash'
import { TJSON } from 'localTypes/JSON'
import { OpenAPIV2 } from 'openapi-types'
import { TUrlParams } from 'localTypes/form'
import { TFormsPrefillsData, TFormsOverridesData } from 'localTypes/formExtensions'
import { YamlEditorSingleton } from '../../molecules/YamlEditorSingleton'
import { BlackholeForm } from '../BlackholeForm'
import { getPathsWithAdditionalProperties, getPropertiesToMerge } from './helpers'
import { getSwaggerPathAndIsNamespaceScoped, getBodyParametersSchema, processOverride } from './utils'

export type TBlackholeFormDataProviderProps = {
  theme: 'light' | 'dark'
  cluster: string
  urlParams: TUrlParams
  urlParamsForPermissions: {
    apiGroup?: string
    typeName?: string
  }
  swagger: OpenAPIV2.Document | undefined
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
}

export const BlackholeFormDataProvider: FC<TBlackholeFormDataProviderProps> = ({
  theme,
  cluster,
  urlParams,
  urlParamsForPermissions,
  formsPrefillsData,
  swagger,
  namespacesData,
  formsOverridesData,
  data,
  isCreate,
  backlink,
  modeData,
  designNewLayout,
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
    if (!swagger) {
      return
    }

    const { swaggerPath, isNamespaced } = getSwaggerPathAndIsNamespaceScoped({
      swagger,
      data,
    })

    if (isNamespaced) {
      setIsNamespaced(true)
    }

    const { bodyParametersSchema, kindName, error } = getBodyParametersSchema({ swagger, swaggerPath })

    if (error) {
      setIsError(error)
      console.log(error)
      fallbackToManualMode()
      return
    }

    if (kindName) {
      setKindName(kindName)
    }

    const pathsWithAdditionalProperties: (string | number)[][] = getPathsWithAdditionalProperties({
      properties: bodyParametersSchema.properties,
    })

    const propertiesToMerge = getPropertiesToMerge({
      pathsWithAdditionalProperties,
      prefillValuesSchema: data.prefillValuesSchema,
      bodyParametersSchema,
    })

    const oldProperties = _.cloneDeep(bodyParametersSchema.properties)
    const newProperties = _.merge(oldProperties, propertiesToMerge)

    const overrideType =
      data.type === 'apis' ? `${data.apiGroup}/${data.apiVersion}/${data.typeName}` : `v1/${data.typeName}`

    const specificCustomOverrides = formsOverridesData?.items.find(item => item.spec.overrideType === overrideType)

    const { hiddenPaths, expandedPaths, persistedPaths, propertiesToApply, requiredToApply } = processOverride({
      specificCustomOverrides,
      newProperties,
      bodyParametersSchema,
    })
    if (hiddenPaths) {
      setHiddenPaths(hiddenPaths)
    }
    if (expandedPaths) {
      setExpandedPaths(expandedPaths)
    }
    if (persistedPaths) {
      setPersistedPaths(persistedPaths)
    }
    if (propertiesToApply) {
      setProperties(propertiesToApply)
    }
    if (requiredToApply) {
      setRequired(requiredToApply)
    }
  }, [swagger, data, fallbackToManualMode, formsOverridesData])

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
      key={JSON.stringify(properties) + JSON.stringify(required) + JSON.stringify(hiddenPaths) + JSON.stringify(data)}
    />
  )
}
