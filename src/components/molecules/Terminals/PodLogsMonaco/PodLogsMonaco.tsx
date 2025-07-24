/* eslint-disable no-console */
import React, { FC, useState } from 'react'
import { Button, Flex, Select } from 'antd'
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
  const [selectValue, setSelectValue] = useState<string | undefined>(containers[0] || undefined)
  const [currentContainer, setCurrentContainer] = useState<string | undefined>()
  // if wanna open same
  const [hash, setHash] = useState<number>(0)

  const endpoint = `/api/clusters/${cluster}/openapi-bff-ws/terminal/podLogs/podLogs`

  if (containers.length === 0) {
    return <>No Running Containers</>
  }

  return (
    <>
      <Flex gap={16}>
        <Styled.CustomSelect>
          <Select
            placeholder="Select container"
            options={containers.map(container => ({ value: container, label: container }))}
            filterOption={filterSelectOptions}
            disabled={containers.length === 0}
            showSearch
            value={selectValue}
            onChange={value => {
              setHash(hash + 1)
              setSelectValue(value)
            }}
          />
        </Styled.CustomSelect>
        <Button
          type="primary"
          onClick={() => {
            setCurrentContainer(selectValue)
            setHash(hash + 1)
          }}
          disabled={!selectValue}
        >
          Open
        </Button>
      </Flex>
      <Spacer $space={8} $samespace />
      {currentContainer && (
        <MonacoEditor
          endpoint={endpoint}
          namespace={namespace}
          podName={podName}
          container={currentContainer}
          theme={theme}
          substractHeight={substractHeight}
          key={`${cluster}-${namespace}-${podName}-${currentContainer}-${hash}`}
        />
      )}
    </>
  )
}
