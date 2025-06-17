/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
import { Form, Button, Typography, Alert, Tooltip } from 'antd'
import { MinusCircleOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { OpenAPIV2 } from 'openapi-types'
import { includesArray } from 'utils/nestedStringsArrayInclude'
import { getStringByName } from 'utils/getStringByName'
import { TListInputCustomProps, TRangeInputCustomProps } from 'localTypes/formExtensions'
import { TFormName, TExpandedControls, TNamespaceData, TPersistedControls, TUrlParams } from 'localTypes/form'
import { CursorPointerText, PersistedCheckbox, PossibleHiddenContainer } from '../../atoms'
import {
  FormNamespaceInput,
  FormStringInput,
  FormEnumStringInput,
  FormNumberInput,
  FormRangeInput,
  FormListInput,
  FormBooleanInput,
  FormObjectFromSwagger,
} from '../../molecules'
import { Styled } from './styled'

export const getStringFormItemFromSwagger = ({
  name,
  arrKey,
  arrName,
  persistName,
  required,
  forceNonRequired,
  isHidden,
  description,
  namespaceData,
  isAdditionalProperties,
  removeField,
  persistedControls,
}: {
  name: TFormName
  arrKey?: number
  arrName?: TFormName
  persistName?: TFormName
  required?: string[]
  forceNonRequired?: boolean
  isHidden?: boolean
  description?: string
  namespaceData?: TNamespaceData
  isAdditionalProperties?: boolean
  removeField: ({ path }: { path: TFormName }) => void
  persistedControls: TPersistedControls
}) => {
  if (Array.isArray(name) && name.length === 2 && name[0] === 'metadata' && name[1] === 'namespace' && namespaceData) {
    return (
      <FormNamespaceInput
        name={name}
        isHidden={isHidden}
        namespaceData={namespaceData}
        isAdditionalProperties={isAdditionalProperties}
        removeField={removeField}
      />
    )
  }

  return (
    <FormStringInput
      name={name}
      arrKey={arrKey}
      arrName={arrName}
      persistName={persistName}
      required={required}
      forceNonRequired={forceNonRequired}
      isHidden={isHidden}
      description={description}
      isAdditionalProperties={isAdditionalProperties}
      removeField={removeField}
      persistedControls={persistedControls}
    />
  )
}

export const getEnumStringFormItemFromSwagger = ({
  name,
  arrKey,
  arrName,
  persistName,
  required,
  forceNonRequired,
  isHidden,
  description,
  isAdditionalProperties,
  removeField,
  options,
  persistedControls,
}: {
  name: TFormName
  arrKey?: number
  arrName?: TFormName
  persistName?: TFormName
  required?: string[]
  forceNonRequired?: boolean
  isHidden?: boolean
  description?: string
  isAdditionalProperties?: boolean
  removeField: ({ path }: { path: TFormName }) => void
  options: string[]
  persistedControls: TPersistedControls
}) => {
  return (
    <FormEnumStringInput
      name={name}
      arrKey={arrKey}
      arrName={arrName}
      persistName={persistName}
      required={required}
      forceNonRequired={forceNonRequired}
      isHidden={isHidden}
      description={description}
      isAdditionalProperties={isAdditionalProperties}
      removeField={removeField}
      options={options}
      persistedControls={persistedControls}
    />
  )
}

export const getNumberFormItemFromSwagger = ({
  isNumber,
  name,
  arrKey,
  arrName,
  persistName,
  required,
  forceNonRequired,
  isHidden,
  description,
  isAdditionalProperties,
  removeField,
  persistedControls,
}: {
  isNumber?: boolean
  name: TFormName
  arrKey?: number
  arrName?: TFormName
  persistName?: TFormName
  required?: string[]
  forceNonRequired?: boolean
  isHidden?: boolean
  description?: string
  isAdditionalProperties?: boolean
  removeField: ({ path }: { path: TFormName }) => void
  persistedControls: TPersistedControls
}) => {
  return (
    <FormNumberInput
      isNumber={isNumber}
      name={name}
      arrKey={arrKey}
      arrName={arrName}
      persistName={persistName}
      required={required}
      forceNonRequired={forceNonRequired}
      isHidden={isHidden}
      description={description}
      isAdditionalProperties={isAdditionalProperties}
      removeField={removeField}
      persistedControls={persistedControls}
    />
  )
}

export const getRangeInputFormItemFromSwagger = ({
  name,
  arrKey,
  arrName,
  persistName,
  required,
  forceNonRequired,
  isHidden,
  description,
  isEdit,
  persistedControls,
  customProps,
  urlParams,
}: {
  name: TFormName
  arrKey?: number
  arrName?: TFormName
  persistName?: TFormName
  required?: string[]
  forceNonRequired?: boolean
  isHidden?: boolean
  description?: string
  isEdit: boolean
  persistedControls: TPersistedControls
  customProps: TRangeInputCustomProps
  urlParams: TUrlParams
}) => {
  return (
    <FormRangeInput
      name={name}
      arrKey={arrKey}
      arrName={arrName}
      persistName={persistName}
      required={required}
      forceNonRequired={forceNonRequired}
      isHidden={isHidden}
      description={description}
      isEdit={isEdit}
      customProps={customProps}
      persistedControls={persistedControls}
      urlParams={urlParams}
    />
  )
}

export const getListInputFormItemFromSwagger = ({
  name,
  arrKey,
  arrName,
  persistName,
  required,
  forceNonRequired,
  isHidden,
  description,
  isAdditionalProperties,
  removeField,
  persistedControls,
  customProps,
  urlParams,
}: {
  name: TFormName
  arrKey?: number
  arrName?: TFormName
  persistName?: TFormName
  required?: string[]
  forceNonRequired?: boolean
  isHidden?: boolean
  description?: string
  isAdditionalProperties?: boolean
  removeField: ({ path }: { path: TFormName }) => void
  persistedControls: TPersistedControls
  customProps: TListInputCustomProps
  urlParams: TUrlParams
}) => {
  return (
    <FormListInput
      name={name}
      arrKey={arrKey}
      arrName={arrName}
      persistName={persistName}
      required={required}
      forceNonRequired={forceNonRequired}
      isHidden={isHidden}
      description={description}
      isAdditionalProperties={isAdditionalProperties}
      removeField={removeField}
      persistedControls={persistedControls}
      customProps={customProps}
      urlParams={urlParams}
    />
  )
}

export const getBooleanFormItemFromSwagger = ({
  name,
  arrKey,
  arrName,
  isHidden,
  description,
  makeValueUndefined,
  isAdditionalProperties,
  removeField,
}: {
  name: TFormName
  arrKey?: number
  arrName?: TFormName
  isHidden?: boolean
  description?: string
  makeValueUndefined?: (path: TFormName) => void
  isAdditionalProperties?: boolean
  removeField: ({ path }: { path: TFormName }) => void
}) => {
  return (
    <FormBooleanInput
      name={name}
      arrKey={arrKey}
      arrName={arrName}
      isHidden={isHidden}
      description={description}
      makeValueUndefined={makeValueUndefined}
      isAdditionalProperties={isAdditionalProperties}
      removeField={removeField}
    />
  )
}

export const getArrayFormItemFromSwagger = ({
  schema,
  name,
  arrKey,
  arrName,
  expandName,
  persistName,
  required,
  forceNonRequired,
  isHidden,
  description,
  makeValueUndefined,
  addField,
  isAdditionalProperties,
  removeField,
  isEdit,
  expandedControls,
  persistedControls,
  urlParams,
}: {
  schema: OpenAPIV2.SchemaObject
  name: TFormName
  arrKey?: number
  arrName?: TFormName
  expandName?: TFormName
  persistName?: TFormName
  required?: string[]
  forceNonRequired?: boolean
  isHidden?: boolean
  description?: string
  makeValueUndefined?: (path: TFormName) => void
  addField: ({
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
  }) => void
  isAdditionalProperties?: boolean
  removeField: ({ path }: { path: TFormName }) => void
  isEdit: boolean
  expandedControls: TExpandedControls
  persistedControls: TPersistedControls
  urlParams: TUrlParams
}) => {
  // typescript as below are needed because of dereference procedure
  if (schema.type === 'array') {
    return (
      <PossibleHiddenContainer $isHidden={isHidden}>
        <Typography.Text>
          {getStringByName(name)}
          {required?.includes(getStringByName(name)) && <Typography.Text type="danger">*</Typography.Text>}
          {description && (
            <Tooltip title={description}>
              {' '}
              <QuestionCircleOutlined />
            </Tooltip>
          )}
          {isAdditionalProperties && (
            <CursorPointerText type="secondary" onClick={() => removeField({ path: name })}>
              Удалить
            </CursorPointerText>
          )}
          <PersistedCheckbox formName={persistName || name} persistedControls={persistedControls} type="arr" />
        </Typography.Text>
        <Styled.ResetedFormList
          key={arrKey !== undefined ? arrKey : Array.isArray(name) ? name.slice(-1)[0] : name}
          name={arrName || name}
          rules={
            !forceNonRequired && required?.includes(getStringByName(name))
              ? [
                  {
                    validator: async (_, value) => {
                      if (!value || value.length < 1) {
                        return Promise.reject(new Error('Field is required'))
                      }
                    },
                  },
                ]
              : undefined
          }
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map(field => {
                const fieldType = (
                  schema.items as (OpenAPIV2.ItemsObject & { properties?: OpenAPIV2.SchemaObject }) | undefined
                )?.type
                const description = (schema.items as (OpenAPIV2.ItemsObject & { description?: string }) | undefined)
                  ?.description
                const entry = schema.items as
                  | (OpenAPIV2.ItemsObject & { properties?: OpenAPIV2.SchemaObject; required?: string[] })
                  | undefined
                return (
                  <Styled.ContainerWithRemoveButton key={field.key}>
                    <div>
                      {fieldType !== 'object' && (
                        <>
                          {fieldType === 'string' &&
                            getStringFormItemFromSwagger({
                              name: Array.isArray(name) ? [...name, field.name] : [name, field.name],
                              arrKey: field.key,
                              // arrName: [field.name, getStringByName(name)],
                              arrName: [field.name],
                              persistName: persistName
                                ? Array.isArray(persistName)
                                  ? [...persistName, field.name]
                                  : [persistName, field.name]
                                : Array.isArray(name)
                                ? [...name, field.name]
                                : [name, field.name],
                              description,
                              removeField,
                              persistedControls,
                            })}
                          {(fieldType === 'number' || fieldType === 'integer') &&
                            getNumberFormItemFromSwagger({
                              isNumber: fieldType === 'number',
                              name: Array.isArray(name) ? [...name, field.name] : [name, field.name],
                              arrKey: field.key,
                              // arrName: [field.name, getStringByName(name)],
                              arrName: [field.name],
                              persistName: persistName
                                ? Array.isArray(persistName)
                                  ? [...persistName, field.name]
                                  : [persistName, field.name]
                                : Array.isArray(name)
                                ? [...name, field.name]
                                : [name, field.name],
                              description,
                              removeField,
                              persistedControls,
                            })}
                          {(fieldType === 'rangeInputCpu' || fieldType === 'rangeInputMemory') &&
                            getRangeInputFormItemFromSwagger({
                              name: Array.isArray(name) ? [...name, field.name] : [name, field.name],
                              arrKey: field.key,
                              // arrName: [field.name, getStringByName(name)],
                              arrName: [field.name],
                              persistName: persistName
                                ? Array.isArray(persistName)
                                  ? [...persistName, field.name]
                                  : [persistName, field.name]
                                : Array.isArray(name)
                                ? [...name, field.name]
                                : [name, field.name],
                              description,
                              isEdit,
                              persistedControls,
                              customProps: (schema as unknown as { items: { customProps: TRangeInputCustomProps } })
                                .items.customProps,
                              urlParams,
                            })}
                          {fieldType === 'listInput' &&
                            getListInputFormItemFromSwagger({
                              name: Array.isArray(name) ? [...name, field.name] : [name, field.name],
                              arrKey: field.key,
                              // arrName: [field.name, getStringByName(name)],
                              arrName: [field.name],
                              persistName: persistName
                                ? Array.isArray(persistName)
                                  ? [...persistName, field.name]
                                  : [persistName, field.name]
                                : Array.isArray(name)
                                ? [...name, field.name]
                                : [name, field.name],
                              description,
                              removeField,
                              persistedControls,
                              customProps: (schema as unknown as { items: { customProps: TListInputCustomProps } })
                                .items.customProps,
                              urlParams,
                            })}
                          {fieldType === 'boolean' &&
                            getBooleanFormItemFromSwagger({
                              name: Array.isArray(name) ? [...name, field.name] : [name, field.name],
                              arrKey: field.key,
                              // arrName: [field.name, getStringByName(name)],
                              arrName: [field.name],
                              description,
                              makeValueUndefined,
                              removeField,
                            })}
                          {fieldType === 'array' &&
                            getArrayFormItemFromSwagger({
                              schema: schema.items as OpenAPIV2.SchemaObject,
                              name: Array.isArray(name) ? [...name, field.name] : [name, field.name],
                              arrKey: field.key,
                              arrName: [field.name],
                              expandName: expandName
                                ? Array.isArray(expandName)
                                  ? [...expandName, field.name]
                                  : [expandName, field.name]
                                : Array.isArray(name)
                                ? [...name, field.name]
                                : [name, field.name],
                              persistName: persistName
                                ? Array.isArray(persistName)
                                  ? [...persistName, field.name]
                                  : [persistName, field.name]
                                : Array.isArray(name)
                                ? [...name, field.name]
                                : [name, field.name],
                              description,
                              makeValueUndefined,
                              addField,
                              removeField,
                              isEdit,
                              expandedControls,
                              persistedControls,
                              urlParams,
                            })}
                        </>
                      )}
                      {fieldType === 'object' &&
                        entry?.properties &&
                        getObjectFormItemFromSwagger({
                          properties: entry.properties,
                          name: Array.isArray(name) ? [...name, field.name] : [name, field.name],
                          arrKey: field.key,
                          arrName: [field.name],
                          expandName: expandName
                            ? Array.isArray(expandName)
                              ? [...expandName, field.name]
                              : [expandName, field.name]
                            : Array.isArray(name)
                            ? [...name, field.name]
                            : [name, field.name],
                          persistName: persistName
                            ? Array.isArray(persistName)
                              ? [...persistName, field.name]
                              : [persistName, field.name]
                            : Array.isArray(name)
                            ? [...name, field.name]
                            : [name, field.name],
                          required: entry.required,
                          forceNonRequired,
                          description,
                          makeValueUndefined,
                          addField,
                          isAdditionalProperties,
                          removeField,
                          isEdit,
                          expandedControls,
                          persistedControls,
                          urlParams,
                        })}
                    </div>
                    <Styled.MinusContainer>
                      <MinusCircleOutlined size={14} onClick={() => remove(field.name)} />
                    </Styled.MinusContainer>
                  </Styled.ContainerWithRemoveButton>
                )
              })}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Styled.ResetedFormList>
      </PossibleHiddenContainer>
    )
  }
  return null
}

