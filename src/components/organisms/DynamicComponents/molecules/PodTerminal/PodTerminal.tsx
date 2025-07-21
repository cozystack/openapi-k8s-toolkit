/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import { PodTerminal as Terminal } from 'components'
import { prepareTemplate } from 'utils/prepareTemplate'
import { TDynamicComponentsAppTypeMap } from '../../types'
import { useMultiQuery } from '../../../DynamicRendererWithProviders/multiQueryProvider'
import { usePartsOfUrl } from '../../../DynamicRendererWithProviders/partsOfUrlContext'
import { parseMutliqueryText } from './utils'

export const PodTerminal: FC<{ data: TDynamicComponentsAppTypeMap['PodTerminal']; children?: any }> = ({
  data,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  children,
}) => {
  const { data: multiQueryData, isLoading: isMultiqueryLoading } = useMultiQuery()

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    cluster,
    namespace,
    podName,
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

  const namespacePrepared = prepareTemplate({
    template: parseMutliqueryText({ text: namespace, multiQueryData }),
    replaceValues,
  })

  const podNamePrepared = prepareTemplate({
    template: parseMutliqueryText({ text: podName, multiQueryData }),
    replaceValues,
  })

  if (isMultiqueryLoading) {
    return <div>Loading multiquery</div>
  }

  return (
    <>
      <Terminal cluster={clusterPrepared} namespace={namespacePrepared} podName={podNamePrepared} {...props} />
      {children}
    </>
  )
}
