/* eslint-disable max-lines-per-function */
import React, { FC, useState, useEffect } from 'react'
import { theme as antdtheme, Form, Select, SelectProps, Button, Checkbox, Flex } from 'antd'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import { BaseOptionType } from 'antd/es/select'
import { useLocation, useSearchParams } from 'react-router-dom'
import { getKinds } from 'api/bff/search/getKinds'
import { getSortedKinds } from 'utils/getSortedKinds'
import { TKindIndex } from 'localTypes/bff/search'
import { TKindWithVersion } from 'localTypes/search'
import { filterSelectOptions } from 'utils/filterSelectOptions'
import { hslFromString } from 'utils/hslFromString'
import { getUppercase } from 'utils/getUppercase'
import { useDebouncedCallback, getArrayParam, setArrayParam, getStringParam, setStringParam, kindByGvr } from './utils'
import { Styled } from './styled'

type TSearchProps = {
  cluster: string
  theme: 'light' | 'dark'
  updateCurrentSearch: ({
    resources,
    name,
    labels,
    fields,
  }: {
    resources?: string[]
    name?: string
    labels?: string[]
    fields?: string[]
  }) => void
}

export const Search: FC<TSearchProps> = ({ cluster, theme, updateCurrentSearch }) => {
  const [form] = Form.useForm()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const { token } = antdtheme.useToken()

  const FIELD_NAME = 'kinds'
  const FIELD_NAME_STRING = 'name'
  const FIELD_NAME_LABELS = 'labels'
  const FIELD_NAME_FIELDS = 'fields'

  const TYPE_SELECTOR = 'TYPE_SELECTOR'

  const QUERY_KEY = 'kinds' // the query param name
  const NAME_QUERY_KEY = 'name'
  const LABELS_QUERY_KEY = 'labels'
  const FIELDS_QUERY_KEY = 'fields'

  const watchedKinds = Form.useWatch<string[] | undefined>(FIELD_NAME, form)
  const watchedName = Form.useWatch<string | undefined>(FIELD_NAME_STRING, form)
  const watchedLabels = Form.useWatch<string[] | undefined>(FIELD_NAME_LABELS, form)
  const watchedFields = Form.useWatch<string[] | undefined>(FIELD_NAME_FIELDS, form)
  const watchedTypedSelector = Form.useWatch<string | undefined>(TYPE_SELECTOR, form)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [kindIndex, setKindIndex] = useState<TKindIndex>()
  const [kindWithVersion, setKindWithVersion] = useState<TKindWithVersion[]>()

  useEffect(() => {
    getKinds({
      clusterName: cluster,
    }).then(data => {
      setKindIndex(data)
      setKindWithVersion(getSortedKinds(data))
    })
  }, [cluster])

  // Apply current values from search params on mount / when URL changes
  useEffect(() => {
    const fromKinds = getArrayParam(searchParams, QUERY_KEY)
    const currentKinds = form.getFieldValue(FIELD_NAME)
    const kindsDiffer =
      (fromKinds.length || 0) !== (currentKinds?.length || 0) || fromKinds.some((v, i) => v !== currentKinds?.[i])

    // name
    const fromName = getStringParam(searchParams, NAME_QUERY_KEY)
    const currentName = form.getFieldValue(FIELD_NAME_STRING) as string | undefined
    const nameDiffer = (fromName || '') !== (currentName || '')

    // labels
    const fromLabels = getArrayParam(searchParams, LABELS_QUERY_KEY)
    const currentLabels = form.getFieldValue(FIELD_NAME_LABELS) as string[] | undefined
    const labelsDiffer =
      (fromLabels.length || 0) !== (currentLabels?.length || 0) || fromLabels.some((v, i) => v !== currentLabels?.[i])

    // labels
    const fromFields = getArrayParam(searchParams, FIELDS_QUERY_KEY)
    const currentFields = form.getFieldValue(FIELD_NAME_FIELDS) as string[] | undefined
    const fieldsDiffer =
      (fromFields.length || 0) !== (currentFields?.length || 0) || fromFields.some((v, i) => v !== currentFields?.[i])

    // decide type from params
    const currentType = form.getFieldValue(TYPE_SELECTOR)
    let inferredType: string | undefined
    if (fromName) {
      inferredType = 'name'
    } else if (fromLabels.length > 0) {
      inferredType = 'labels'
    } else if (fromFields.length > 0) {
      inferredType = 'fields'
    }
    const typeDiffer = inferredType !== currentType

    // Only update the form if URL differs from form (prevents loops)
    if (kindsDiffer || nameDiffer || labelsDiffer || fieldsDiffer) {
      form.setFieldsValue({
        [FIELD_NAME]: kindsDiffer ? fromKinds : currentKinds,
        [FIELD_NAME_STRING]: nameDiffer ? fromName : currentName,
        [FIELD_NAME_LABELS]: labelsDiffer ? fromLabels : currentLabels,
        [FIELD_NAME_FIELDS]: fieldsDiffer ? fromFields : currentFields,
        [TYPE_SELECTOR]: typeDiffer ? inferredType : currentType,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]) // react to back/forward, external URL edits

  // Watch field changes to push to URL (debounced)
  const debouncedPush = useDebouncedCallback((values: string[]) => {
    const next = setArrayParam(searchParams, QUERY_KEY, values)
    setSearchParams(next, { replace: true }) // replace to keep history cleaner
  }, 250)

  const debouncedPushName = useDebouncedCallback((value: string) => {
    const next = setStringParam(searchParams, NAME_QUERY_KEY, value)
    setSearchParams(next, { replace: true })
  }, 250)

  const debouncedPushLabels = useDebouncedCallback((values: string[]) => {
    const next = setArrayParam(searchParams, LABELS_QUERY_KEY, values)
    setSearchParams(next, { replace: true })
  }, 250)

  const debouncedPushFields = useDebouncedCallback((values: string[]) => {
    const next = setArrayParam(searchParams, FIELDS_QUERY_KEY, values)
    setSearchParams(next, { replace: true })
  }, 250)

  useEffect(() => {
    debouncedPush(watchedKinds || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedKinds])

  useEffect(() => {
    debouncedPushName((watchedName || '').trim())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedName])

  useEffect(() => {
    debouncedPushLabels(watchedLabels || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedLabels])

  useEffect(() => {
    debouncedPushFields(watchedFields || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedFields])

  useEffect(() => {
    if (watchedTypedSelector === 'name') {
      // Clear labels when switching to "name"
      // const cur = form.getFieldValue(FIELD_NAME_LABELS) as string[] | undefined
      // if (cur?.length) {
      form.setFieldsValue({ [FIELD_NAME_LABELS]: [], [FIELD_NAME_FIELDS]: [] })
      // }
    } else if (watchedTypedSelector === 'labels') {
      // Clear name when switching to "labels"
      // const cur = (form.getFieldValue(FIELD_NAME_STRING) as string | undefined) ?? ''
      // if (cur) {
      form.setFieldsValue({ [FIELD_NAME_STRING]: '', [FIELD_NAME_FIELDS]: [] })
      // }
    } else if (watchedTypedSelector === 'fields') {
      // Clear name when switching to "labels"
      // const cur = (form.getFieldValue(FIELD_NAME_STRING) as string | undefined) ?? ''
      // if (cur) {
      form.setFieldsValue({ [FIELD_NAME_STRING]: '', [FIELD_NAME_LABELS]: [] })
      // }
    }
    // Optional: if undefined (e.g., initial), choose a default behavior:
    // else { form.setFieldsValue({ [FIELD_NAME_STRING]: '', [FIELD_NAME_MULTIPLE]: [] }) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedTypedSelector])

  const options: SelectProps['options'] =
    kindWithVersion?.map(({ kind, group, version }) => {
      const abbr = getUppercase(kind)
      const bgColor = kind && kind.length ? hslFromString(abbr, theme) : ''
      return {
        // kindWithVersion?.map(({ kind, notUnique, group, version }) => ({
        // label: notUnique ? (
        //   <div>
        //     {kind}
        //     <br />
        //     {version.groupVersion}
        //   </div>
        // ) : (
        //   kind
        // ),
        label: (
          <div>
            {bgColor.length && <Styled.Abbr $bgColor={bgColor}>{abbr}</Styled.Abbr>}
            {kind}
            <br />
            {version.groupVersion}
          </div>
        ),
        value: `${group}~${version.version}~${version.resource}`,
      }
    }) || []

  const tagRender = ({ label, closable, onClose }: CustomTagProps) => (
    <Styled.SelectTag
      onMouseDown={e => {
        // prevent the Select from toggling open when clicking the tag
        e.preventDefault()
        e.stopPropagation()
      }}
      closable={closable}
      onClose={onClose}
    >
      <Styled.SelectTagSpan>{label}</Styled.SelectTagSpan>
    </Styled.SelectTag>
  )

  const maxTagPlaceholder = () => (
    <div>
      Kinds{' '}
      <Styled.MaxTagPlacheolderLength $colorBorder={token.colorBorder}>
        {watchedKinds?.length ? watchedKinds.length : '0'}
      </Styled.MaxTagPlacheolderLength>
    </div>
  )

  const maxTagTagRender = ({ label }: CustomTagProps) => <Styled.MaxTagPlacheolder>{label}</Styled.MaxTagPlacheolder>

  const getKindByGvr = kindByGvr(kindWithVersion || [])

  const removeKind = (value: string) => {
    const cur: string[] = form.getFieldValue(FIELD_NAME) || []
    form.setFieldsValue({ [FIELD_NAME]: cur.filter(v => v !== value) })
  }

  const clearName = () => {
    form.setFieldsValue({ [FIELD_NAME_STRING]: '' })
  }

  const removeLabel = (label: string) => {
    const cur: string[] = form.getFieldValue(FIELD_NAME_LABELS) || []
    form.setFieldsValue({ [FIELD_NAME_LABELS]: cur.filter(v => v !== label) })
  }

  const removeField = (field: string) => {
    const cur: string[] = form.getFieldValue(FIELD_NAME_FIELDS) || []
    form.setFieldsValue({ [FIELD_NAME_FIELDS]: cur.filter(v => v !== field) })
  }

  const kindOptionRender = (option: BaseOptionType) => {
    const selectedList: string[] = form.getFieldValue(FIELD_NAME) || []
    const checked = selectedList.includes(option.value as string)

    return (
      <Flex gap={8}>
        <Checkbox checked={checked} />
        <div>{option.label as React.ReactNode}</div>
      </Flex>
    )
  }

  return (
    <Styled.BackgroundContainer $colorBorder={token.colorBorder} $colorBgLayout={token.colorBgLayout}>
      <Form form={form} layout="vertical">
        <Styled.FormContainer>
          <Styled.ResetedFormItem name={FIELD_NAME}>
            <Select
              mode="multiple"
              placeholder="Select"
              options={options}
              filterOption={(input, option) =>
                (option?.value || '').toString().toLowerCase().includes(input.toLowerCase())
              }
              allowClear
              showSearch
              // tagRender={tagRender}
              // maxTagCount="responsive"
              maxTagCount={0}
              maxTagPlaceholder={maxTagPlaceholder}
              tagRender={maxTagTagRender}
              // Render each option row with a checkbox that reflects selection
              menuItemSelectedIcon={null}
              optionRender={kindOptionRender}
            />
          </Styled.ResetedFormItem>
          <Styled.CompoundItem>
            <Styled.ResetedFormItem name={TYPE_SELECTOR}>
              <Styled.LeftSideSelect
                placeholder="Select"
                options={[
                  { label: 'Name', value: 'name' },
                  { label: 'Labels', value: 'labels' },
                  { label: 'Fields', value: 'fields' },
                ]}
                defaultValue="name"
                filterOption={filterSelectOptions}
                showSearch
              />
            </Styled.ResetedFormItem>
            <Styled.HideableContainer
              $isHidden={watchedTypedSelector === 'labels' || watchedTypedSelector === 'fields'}
            >
              <Styled.ResetedFormItem name={FIELD_NAME_STRING}>
                <Styled.RightSideInput allowClear placeholder="Name" />
              </Styled.ResetedFormItem>
            </Styled.HideableContainer>
            <Styled.HideableContainer
              $isHidden={
                watchedTypedSelector === 'name' ||
                watchedTypedSelector === 'fields' ||
                watchedTypedSelector === undefined
              }
            >
              <Styled.ResetedFormItem
                name={FIELD_NAME_LABELS}
                validateTrigger="onBlur"
                rules={[
                  () => ({
                    validator(_, value) {
                      if (
                        Array.isArray(value) &&
                        value.every(str => typeof str === 'string' && str.includes('=') && !str.startsWith('='))
                      ) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('Please enter key=value style'))
                    },
                  }),
                ]}
              >
                <Styled.RightSideSelect
                  mode="tags"
                  allowClear
                  placeholder="Key=Value"
                  // dropdownStyle={{ display: 'none' }}
                  tokenSeparators={[',', ' ', '	']}
                  suffixIcon={null}
                  filterOption={filterSelectOptions}
                  tagRender={tagRender}
                />
              </Styled.ResetedFormItem>
            </Styled.HideableContainer>
            <Styled.HideableContainer
              $isHidden={
                watchedTypedSelector === 'name' ||
                watchedTypedSelector === 'labels' ||
                watchedTypedSelector === undefined
              }
            >
              <Styled.ResetedFormItem
                name={FIELD_NAME_FIELDS}
                validateTrigger="onBlur"
                rules={[
                  () => ({
                    validator(_, value) {
                      if (
                        Array.isArray(value) &&
                        value.every(str => typeof str === 'string' && str.includes('=') && !str.startsWith('='))
                      ) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('Please enter key=value style'))
                    },
                  }),
                ]}
              >
                <Styled.RightSideSelect
                  mode="tags"
                  allowClear
                  placeholder="Key=Value"
                  // dropdownStyle={{ display: 'none' }}
                  tokenSeparators={[',', ' ', '	']}
                  suffixIcon={null}
                  filterOption={filterSelectOptions}
                  tagRender={tagRender}
                />
              </Styled.ResetedFormItem>
            </Styled.HideableContainer>
          </Styled.CompoundItem>
          <Styled.ResetedFormItem>
            <Button
              type="primary"
              onClick={() =>
                updateCurrentSearch({
                  resources: watchedKinds,
                  name: watchedName,
                  labels: watchedLabels,
                  fields: watchedFields,
                })
              }
              disabled={!watchedKinds || watchedKinds.length < 1}
            >
              Search
            </Button>
          </Styled.ResetedFormItem>
        </Styled.FormContainer>
      </Form>
      <Styled.BottomTagsHolder>
        {watchedKinds &&
          watchedKinds.map(fullKindName => {
            const kind = getKindByGvr(fullKindName)
            const abbr = getUppercase(kind && kind.length ? kind : 'Loading')
            const bgColor = kind && kind.length ? hslFromString(abbr, theme) : ''
            return (
              <Styled.CustomTag
                key={fullKindName}
                onClose={e => {
                  e.preventDefault()
                  removeKind(fullKindName)
                }}
                closable
              >
                {kind && kind.length && bgColor.length && <Styled.Abbr $bgColor={bgColor}>{abbr}</Styled.Abbr>}
                {kind}
              </Styled.CustomTag>
            )
          })}
        {watchedName && (
          <Styled.CustomTag
            onClose={e => {
              e.preventDefault()
              clearName()
            }}
            closable
          >
            {watchedName}
          </Styled.CustomTag>
        )}
        {watchedLabels &&
          watchedLabels.map(label => (
            <Styled.CustomTag
              key={label}
              onClose={e => {
                e.preventDefault()
                removeLabel(label)
              }}
              closable
            >
              {label}
            </Styled.CustomTag>
          ))}
        {watchedFields &&
          watchedFields.map(field => (
            <Styled.CustomTag
              key={field}
              onClose={e => {
                e.preventDefault()
                removeField(field)
              }}
              closable
            >
              {field}
            </Styled.CustomTag>
          ))}
      </Styled.BottomTagsHolder>
      {(watchedKinds && watchedKinds.length) ||
      (watchedName && watchedName.length) ||
      (watchedLabels && watchedLabels.length) ||
      (watchedFields && watchedFields.length) ? (
        <Styled.ClearButtonHolder>
          <Button
            type="primary"
            onClick={() => {
              form.setFieldsValue({
                [FIELD_NAME]: [],
                [FIELD_NAME_STRING]: '',
                [FIELD_NAME_LABELS]: [],
                [FIELD_NAME_FIELDS]: [],
                [TYPE_SELECTOR]: 'name', // reset selector to default
              })
            }}
          >
            Clear
          </Button>
        </Styled.ClearButtonHolder>
      ) : undefined}
    </Styled.BackgroundContainer>
  )
}