export const getObjectFormItemsDraft = ({
  properties,
  name,
  arrKey,
  arrName,
  expandName,
  persistName,
  required,
  forceNonRequired,
  isHidden,
  hiddenPaths,
  description,
  namespaceData,
  makeValueUndefined,
  addField,
  removeField,
  isEdit,
  expandedControls,
  persistedControls,
  urlParams,
}: {
  properties: {
    [name: string]: OpenAPIV2.SchemaObject
  }
  name: TFormName
  arrKey?: number
  arrName?: TFormName
  persistName?: TFormName
  expandName?: TFormName
  required?: (string | number)[]
  forceNonRequired?: boolean
  isHidden?: boolean
  hiddenPaths?: string[][]
  description?: string
  namespaceData?: TNamespaceData
  makeValueUndefined?: (path: TFormName) => void
  addField: ({
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
  }) => void
  removeField: ({ path }: { path: TFormName }) => void
  isEdit: boolean
  expandedControls: TExpandedControls
  persistedControls: TPersistedControls
  urlParams: TUrlParams
}) => {
  return (
    <PossibleHiddenContainer $isHidden={isHidden}>
      {Object.keys(properties).map((el: keyof typeof properties) => {
        if (properties[el].type === 'string' && properties[el].enum) {
          return getEnumStringFormItemFromSwagger({
            name: Array.isArray(name) ? [...name, String(el)] : [name, String(el)],
            arrKey,
            arrName: Array.isArray(arrName) ? [...arrName, String(el)] : undefined,
            persistName: persistName
              ? Array.isArray(persistName)
                ? [...persistName, String(el)]
                : [persistName, String(el)]
              : undefined,
            // required: required?.includes(getStringByName(objName)) ? [String(el)] : undefined,
            required: required?.includes(el) ? [String(el)] : undefined,
            forceNonRequired,
            isHidden: includesArray(hiddenPaths, Array.isArray(name) ? [...name, String(el)] : [name, String(el)]),
            description: properties[el].description,
            isAdditionalProperties: properties[el].isAdditionalProperties,
            removeField,
            persistedControls,
            options: properties[el].enum || [],
          })
        }
        if (
          (properties[el].type === 'string' && !properties[el].enum) ||
          Object.keys(properties[el]).includes('x-kubernetes-int-or-string')
        ) {
          return getStringFormItemFromSwagger({
            name: Array.isArray(name) ? [...name, String(el)] : [name, String(el)],
            arrKey,
            arrName: Array.isArray(arrName) ? [...arrName, String(el)] : undefined,
            persistName: persistName
              ? Array.isArray(persistName)
                ? [...persistName, String(el)]
                : [persistName, String(el)]
              : undefined,
            // required: required?.includes(getStringByName(objName)) ? [String(el)] : undefined,
            required: required?.includes(el) ? [String(el)] : undefined,
            forceNonRequired,
            isHidden: includesArray(hiddenPaths, Array.isArray(name) ? [...name, String(el)] : [name, String(el)]),
            description: properties[el].description,
            namespaceData,
            isAdditionalProperties: properties[el].isAdditionalProperties,
            removeField,
            persistedControls,
          })
        }
        if (properties[el].type === 'number' || properties[el].type === 'integer') {
          return getNumberFormItemFromSwagger({
            isNumber: properties[el].type === 'number',
            name: Array.isArray(name) ? [...name, String(el)] : [name, String(el)],
            arrKey,
            arrName: Array.isArray(arrName) ? [...arrName, String(el)] : undefined,
            persistName: persistName
              ? Array.isArray(persistName)
                ? [...persistName, String(el)]
                : [persistName, String(el)]
              : undefined,
            // required: required?.includes(getStringByName(objName)) ? [String(el)] : undefined,
            required: required?.includes(el) ? [String(el)] : undefined,
            forceNonRequired,
            isHidden: includesArray(hiddenPaths, Array.isArray(name) ? [...name, String(el)] : [name, String(el)]),
            description: properties[el].description,
            isAdditionalProperties: properties[el].isAdditionalProperties,
            removeField,
            persistedControls,
          })
        }
        if (properties[el].type === 'rangeInputCpu' || properties[el].type === 'rangeInputMemory') {
          return getRangeInputFormItemFromSwagger({
            name: Array.isArray(name) ? [...name, String(el)] : [name, String(el)],
            arrKey,
            arrName: Array.isArray(arrName) ? [...arrName, String(el)] : undefined,
            persistName: persistName
              ? Array.isArray(persistName)
                ? [...persistName, String(el)]
                : [persistName, String(el)]
              : undefined,
            // required: required?.includes(getStringByName(objName)) ? [String(el)] : undefined,
            required: required?.includes(el) ? [String(el)] : undefined,
            forceNonRequired,
            isHidden: includesArray(hiddenPaths, Array.isArray(name) ? [...name, String(el)] : [name, String(el)]),
            description: properties[el].description,
            isEdit,
            customProps: properties[el].customProps,
            persistedControls,
            urlParams,
          })
        }
        if (properties[el].type === 'listInput') {
          return getListInputFormItemFromSwagger({
            name: Array.isArray(name) ? [...name, String(el)] : [name, String(el)],
            arrKey,
            arrName: Array.isArray(arrName) ? [...arrName, String(el)] : undefined,
            persistName: persistName
              ? Array.isArray(persistName)
                ? [...persistName, String(el)]
                : [persistName, String(el)]
              : undefined,
            // required: required?.includes(getStringByName(objName)) ? [String(el)] : undefined,
            required: required?.includes(el) ? [String(el)] : undefined,
            forceNonRequired,
            isHidden: includesArray(hiddenPaths, Array.isArray(name) ? [...name, String(el)] : [name, String(el)]),
            description: properties[el].description,
            customProps: properties[el].customProps,
            removeField,
            persistedControls,
            urlParams,
          })
        }
        if (properties[el].type === 'boolean') {
          return getBooleanFormItemFromSwagger({
            name: Array.isArray(name) ? [...name, String(el)] : [name, String(el)],
            arrKey,
            arrName: Array.isArray(arrName) ? [...arrName, String(el)] : undefined,
            isHidden: includesArray(hiddenPaths, Array.isArray(name) ? [...name, String(el)] : [name, String(el)]),
            description: properties[el].description,
            makeValueUndefined,
            isAdditionalProperties: properties[el].isAdditionalProperties,
            removeField,
          })
        }
        if (properties[el].type === 'array') {
          return getArrayFormItemFromSwagger({
            schema: properties[el],
            name: Array.isArray(name) ? [...name, String(el)] : [name, String(el)],
            arrKey,
            arrName: Array.isArray(arrName) ? [...arrName, String(el)] : undefined,
            expandName: expandName
              ? Array.isArray(expandName)
                ? [...expandName, String(el)]
                : [expandName, String(el)]
              : undefined,
            persistName: persistName
              ? Array.isArray(persistName)
                ? [...persistName, String(el)]
                : [persistName, String(el)]
              : undefined,
            // required: required?.includes(getStringByName(objName)) ? [String(el)] : undefined,
            required: required?.includes(el) ? [String(el)] : undefined,
            forceNonRequired,
            isHidden: includesArray(hiddenPaths, Array.isArray(name) ? [...name, String(el)] : [name, String(el)]),
            description: properties[el].description,
            makeValueUndefined,
            addField,
            isAdditionalProperties: properties[el].isAdditionalProperties,
            removeField,
            isEdit,
            expandedControls,
            persistedControls,
            urlParams,
          })
        }
        if (properties[el].additionalProperties) {
          const data = properties[el].properties
            ? getObjectFormItemsDraft({
                properties: properties[el].properties as {
                  [name: string]: OpenAPIV2.SchemaObject
                },
                name: Array.isArray(name) ? [...name, String(el)] : [name, String(el)],
                arrKey,
                arrName: Array.isArray(arrName) ? [...arrName, String(el)] : undefined,
                expandName: expandName
                  ? Array.isArray(expandName)
                    ? [...expandName, String(el)]
                    : [expandName, String(el)]
                  : undefined,
                persistName: persistName
                  ? Array.isArray(persistName)
                    ? [...persistName, String(el)]
                    : [persistName, String(el)]
                  : undefined,
                required: properties[el].required,
                forceNonRequired,
                isHidden: includesArray(hiddenPaths, Array.isArray(name) ? [...name, String(el)] : [name, String(el)]),
                hiddenPaths,
                description: properties[el].description,
                namespaceData,
                makeValueUndefined,
                addField,
                removeField,
                isEdit,
                expandedControls,
                persistedControls,
                urlParams,
              })
            : undefined
          return (
            <FormObjectFromSwagger
              name={name}
              persistName={persistName}
              isHidden={includesArray(hiddenPaths, Array.isArray(name) ? [...name, String(el)] : [name, String(el)])}
              description={description}
              removeField={removeField}
              expandedControls={expandedControls}
              persistedControls={persistedControls}
              collapseTitle={el}
              collapseFormName={Array.isArray(name) ? [...name, String(el)] : [name, String(el)]}
              data={data}
              inputProps={{
                addField,
                additionalProperties: properties[el]?.additionalProperties,
              }}
              key={Array.isArray(name) ? [...name, String(el)].join('-') : [name, String(el)].join('-')}
            />
          )
        }
        if (properties[el].type === 'object' && properties[el].properties) {
          return getObjectFormItemFromSwagger({
            properties: properties[el].properties as {
              [name: string]: OpenAPIV2.SchemaObject
            },
            name: Array.isArray(name) ? [...name, String(el)] : [name, String(el)],
            arrKey,
            arrName: Array.isArray(arrName) ? [...arrName, String(el)] : undefined,
            expandName: expandName
              ? Array.isArray(expandName)
                ? [...expandName, String(el)]
                : [expandName, String(el)]
              : undefined,
            persistName: persistName
              ? Array.isArray(persistName)
                ? [...persistName, String(el)]
                : [persistName, String(el)]
              : undefined,
            selfRequired: required?.includes(el),
            required: properties[el].required,
            forceNonRequired: forceNonRequired || !required?.includes(el),
            isHidden: includesArray(hiddenPaths, Array.isArray(name) ? [...name, String(el)] : [name, String(el)]),
            hiddenPaths,
            description: properties[el].description,
            namespaceData,
            makeValueUndefined,
            addField,
            isAdditionalProperties: properties[el].isAdditionalProperties,
            removeField,
            isEdit,
            expandedControls,
            persistedControls,
            urlParams,
          })
        }
        if (properties[el].type === 'object' && properties[el]['x-kubernetes-preserve-unknown-fields']) {
          return <Alert key={String(el)} message="x-kubernetes-preserve-unknown-fields" banner />
        }
        return null
      })}
    </PossibleHiddenContainer>
  )
}

