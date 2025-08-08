/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-array-index-key */
import React, { FC } from 'react'
import _ from 'lodash'
import { Typography } from 'antd'
import { TDynamicComponentsAppTypeMap } from '../../types'
import { useMultiQuery } from '../../../DynamicRendererWithProviders/multiQueryProvider'

export const LabelsToSearchParams: FC<{
  data: TDynamicComponentsAppTypeMap['LabelsToSearchParams']
  children?: any
}> = ({ data, children }) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    reqIndex,
    pathToLabels,
    linkPrefix,
    ...linkProps
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
  const labels = Object.entries(labelsRaw)
    .map(([key, value]) => `${key}=${value}`)
    .join(',')
  const labelsEncoded = encodeURIComponent(labels)

  const hrefPrepared = `${linkPrefix}?${labelsEncoded}`
  return (
    <Typography.Link href={hrefPrepared} {...linkProps}>
      {labels}
      {children}
    </Typography.Link>
  )
}
