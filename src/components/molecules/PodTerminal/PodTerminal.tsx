/* eslint-disable no-console */
import React, { FC, useState } from 'react'
import { Select } from 'antd'
import { filterSelectOptions } from 'utils/filterSelectOptions'
import { Spacer } from 'components/atoms'
import { XTerminal } from './molecules'

export type TPodTerminalProps = {
  cluster: string
  namespace: string
  podName: string
  containers: string[]
}

export const PodTerminal: FC<TPodTerminalProps> = ({ cluster, namespace, podName, containers }) => {
  const [currentContainer, setCurrentContainer] = useState<string | undefined>(containers[0] || undefined)

  const endpoint = `/api/clusters/${cluster}/openapi-bff-ws/terminal/terminalPod/terminalPod`

  if (containers.length === 0) {
    return <>No Running Containers</>
  }

  return (
    <>
      <Select
        placeholder="Select container"
        options={containers.map(container => ({ value: container, label: container }))}
        filterOption={filterSelectOptions}
        allowClear
        disabled={containers.length === 0}
        showSearch
        value={currentContainer}
        onChange={value => setCurrentContainer(value)}
      />
      <Spacer $space={8} $samespace />
      {currentContainer && (
        <XTerminal
          endpoint={endpoint}
          namespace={namespace}
          podName={podName}
          container={currentContainer}
          key={`${cluster}-${namespace}-${podName}-${currentContainer}`}
        />
      )}
    </>
  )
}
