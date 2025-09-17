/* eslint-disable max-lines-per-function */
import React, { FC, useState, useEffect } from 'react'
import { Form, Select, SelectProps, Input, Button } from 'antd'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import { useLocation, useSearchParams } from 'react-router-dom'
import { getKinds } from 'api/bff/search/getKinds'
import { getSortedKinds } from 'utils/getSortedKinds'
import { TKindIndex } from 'localTypes/bff/search'
import { TKindWithVersion } from 'localTypes/search'
import { filterSelectOptions } from 'utils/filterSelectOptions'
import { useDebouncedCallback, getArrayParam, setArrayParam, getStringParam, setStringParam } from './utils'
import { Styled } from './styled'

type TSearchProps = {
  cluster: string
  updateCurrentSearch: ({ resources, name, labels }: { resources?: string[]; name?: string; labels?: string[] }) => void
}

export const Search: FC<TSearchProps> = ({ cluster, updateCurrentSearch }) => {
  const [form] = Form.useForm()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  const FIELD_NAME = 'kinds'
  const FIELD_NAME_STRING = 'name'
  const FIELD_NAME_MULTIPLE = 'labels'

  const TYPE_SELECTOR = 'TYPE_SELECTOR'

  const QUERY_KEY = 'kinds' // the query param name
  const NAME_QUERY_KEY = 'name'
  const LABELS_QUERY_KEY = 'labels'

  const watchedKinds = Form.useWatch<string[] | undefined>(FIELD_NAME, form)
  const watchedName = Form.useWatch<string | undefined>(FIELD_NAME_STRING, form)
  const watchedMultiple = Form.useWatch<string[] | undefined>(FIELD_NAME_MULTIPLE, form)
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
    const currentLabels = form.getFieldValue(FIELD_NAME_MULTIPLE) as string[] | undefined
    const labelsDiffer =
      (fromLabels.length || 0) !== (currentLabels?.length || 0) || fromLabels.some((v, i) => v !== currentLabels?.[i])

    // decide type from params
    const currentType = form.getFieldValue(TYPE_SELECTOR)
    let inferredType: string | undefined
    if (fromName) {
      inferredType = 'name'
    } else if (fromLabels.length > 0) {
      inferredType = 'labels'
    }
    const typeDiffer = inferredType !== currentType

    // Only update the form if URL differs from form (prevents loops)
    if (kindsDiffer || nameDiffer || labelsDiffer) {
      form.setFieldsValue({
        [FIELD_NAME]: kindsDiffer ? fromKinds : currentKinds,
        [FIELD_NAME_STRING]: nameDiffer ? fromName : currentName,
        [FIELD_NAME_MULTIPLE]: labelsDiffer ? fromLabels : currentLabels,
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

  useEffect(() => {
    debouncedPush(watchedKinds || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedKinds])

  useEffect(() => {
    debouncedPushName((watchedName || '').trim())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedName])

  useEffect(() => {
    debouncedPushLabels(watchedMultiple || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedMultiple])

  useEffect(() => {
    if (watchedTypedSelector === 'name') {
      // Clear labels when switching to "name"
      const cur = form.getFieldValue(FIELD_NAME_MULTIPLE) as string[] | undefined
      if (cur?.length) {
        form.setFieldsValue({ [FIELD_NAME_MULTIPLE]: [] })
      }
    } else if (watchedTypedSelector === 'labels') {
      // Clear name when switching to "labels"
      const cur = (form.getFieldValue(FIELD_NAME_STRING) as string | undefined) ?? ''
      if (cur) {
        form.setFieldsValue({ [FIELD_NAME_STRING]: '' })
      }
    }
    // Optional: if undefined (e.g., initial), choose a default behavior:
    // else { form.setFieldsValue({ [FIELD_NAME_STRING]: '', [FIELD_NAME_MULTIPLE]: [] }) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedTypedSelector])

  const options: SelectProps['options'] =
    kindWithVersion?.map(({ kind, group, version }) => ({
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
          {kind}
          <br />
          {version.groupVersion}
        </div>
      ),
      value: `${group}~${version.version}~${version.resource}`,
    })) || []

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

  return (
    <div>
      <Form form={form} layout="vertical">
        <Styled.FormContainer>
          <Form.Item name={FIELD_NAME} label="Kinds">
            <Select
              mode="multiple"
              placeholder="Select"
              options={options}
              filterOption={filterSelectOptions}
              allowClear
              showSearch
              tagRender={tagRender}
              maxTagCount="responsive"
            />
          </Form.Item>
          <Form.Item name={TYPE_SELECTOR} label="Type">
            <Select
              placeholder="Select"
              options={[
                { label: 'Name', value: 'name' },
                { label: 'Labels', value: 'labels' },
              ]}
              defaultValue="name"
              filterOption={filterSelectOptions}
              showSearch
            />
          </Form.Item>
          <Styled.HideableContainer $isHidden={watchedTypedSelector === 'labels'}>
            <Form.Item name={FIELD_NAME_STRING} label="Name">
              <Input allowClear />
            </Form.Item>
          </Styled.HideableContainer>
          <Styled.HideableContainer $isHidden={watchedTypedSelector === 'name' || watchedTypedSelector === undefined}>
            <Form.Item
              name={FIELD_NAME_MULTIPLE}
              label="Labels"
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
              <Select
                mode="tags"
                allowClear
                placeholder="Select"
                // dropdownStyle={{ display: 'none' }}
                tokenSeparators={[',', ' ', '	']}
                suffixIcon={null}
                filterOption={filterSelectOptions}
                tagRender={tagRender}
              />
            </Form.Item>
          </Styled.HideableContainer>
          <Form.Item label="Search">
            <Button
              type="primary"
              onClick={() =>
                updateCurrentSearch({ resources: watchedKinds, name: watchedName, labels: watchedMultiple })
              }
            >
              Search
            </Button>
          </Form.Item>
        </Styled.FormContainer>
      </Form>
      {/* Example of "watching" the value for display or side-effects */}
      <div>Current: {(watchedKinds || []).join(', ')}</div>
      <div>Current name: {watchedName}</div>
      <div>Current labels: {(watchedMultiple || []).join(', ')}</div>
    </div>
  )
}
