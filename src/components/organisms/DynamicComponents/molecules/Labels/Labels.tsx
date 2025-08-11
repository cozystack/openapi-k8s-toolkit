/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-array-index-key */
import React, { FC } from 'react'
import jp from 'jsonpath'
import { Popover } from 'antd'
import { UncontrolledSelect, CursorPointerTag } from 'components/atoms'
import { TDynamicComponentsAppTypeMap } from '../../types'
import { useMultiQuery } from '../../../DynamicRendererWithProviders/multiQueryProvider'
import { parseArrayOfAny, truncate } from './utils'

export const Labels: FC<{ data: TDynamicComponentsAppTypeMap['Labels']; children?: any }> = ({ data, children }) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    reqIndex,
    jsonPathToLabels,
    selectProps,
  } = data

  const { maxTagTextLength, ...restSelectProps } = selectProps || { maxTagTextLength: undefined }

  const { data: multiQueryData, isLoading: isMultiQueryLoading, isError: isMultiQueryErrors, errors } = useMultiQuery()

  if (isMultiQueryLoading) {
    return <div>Loading...</div>
  }

  if (isMultiQueryErrors) {
    return (
      <div>
        <h4>Errors:</h4>
        <ul>{errors.map((e, i) => e && <li key={i}>{e.message}</li>)}</ul>
      </div>
    )
  }

  const jsonRoot = multiQueryData[`req${reqIndex}`]

  if (jsonRoot === undefined) {
    return <div>No root for json path</div>
  }

  const anythingForNow = jp.query(jsonRoot, `$${jsonPathToLabels}`)

  const { data: labelsRaw, error: errorArrayOfObjects } = parseArrayOfAny(anythingForNow)

  if (!labelsRaw) {
    if (errorArrayOfObjects) {
      return <div>{errorArrayOfObjects}</div>
    }
    return <div>Not a valid data structure</div>
  }

  const labels = Object.entries(labelsRaw).map(([key, value]) => `${key}=${value}`)

  return (
    <>
      <UncontrolledSelect
        mode="multiple"
        // maxTagCount="responsive"
        {...restSelectProps}
        value={labels.map(el => ({ label: el, value: el }))}
        options={labels.map(el => ({ label: el, value: el }))}
        open={false}
        showSearch={false}
        removeIcon={() => {
          return null
        }}
        suffixIcon={null}
        tagRender={({ label }) => (
          <Popover content={label}>
            <CursorPointerTag
              onClick={e => {
                e.stopPropagation()
              }}
            >
              {typeof label === 'string' ? truncate(label, maxTagTextLength) : 'Not a string value'}
            </CursorPointerTag>
          </Popover>
        )}
        isCursorPointer
      />
      {children}
    </>
  )
}
