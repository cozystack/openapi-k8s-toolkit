/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import jp from 'jsonpath'
import { Typography } from 'antd'
import { TDynamicComponentsAppTypeMap } from '../../types'
import { useMultiQuery } from '../../../DynamicRendererWithProviders/multiQueryProvider'

export const StatusText: FC<{ data: TDynamicComponentsAppTypeMap['StatusText']; children?: any }> = ({
  data,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  children,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, requestIndex, jsonPath, criteria, valueToCompare, successText, errorText, ...props } = data

  const { data: multiQueryData, isLoading, isError, errors } = useMultiQuery()

  let jpQueryResult: any
  try {
    ;[jpQueryResult] = jp.query(multiQueryData[`req${requestIndex}`], `$${jsonPath}`)
  } catch (err) {
    return (
      <div>
        <h4>Errors:</h4>
        <ul>{JSON.stringify(err)}</ul>
      </div>
    )
  }

  const result = criteria === 'equals' ? valueToCompare === jpQueryResult : valueToCompare !== jpQueryResult

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return (
      <div>
        <h4>Errors:</h4>
        {/* eslint-disable-next-line react/no-array-index-key */}
        <ul>{errors.map((e, i) => e && <li key={i}>{e.message}</li>)}</ul>
      </div>
    )
  }

  return (
    <Typography.Text type={result ? 'success' : 'danger'} {...props}>
      {result ? successText : errorText}
      {children}
    </Typography.Text>
  )
}
