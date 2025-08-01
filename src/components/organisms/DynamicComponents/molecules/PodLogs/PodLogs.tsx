/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import { Flex, Spin } from 'antd'
import { PodLogsMonaco as Editor } from 'components'
import { useDirectUnknownResource } from 'hooks/useDirectUnknownResource'
import { prepareTemplate } from 'utils/prepareTemplate'
import { TDynamicComponentsAppTypeMap } from '../../types'
import { useMultiQuery } from '../../../DynamicRendererWithProviders/multiQueryProvider'
import { usePartsOfUrl } from '../../../DynamicRendererWithProviders/partsOfUrlContext'
import { useTheme } from '../../../DynamicRendererWithProviders/themeContext'
import { getRunningContainerNames, parseMutliqueryText } from './utils'

export const PodLogs: FC<{ data: TDynamicComponentsAppTypeMap['PodLogs']; children?: any }> = ({
  data,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  children,
}) => {
  const { data: multiQueryData, isLoading: isMultiqueryLoading } = useMultiQuery()
  const theme = useTheme()

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    cluster,
    namespace,
    podName,
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

  const namespacePrepared = prepareTemplate({
    template: parseMutliqueryText({ text: namespace, multiQueryData }),
    replaceValues,
  })

  const podNamePrepared = prepareTemplate({
    template: parseMutliqueryText({ text: podName, multiQueryData }),
    replaceValues,
  })

  const {
    data: podInfo,
    isError: isPodInfoError,
    isLoading: isLoadingPodInfo,
  } = useDirectUnknownResource<
    unknown & {
      status: unknown & {
        containerStatuses: { name: string; state?: unknown & { running?: unknown }; restartCount?: number }[]
        initContainerStatuses: { name: string }[]
      }
    }
  >({
    uri: `/api/clusters/${clusterPrepared}/k8s/api/v1/namespaces/${namespacePrepared}/pods/${podNamePrepared}`,
    refetchInterval: 5000,
    queryKey: [clusterPrepared || 'no-cluster', 'pods', podNamePrepared],
    isEnabled: clusterPrepared !== undefined && namespacePrepared !== undefined && podNamePrepared !== undefined,
  })

  if (isMultiqueryLoading) {
    return <div>Loading multiquery</div>
  }

  if (isLoadingPodInfo) {
    return (
      <Flex justify="center">
        <Spin />
      </Flex>
    )
  }

  if (isPodInfoError) {
    return <div>Error: {JSON.stringify(isPodInfoError)}</div>
  }

  if (!podInfo) {
    return <>No Pod Info</>
  }

  const { containers, initContainers } = getRunningContainerNames(podInfo)

  return (
    <>
      <Editor
        cluster={clusterPrepared}
        namespace={namespacePrepared}
        podName={podNamePrepared}
        containers={containers}
        initContainers={initContainers}
        theme={theme}
        substractHeight={substractHeight || 340 + 35 + 8}
        rawPodInfo={podInfo}
        {...props}
      />
      {children}
    </>
  )
}