export const getObjectFormItemFromSwagger = ({
  properties,
  name,
  arrKey,
  arrName,
  expandName,
  persistName,
  selfRequired,
  required,
  forceNonRequired,
  isHidden,
  hiddenPaths,
  description,
  namespaceData,
  makeValueUndefined,
  addField,
  isAdditionalProperties,
  removeField,
  isEdit,
  expandedControls,
  persistedControls,
  urlParams,
}: {
  properties: {
    [name: string]: OpenAPIV2.SchemaObject
  }
  name: TFormName
  arrKey?: number
  arrName?: TFormName
  expandName?: TFormName
  persistName?: TFormName
  selfRequired?: boolean
  required?: (string | number)[]
  forceNonRequired?: boolean
  isHidden?: boolean
  hiddenPaths?: string[][]
  description?: string
  namespaceData?: TNamespaceData
  makeValueUndefined?: (path: TFormName) => void
  addField: ({
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
  }) => void
  isAdditionalProperties?: boolean
  removeField: ({ path }: { path: TFormName }) => void
  isEdit: boolean
  expandedControls: TExpandedControls
  persistedControls: TPersistedControls
  urlParams: TUrlParams
}) => {
  const data = getObjectFormItemsDraft({
    properties,
    name,
    arrKey,
    arrName,
    expandName,
    persistName,
    required,
    forceNonRequired,
    isHidden,
    hiddenPaths,
    description,
    namespaceData,
    makeValueUndefined,
    addField,
    removeField,
    isEdit,
    expandedControls,
    persistedControls,
    urlParams,
  })
  return (
    <FormObjectFromSwagger
      name={name}
      persistName={persistName}
      selfRequired={selfRequired}
      isHidden={isHidden}
      description={description}
      isAdditionalProperties={isAdditionalProperties}
      removeField={removeField}
      expandedControls={expandedControls}
      persistedControls={persistedControls}
      collapseTitle={name}
      collapseFormName={expandName || name}
      data={data}
    />
  )
}
