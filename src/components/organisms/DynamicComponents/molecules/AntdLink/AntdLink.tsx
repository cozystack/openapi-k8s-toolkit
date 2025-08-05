/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import { Typography } from 'antd'
import { prepareTemplate } from 'utils/prepareTemplate'
import { TDynamicComponentsAppTypeMap } from '../../types'
import { useMultiQuery } from '../../../DynamicRendererWithProviders/multiQueryProvider'
import { usePartsOfUrl } from '../../../DynamicRendererWithProviders/partsOfUrlContext'
import { parseMutliqueryText } from './utils'

export const AntdLink: FC<{ data: TDynamicComponentsAppTypeMap['antdLink']; children?: any }> = ({
  data,
  children,
}) => {
  const { data: multiQueryData, isLoading: isMultiqueryLoading } = useMultiQuery()
  const partsOfUrl = usePartsOfUrl()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, text, href, ...linkProps } = data

  const replaceValues = partsOfUrl.partsOfUrl.reduce<Record<string, string | undefined>>((acc, value, index) => {
    acc[index.toString()] = value
    return acc
  }, {})

  const textPrepared = prepareTemplate({
    template: parseMutliqueryText({ text, multiQueryData }),
    replaceValues,
  })

  const hrefPrepared = prepareTemplate({
    template: parseMutliqueryText({ text: href, multiQueryData }),
    replaceValues,
  })

  if (isMultiqueryLoading) {
    return <div>Loading multiquery</div>
  }

  return (
    <Typography.Link href={hrefPrepared} {...linkProps}>
      {textPrepared}
      {children}
    </Typography.Link>
  )
}
