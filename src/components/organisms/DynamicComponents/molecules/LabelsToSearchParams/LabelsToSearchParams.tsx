/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-array-index-key */
import React, { FC } from 'react'
import jp from 'jsonpath'
import { Typography } from 'antd'
import { TDynamicComponentsAppTypeMap } from '../../types'
import { useMultiQuery } from '../../../DynamicRendererWithProviders/multiQueryProvider'
import { usePartsOfUrl } from '../../../DynamicRendererWithProviders/partsOfUrlContext'
import { parseAll } from '../utils'
import { parseArrayOfAny } from './utils'

export const LabelsToSearchParams: FC<{
  data: TDynamicComponentsAppTypeMap['LabelsToSearchParams']
  children?: any
}> = ({ data, children }) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    reqIndex,
    jsonPathToLabels,
    linkPrefix,
    errorText,
    ...linkProps
  } = data

  const { data: multiQueryData, isLoading: isMultiQueryLoading, isError: isMultiQueryErrors, errors } = useMultiQuery()
  const partsOfUrl = usePartsOfUrl()

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

  const replaceValues = partsOfUrl.partsOfUrl.reduce<Record<string, string | undefined>>((acc, value, index) => {
    acc[index.toString()] = value
    return acc
  }, {})

  const jsonRoot = multiQueryData[`req${reqIndex}`]

  if (jsonRoot === undefined) {
    return <div>No root for json path</div>
  }

  const anythingForNow = jp.query(jsonRoot, `$${jsonPathToLabels}`)

  const { data: labelsRaw, error: errorArrayOfObjects } = parseArrayOfAny(anythingForNow)

  const linkPrefixPrepared = parseAll({ text: linkPrefix, replaceValues, multiQueryData })

  if (!labelsRaw) {
    if (errorArrayOfObjects) {
      console.log(errorArrayOfObjects)
      // return <div>{errorArrayOfObjects}</div>
      return (
        <Typography.Link href={linkPrefixPrepared} {...linkProps}>
          {errorText}
          {children}
        </Typography.Link>
      )
    }
    console.log('Not a valid data structure')
    // return <div>Not a valid data structure</div>      return (
    return (
      <Typography.Link href={linkPrefixPrepared} {...linkProps}>
        {errorText}
        {children}
      </Typography.Link>
    )
  }

  const labels = Object.entries(labelsRaw)
    .map(([key, value]) => `${key}=${value}`)
    .join(',')
  const labelsEncoded = encodeURIComponent(labels)

  const hrefPrepared = `${linkPrefixPrepared}?${labelsEncoded}`
  return (
    <Typography.Link href={hrefPrepared} {...linkProps}>
      {labels}
      {children}
    </Typography.Link>
  )
}
