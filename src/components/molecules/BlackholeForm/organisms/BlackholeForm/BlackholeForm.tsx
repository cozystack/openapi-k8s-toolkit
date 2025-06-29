/* eslint-disable no-nested-ternary */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-console */
import React, { FC, useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { theme as antdtheme, Form, Button, Alert, Flex, Modal, Typography } from 'antd'
import { BugOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import axios, { isAxiosError } from 'axios'
import _ from 'lodash'
import { OpenAPIV2 } from 'openapi-types'
import { TJSON } from 'localTypes/JSON'
import { TFormName, TUrlParams } from 'localTypes/form'
import { TFormsPrefillsData } from 'localTypes/formExtensions'
import { TRequestError } from 'localTypes/api'
import { usePermissions } from 'hooks/usePermissions'
import { createNewEntry, updateEntry } from 'api/forms'
import { filterSelectOptions } from 'utils/filterSelectOptions'
import {
  removeEmptyFormValues,
  renameBrokenFieldBack,
  // renameBrokenFieldBackToFormAgain,
} from 'utils/removeEmptyFormValues'
import { normalizeValuesForQuotas, normalizeValuesForQuotasToNumber } from 'utils/normalizeValuesForQuotas'
import { getAllPathsFromObj } from 'utils/getAllPathsFromObj'
import { getPrefixSubarrays } from 'utils/getPrefixSubArrays'
import { Spacer } from 'components/atoms'
import { YamlEditor } from '../../molecules'
import { getObjectFormItemsDraft } from './utils'
import { Styled } from './styled'
import { isFormPrefill } from './guards'
import { DesignNewLayoutProvider } from './context'

type TBlackholeFormCreateProps = {
  cluster: string
  theme: 'light' | 'dark'
  urlParams: TUrlParams
  urlParamsForPermissions: {
    apiGroup?: string
    typeName?: string
  }
  formsPrefillsData?: TFormsPrefillsData
  staticProperties: OpenAPIV2.SchemaObject['properties']
  required?: string[]
  hiddenPaths?: string[][]
  expandedPaths?: string[][]
  persistedPaths?: string[][]
  prefillValuesSchema?: TJSON
  prefillValueNamespaceOnly?: string
  isNameSpaced?: false | string[]
  isCreate?: boolean
  type: 'builtin' | 'apis'
  apiGroupApiVersion: string
  kindName: string
  typeName: string
  backlink?: string | null
  designNewLayout?: boolean
  designNewLayoutHeight?: number
}

const Editor = React.lazy(() => import('@monaco-editor/react'))

export const BlackholeForm: FC<TBlackholeFormCreateProps> = ({
  cluster,
  theme,
  urlParams,
  urlParamsForPermissions,
  formsPrefillsData,
  staticProperties,
  required,
  hiddenPaths,
  expandedPaths,
  persistedPaths,
  prefillValuesSchema,
  prefillValueNamespaceOnly,
  isNameSpaced,
  isCreate,
  type,
  apiGroupApiVersion,
  kindName,
  typeName,
  backlink,
  designNewLayout,
  designNewLayoutHeight,
}) => {
  const { token } = antdtheme.useToken()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const namespaceFromFormData = Form.useWatch<string>(['metadata', 'namespace'], form)
  const [properties, setProperties] = useState<OpenAPIV2.SchemaObject['properties']>(staticProperties)
  const [yamlValues, setYamlValues] = useState<Record<string, unknown>>()
  const debouncedSetYamlValues = useDebounceCallback(setYamlValues, 500)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<TRequestError>()
  const [isDebugModalOpen, setIsDebugModalOpen] = useState<boolean>(false)
  const [expandedKeys, setExpandedKeys] = useState<TFormName[]>(expandedPaths || [])
  const [persistedKeys, setPersistedKeys] = useState<TFormName[]>(persistedPaths || [])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPersistedKeysShown, setIsPersistedKeysShown] = useState<boolean>(true)

  const overflowRef = useRef<HTMLDivElement | null>(null)

  const createPermission = usePermissions({
    apiGroup: type === 'builtin' ? '' : urlParamsForPermissions.apiGroup ? urlParamsForPermissions.apiGroup : '',
    typeName: urlParamsForPermissions.typeName || '',
    namespace: isNameSpaced ? namespaceFromFormData : '',
    clusterName: cluster,
    verb: 'create',
    refetchInterval: false,
    enabler: isCreate === true,
  })

  const updatePermission = usePermissions({
    apiGroup: type === 'builtin' ? '' : urlParamsForPermissions.apiGroup ? urlParamsForPermissions.apiGroup : '',
    typeName: urlParamsForPermissions.typeName || '',
    namespace: isNameSpaced ? namespaceFromFormData : '',
    clusterName: cluster,
    verb: 'update',
    refetchInterval: false,
    enabler: isCreate !== true,
  })

  const onSubmit = () => {
    if (overflowRef.current) {
      const { scrollHeight, clientHeight } = overflowRef.current
      overflowRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      })
    }
    form
      .validateFields()
      .then(() => {
        setIsLoading(true)
        setError(undefined)
        const values = form.getFieldsValue()
        const cleanSchema = removeEmptyFormValues(values, persistedKeys)
        const fixedCleanSchema = renameBrokenFieldBack(cleanSchema)
        const quotasFixedSchema = normalizeValuesForQuotas(fixedCleanSchema, properties)
        const body = quotasFixedSchema
        const { namespace } = cleanSchema.metadata
        const endpoint = `/api/clusters/${cluster}/k8s/${type === 'builtin' ? '' : 'apis/'}${apiGroupApiVersion}${
          isNameSpaced ? `/namespaces/${namespace}` : ''
        }/${typeName}/${isCreate ? '' : cleanSchema.metadata.name}`
        if (isCreate) {
          createNewEntry({ endpoint, body })
            .then(res => {
              console.log(res)
              if (backlink) {
                navigate(backlink)
              }
            })
            .catch(error => {
              console.log('Form submit error', error)
              setIsLoading(false)
              if (isAxiosError(error) && error.response?.data.message.includes('Required value')) {
                const invalidPart = error.response?.data.message.split('is invalid: ')[1]
                const errorPath = invalidPart.split(':')[0].trim().split('.')
                const keys = Array.from({ length: errorPath.length }, (_, i) => errorPath.slice(0, i + 1))
                const possibleNewKeys = [...expandedKeys, ...keys]
                const seen = new Set<TFormName>()
                const uniqueKeys = possibleNewKeys.filter(item => {
                  const key = Array.isArray(item) ? JSON.stringify(item) : item
                  if (seen.has(key as TFormName)) {
                    return false
                  }
                  seen.add(key as TFormName)
                  return true
                })
                setExpandedKeys([...uniqueKeys])
              }
              setError(error)
            })
        } else {
          updateEntry({ endpoint, body })
            .then(res => {
              console.log(res)
              if (backlink) {
                navigate(backlink)
              }
            })
            .catch(error => {
              console.log('Form submit error', error)
              setIsLoading(false)
              if (isAxiosError(error) && error.response?.data.message.includes('Required value')) {
                const invalidPart = error.response?.data.message.split('is invalid: ')[1]
                const errorPath = invalidPart.split(':')[0].trim().split('.')
                const keys = Array.from({ length: errorPath.length }, (_, i) => errorPath.slice(0, i + 1))
                const possibleNewKeys = [...expandedKeys, ...keys]
                const seen = new Set<TFormName>()
                const uniqueKeys = possibleNewKeys.filter(item => {
                  const key = Array.isArray(item) ? JSON.stringify(item) : item
                  if (seen.has(key as TFormName)) {
                    return false
                  }
                  seen.add(key as TFormName)
                  return true
                })
                setExpandedKeys([...uniqueKeys])
              }
              setError(error)
            })
        }
      })
      .catch((error: { errorFields: { name: TFormName; errors: string[]; warnings: string[] }[] } & unknown) => {
        console.log('Validating error', error)
        const keysToExpandFromError = error.errorFields.reduce((acc: TFormName[], field) => [...acc, field.name], [])
        const arrayedKeys = keysToExpandFromError.filter(key => Array.isArray(key))
        const arrayedKeysWithAllPossiblePrefixes = (
          arrayedKeys as (string[] | number[] | (string | number)[])[]
        ).flatMap(keys => Array.from({ length: keys.length }, (_, i) => keys.slice(0, i + 1)))
        const nonArrayedKeys = keysToExpandFromError.filter(key => !Array.isArray(key))
        const possibleNewKeys = [...expandedKeys, ...nonArrayedKeys, ...arrayedKeysWithAllPossiblePrefixes]
        const seen = new Set<TFormName>()
        const uniqueKeys = possibleNewKeys.filter(item => {
          const key = Array.isArray(item) ? JSON.stringify(item) : item
          if (seen.has(key as TFormName)) {
            return false
          }
          seen.add(key as TFormName)
          return true
        })
        setExpandedKeys([...uniqueKeys])
      })
  }

  const onValuesChangeCallback = useCallback(() => {
    const values = form.getFieldsValue()
    axios
      .post('/openapi-bff/forms/formSync/getYamlValuesByFromValues', {
        values,
        persistedKeys,
        properties,
      })
      .then(({ data }) => debouncedSetYamlValues(data))
    // const cleanSchema = removeEmptyFormValues(values, persistedKeys)
    // const fixedCleanSchema = renameBrokenFieldBack(cleanSchema)
    // const quotasFixedSchema = normalizeValuesForQuotas(fixedCleanSchema, properties)
    // const body = quotasFixedSchema
    // debouncedSetYamlValues(body)
  }, [form, debouncedSetYamlValues, properties, persistedKeys])

  const onYamlChangeCallback = (values: Record<string, unknown>) => {
    axios
      .post('/openapi-bff/forms/formSync/getFormValuesByYaml', {
        values,
        properties,
      })
      .then(({ data }) => {
        if (data) {
          form.setFieldsValue(data)
        }
      })
    // const normalizedValues = renameBrokenFieldBackToFormAgain(values)
    // const normalizedValuesWithQuotas = normalizeValuesForQuotasToNumber(normalizedValues, properties)
    // if (normalizedValues) {
    //   form.setFieldsValue(normalizedValuesWithQuotas)
    // }
  }

  useEffect(() => {
    const prefillType = type === 'apis' ? `${apiGroupApiVersion}/${typeName}` : `v1/${typeName}`
    const specificCustomprefills = formsPrefillsData?.items.find(
      item =>
        typeof item === 'object' &&
        !Array.isArray(item) &&
        item !== null &&
        item.spec &&
        typeof item.spec === 'object' &&
        !Array.isArray(item.spec) &&
        item.spec !== null &&
        typeof item.spec.overrideType === 'string' &&
        item.spec.overrideType === prefillType,
    )
    if (isFormPrefill(specificCustomprefills)) {
      specificCustomprefills.spec.values.forEach(({ path, value }) => {
        form.setFieldValue(path, value)
      })
    }
    if (prefillValuesSchema) {
      const quotasPrefillValuesSchema = normalizeValuesForQuotasToNumber(prefillValuesSchema, properties)
      form.setFieldsValue(quotasPrefillValuesSchema)
    }
    onValuesChangeCallback()
  }, [
    prefillValuesSchema,
    form,
    formsPrefillsData,
    type,
    apiGroupApiVersion,
    typeName,
    onValuesChangeCallback,
    properties,
  ])

  useEffect(() => {
    let allPaths: (string | number)[][] = []
    const prefillType = type === 'apis' ? `${apiGroupApiVersion}/${typeName}` : `v1/${typeName}`
    const specificCustomprefills = formsPrefillsData?.items.find(
      item =>
        typeof item === 'object' &&
        !Array.isArray(item) &&
        item !== null &&
        item.spec &&
        typeof item.spec === 'object' &&
        !Array.isArray(item.spec) &&
        item.spec !== null &&
        typeof item.spec.overrideType === 'string' &&
        item.spec.overrideType === prefillType,
    )
    if (isFormPrefill(specificCustomprefills)) {
      allPaths = specificCustomprefills.spec.values.flatMap(({ path }) => getPrefixSubarrays(path))
    }
    if (prefillValuesSchema) {
      if (typeof prefillValuesSchema === 'object' && prefillValuesSchema !== null) {
        allPaths = [...allPaths, ...getAllPathsFromObj(prefillValuesSchema)]
      }
    }
    const possibleNewKeys = [...expandedKeys, ...allPaths]
    const seen = new Set<TFormName>()
    const uniqueKeys = possibleNewKeys.filter(item => {
      const key = Array.isArray(item) ? JSON.stringify(item) : item
      if (seen.has(key as TFormName)) {
        return false
      }
      seen.add(key as TFormName)
      return true
    })
    setExpandedKeys([...uniqueKeys])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiGroupApiVersion, formsPrefillsData, prefillValuesSchema, type, typeName])

  useEffect(() => {
    if (prefillValueNamespaceOnly) {
      form.setFieldValue(['metadata', 'namespace'], prefillValueNamespaceOnly)
    }
    onValuesChangeCallback()
  }, [prefillValueNamespaceOnly, onValuesChangeCallback, form])

  useEffect(() => {
    if (isCreate) {
      form.setFieldsValue({ apiVersion: apiGroupApiVersion === 'api/v1' ? 'v1' : apiGroupApiVersion, kind: kindName })
    }
    onValuesChangeCallback()
  }, [isCreate, kindName, apiGroupApiVersion, onValuesChangeCallback, form])

  useEffect(() => {
    const values = form.getFieldsValue()
    const cleanSchema = removeEmptyFormValues(values, persistedKeys)
    const fixedCleanSchema = renameBrokenFieldBack(cleanSchema)
    const quotasFixedCleanSchema = normalizeValuesForQuotas(fixedCleanSchema, properties)
    const body = quotasFixedCleanSchema
    debouncedSetYamlValues(body)
  }, [debouncedSetYamlValues, properties, form, persistedKeys])

  useEffect(() => {
    onValuesChangeCallback()
  }, [properties, onValuesChangeCallback])

  if (!properties) {
    return null
  }

  const namespaceData = isNameSpaced
    ? {
        filterSelectOptions,
        selectValues: isNameSpaced.map(name => ({
          label: name,
          value: name,
        })),
        disabled: !!prefillValueNamespaceOnly,
      }
    : undefined

  const makeValueUndefined = (path: TFormName) => {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    form.setFieldValue(path as any, undefined)
    onValuesChangeCallback()
  }

  const addField = ({
    path,
    name,
    type,
    items,
    nestedProperties,
    required,
  }: {
    path: TFormName
    name: string
    type: string
    items?: { type: string }
    nestedProperties?: OpenAPIV2.SchemaObject['properties']
    required?: string
  }) => {
    const arrPath = Array.isArray(path) ? path : [path]
    const newObject = arrPath.reduceRight<Record<string, unknown>>(
      (acc, key) => {
        return { [key]: { properties: acc } } // Create a new object with the current key and the accumulator as its value
      },
      { [name]: { type, items, properties: nestedProperties, required, isAdditionalProperties: true } },
    )
    const oldProperties = _.cloneDeep(properties)
    const newProperties = _.merge(oldProperties, newObject)
    console.log('newObject', newObject)
    console.log('newProperties', newProperties)
    setProperties(newProperties)
  }

  const removeField = ({ path }: { path: TFormName }) => {
    const arrPath = Array.isArray(path) ? path : [path]
    const pathWithProperties = arrPath.flatMap(el => [el, 'properties']).slice(0, -1)
    const modifiedProperties = _.cloneDeep(properties)
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const result = _.unset(modifiedProperties, pathWithProperties)
    setProperties(modifiedProperties)
  }

  const onExpandOpen = (value: TFormName) => {
    setExpandedKeys([...expandedKeys, value])
  }

  const onExpandClose = (value: TFormName) => {
    setExpandedKeys([...expandedKeys.filter(arr => JSON.stringify(arr) !== JSON.stringify(value))])
  }

  const onPersistMark = (value: TFormName, type?: 'str' | 'number' | 'arr' | 'obj') => {
    if (type) {
      const currentValue = form.getFieldValue(value)
      if (currentValue === undefined) {
        if (type === 'str') {
          form.setFieldValue(value, '')
        }
        if (type === 'number') {
          form.setFieldValue(value, 0)
        }
        if (type === 'arr') {
          form.setFieldValue(value, [])
        }
        if (type === 'obj') {
          form.setFieldValue(value, {})
        }
      }
    }
    setPersistedKeys([...persistedKeys, value])
  }

  const onPersistUnmark = (value: TFormName) => {
    console.log(value)
    setPersistedKeys([...persistedKeys.filter(arr => JSON.stringify(arr) !== JSON.stringify(value))])
  }

  return (
    <>
      <Styled.Container $designNewLayout={designNewLayout} $designNewLayoutHeight={designNewLayoutHeight}>
        <Styled.OverflowContainer ref={overflowRef}>
          <Form form={form} onValuesChange={onValuesChangeCallback}>
            <DesignNewLayoutProvider value={designNewLayout}>
              {getObjectFormItemsDraft({
                properties,
                name: [],
                required,
                hiddenPaths,
                namespaceData,
                makeValueUndefined,
                addField,
                removeField,
                isEdit: !isCreate,
                expandedControls: { onExpandOpen, onExpandClose, expandedKeys },
                persistedControls: { onPersistMark, onPersistUnmark, persistedKeys, isPersistedKeysShown },
                urlParams,
              })}
            </DesignNewLayoutProvider>
            {/* <div>
              Show persisted checkboxes:{' '}
              <Switch
                value={isPersistedKeysShown}
                onChange={checked => setIsPersistedKeysShown(checked)}
                size="small"
              />
            </div> */}
            {!designNewLayout && (
              <>
                <Spacer $space={10} $samespace />
                <Alert
                  type="warning"
                  message="Only the data from the form will be sent. Empty fields will be removed recursively."
                />
              </>
            )}
            {isCreate && createPermission.data?.status.allowed === false && (
              <>
                <Spacer $space={10} $samespace />
                <Alert type="warning" message="Insufficient rights to create" />
              </>
            )}
            {!isCreate && updatePermission.data?.status.allowed === false && (
              <>
                <Spacer $space={10} $samespace />
                <Alert type="warning" message="Insufficient rights to edit" />
              </>
            )}
            {error && (
              <>
                <Spacer $space={10} $samespace />
                <Alert message={`An error has occurred: ${error?.response?.data?.message} `} type="error" />
              </>
            )}
          </Form>
        </Styled.OverflowContainer>
        <div>
          <YamlEditor theme={theme} currentValues={yamlValues || {}} onChange={onYamlChangeCallback} />
        </div>
      </Styled.Container>
      <Styled.ControlsRowContainer $bgColor={token.colorPrimaryBg} $designNewLayout={designNewLayout}>
        <Flex gap={designNewLayout ? 10 : 16} align="center">
          <Button type="primary" onClick={onSubmit} loading={isLoading}>
            Submit
          </Button>
          {backlink && <Button onClick={() => navigate(backlink)}>Cancel</Button>}
          <Button onClick={() => setIsDebugModalOpen(true)} icon={<BugOutlined />} />
          {designNewLayout && (
            <div>
              <Typography.Text>
                Only the data from the form will be sent. Empty fields will be removed recursively.
              </Typography.Text>
            </div>
          )}
        </Flex>
      </Styled.ControlsRowContainer>
      {isDebugModalOpen && (
        <Modal
          open={isDebugModalOpen}
          onOk={() => setIsDebugModalOpen(false)}
          onCancel={() => setIsDebugModalOpen(false)}
          onClose={() => setIsDebugModalOpen(false)}
          title="Debug for properties"
          width="90vw"
        >
          <Styled.DebugContainer $designNewLayoutHeight={designNewLayoutHeight}>
            <Suspense fallback={<div>Loading...</div>}>
              <Editor
                defaultLanguage="json"
                width="100%"
                height={designNewLayoutHeight || '75vh'}
                theme="vs-dark"
                value={JSON.stringify(properties, null, 2)}
                options={{
                  theme: 'vs-dark',
                  minimap: { enabled: false },
                }}
              />
            </Suspense>
          </Styled.DebugContainer>
        </Modal>
      )}
    </>
  )
}
