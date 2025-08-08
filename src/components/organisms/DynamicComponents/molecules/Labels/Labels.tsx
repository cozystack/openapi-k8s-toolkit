/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-array-index-key */
import React, { FC } from 'react'
import _ from 'lodash'
import { UncontrolledSelect, CursorPointerTag } from 'components/atoms'
import { TDynamicComponentsAppTypeMap } from '../../types'
import { useMultiQuery } from '../../../DynamicRendererWithProviders/multiQueryProvider'

export const Labels: FC<{ data: TDynamicComponentsAppTypeMap['Labels']; children?: any }> = ({ data, children }) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    reqIndex,
    pathToLabels,
    selectProps,
  } = data

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

  const labelsRaw = _.get(multiQueryData[`req${reqIndex}`], pathToLabels) as Record<string, string | number>
  const labels = Object.entries(labelsRaw).map(([key, value]) => `${key}=${value}`)

  return (
    <>
      <UncontrolledSelect
        mode="multiple"
        // maxTagCount="responsive"
        {...selectProps}
        value={labels.map(el => ({ label: el, value: el }))}
        options={labels.map(el => ({ label: el, value: el }))}
        open={false}
        showSearch={false}
        removeIcon={() => {
          return null
        }}
        suffixIcon={null}
        tagRender={({ label }) => (
          <CursorPointerTag
            onClick={e => {
              e.stopPropagation()
            }}
          >
            {label}
          </CursorPointerTag>
        )}
        isCursorPointer
      />
      {children}
    </>
  )
}
