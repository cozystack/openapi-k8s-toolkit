/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import { NodeTerminal as Terminal } from 'components'
import { prepareTemplate } from 'utils/prepareTemplate'
import { TDynamicComponentsAppTypeMap } from '../../types'
import { useMultiQuery } from '../../../DynamicRendererWithProviders/multiQueryProvider'
import { usePartsOfUrl } from '../../../DynamicRendererWithProviders/partsOfUrlContext'
import { parseMutliqueryText } from './utils'

export const NodeTerminal: FC<{ data: TDynamicComponentsAppTypeMap['NodeTerminal']; children?: any }> = ({
  data,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  children,
}) => {
  const { data: multiQueryData, isLoading: isMultiqueryLoading } = useMultiQuery()

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    cluster,
    nodeName,
    substractHeight,
    ...props
  } = data

  const partsOfUrl = usePartsOfUrl()

  const replaceValues = partsOfUrl.partsOfUrl.reduce<Record<string, string | undefined>>((acc, value, index) => {
    acc[index.toString()] = value
    return acc
  }, {})

  const clusterPrepared = prepareTemplate({
    template: parseMutliqueryText({ text: cluster, multiQueryData }),
    replaceValues,
  })

  const nodeNamePrepared = prepareTemplate({
    template: parseMutliqueryText({ text: nodeName, multiQueryData }),
    replaceValues,
  })

  if (isMultiqueryLoading) {
    return <div>Loading multiquery</div>
  }

  return (
    <>
      <Terminal
        cluster={clusterPrepared}
        nodeName={nodeNamePrepared}
        substractHeight={substractHeight || 340}
        {...props}
      />
      {children}
    </>
  )
}
