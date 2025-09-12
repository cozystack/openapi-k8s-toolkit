/* eslint-disable max-lines-per-function */
import React, { FC, useState, useEffect } from 'react'
import { Typography, Form, Select, SelectProps, Input } from 'antd'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import { useLocation, useSearchParams } from 'react-router-dom'
import { getKinds } from 'api/bff/search/getKinds'
import { getSortedKinds } from 'utils/getSortedKinds'
import { TKindIndex } from 'localTypes/bff/search'
import { TKindWithVersion } from 'localTypes/search'
import { filterSelectOptions } from 'utils/filterSelectOptions'
import { useDebouncedCallback, getArrayParam, setArrayParam } from './utils'
import { Styled } from './styled'

type TSearchProps = {
  cluster: string
}

export const Search: FC<TSearchProps> = ({ cluster }) => {
  const [form] = Form.useForm()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  const FIELD_NAME = 'kinds'
  const FIELD_NAME_STRING = 'name'
  const FIELD_NAME_MULTIPLE = 'labels'
  const TYPE_SELECTOR = 'TYPE_SELECTOR'
  const QUERY_KEY = 'kinds' // the query param name

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
    const fromUrl = getArrayParam(searchParams, QUERY_KEY)
    const current = form.getFieldValue(FIELD_NAME)

    // Only update the form if URL differs from form (prevents loops)
    const differ = (fromUrl.length || 0) !== (current?.length || 0) || fromUrl.some((v, i) => v !== current?.[i])

    if (differ) {
      form.setFieldsValue({ [FIELD_NAME]: fromUrl })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]) // react to back/forward, external URL edits

  // Watch field changes to push to URL (debounced)
  const debouncedPush = useDebouncedCallback((values: string[]) => {
    const next = setArrayParam(searchParams, QUERY_KEY, values)
    setSearchParams(next, { replace: true }) // replace to keep history cleaner
  }, 250)

  useEffect(() => {
    debouncedPush(watchedKinds || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedKinds])

  // eslint-disable-next-line no-console
  console.log(kindWithVersion)

  const options: SelectProps['options'] =
    kindWithVersion?.map(({ kind, notUnique, group, version }) => ({
      label: notUnique ? (
        <div>
          {kind}
          <br />
          {version.groupVersion}
        </div>
      ) : (
        kind
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
    <Styled.CatContainer>
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
          {/* Example of "watching" the value for display or side-effects */}
          <div>Current: {(watchedKinds || []).join(', ')}</div>
          <div>Current name: {watchedName}</div>
          <div>Current labels: {(watchedMultiple || []).join(', ')}</div>
        </Styled.FormContainer>
      </Form>
      <Typography.Title>To Be Done</Typography.Title>
    </Styled.CatContainer>
  )
}
