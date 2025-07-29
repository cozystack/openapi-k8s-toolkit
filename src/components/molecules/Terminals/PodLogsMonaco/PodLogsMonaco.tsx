/* eslint-disable no-console */
import React, { FC, useState } from 'react'
import { Flex, Select } from 'antd'
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
  rawPodInfo: unknown & {
    status: unknown & {
      containerStatuses: { name: string; state?: unknown & { running?: unknown }; restartCount?: number }[]
    }
  }
}

export const PodLogsMonaco: FC<TPodLogsMonacoProps> = ({
  cluster,
  namespace,
  podName,
  containers,
  theme,
  substractHeight,
  rawPodInfo,
}) => {
  const [currentContainer, setCurrentContainer] = useState<string | undefined>(containers[0] || undefined)
  const [previous, setPrevious] = useState<boolean>(false)

  const endpoint = `/api/clusters/${cluster}/openapi-bff-ws/terminal/podLogs/podLogsNonWs`

  if (containers.length === 0) {
    return <>No Running Containers</>
  }

  const restartCount = rawPodInfo.status.containerStatuses.find(s => s.name === currentContainer)?.restartCount ?? 0
  const withPrevious = restartCount > 0
  const prevCurOptions = withPrevious
    ? [
        { value: 'current', label: 'Current log' },
        { value: 'previous', label: 'Previous log' },
      ]
    : [{ value: 'current', label: 'Current log' }]

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
            value={currentContainer}
            onChange={value => {
              setCurrentContainer(value)
              setPrevious(false)
            }}
          />
        </Styled.CustomSelect>
        {currentContainer && (
          <Styled.CustomSelect>
            <Select
              placeholder="Select current/previous"
              options={prevCurOptions}
              filterOption={filterSelectOptions}
              disabled={!withPrevious}
              showSearch
              value={previous ? 'previous' : 'current'}
              onChange={value => {
                if (value === 'previous') {
                  setPrevious(true)
                } else {
                  setPrevious(false)
                }
              }}
            />
          </Styled.CustomSelect>
        )}
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
          previous={previous}
          key={`${cluster}-${namespace}-${podName}-${currentContainer}-${previous}`}
        />
      )}
    </>
  )
}
