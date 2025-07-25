/* eslint-disable no-console */
import React, { FC, useState } from 'react'
import { Select } from 'antd'
import { filterSelectOptions } from 'utils/filterSelectOptions'
import { Spacer } from 'components/atoms'
import { MonacoEditor } from './molecules'
import { Styled } from './styled'

export type TPodLogsMonacoProps = {
  cluster: string
  namespace: string
  podName: string
  containers: string[]
  theme: 'dark' | 'light'
  substractHeight: number
}

export const PodLogsMonaco: FC<TPodLogsMonacoProps> = ({
  cluster,
  namespace,
  podName,
  containers,
  theme,
  substractHeight,
}) => {
  const [currentContainer, setCurrentContainer] = useState<string | undefined>(containers[0] || undefined)

  const endpoint = `/api/clusters/${cluster}/openapi-bff-ws/terminal/podLogs/podLogs`

  if (containers.length === 0) {
    return <>No Running Containers</>
  }

  return (
    <>
      <Styled.CustomSelect>
        <Select
          placeholder="Select container"
          options={containers.map(container => ({ value: container, label: container }))}
          filterOption={filterSelectOptions}
          disabled={containers.length === 0}
          showSearch
          value={currentContainer}
          onChange={value => {
            setCurrentContainer(value)
          }}
        />
      </Styled.CustomSelect>
      <Spacer $space={8} $samespace />
      {currentContainer && (
        <MonacoEditor
          endpoint={endpoint}
          namespace={namespace}
          podName={podName}
          container={currentContainer}
          theme={theme}
          substractHeight={substractHeight}
          key={`${cluster}-${namespace}-${podName}-${currentContainer}`}
        />
      )}
    </>
  )
}
