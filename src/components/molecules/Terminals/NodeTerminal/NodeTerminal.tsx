/* eslint-disable no-console */
import React, { FC, useState } from 'react'
import { Button, Flex, Select } from 'antd'
import { filterSelectOptions } from 'utils/filterSelectOptions'
import { Spacer } from 'components/atoms'
import { XTerminal } from './molecules'
import { Styled } from './styled'

export type TNodeTerminalProps = {
  cluster: string
  nodeName: string
  substractHeight: number
}

export const NodeTerminal: FC<TNodeTerminalProps> = ({ cluster, nodeName, substractHeight }) => {
  const [selectValue, setSelectValue] = useState<string>()
  const [currentProfile, setCurrentProfile] = useState<string>()
  // if wanna open same
  const [hash, setHash] = useState<number>(0)

  const endpoint = `/api/clusters/${cluster}/openapi-bff-ws/terminal/terminalNode/terminalNode`

  const profiles = ['legacy', 'general', 'baseline', 'netadmin', 'restricted', 'sysadmin']

  return (
    <>
      <Flex gap={16}>
        <Styled.CustomSelect>
          <Select
            placeholder="Select profile"
            options={profiles.map(profile => ({ value: profile, label: profile }))}
            filterOption={filterSelectOptions}
            showSearch
            value={selectValue}
            onChange={value => setSelectValue(value)}
          />
        </Styled.CustomSelect>
        <Button
          type="primary"
          onClick={() => {
            setCurrentProfile(selectValue)
            setHash(hash + 1)
          }}
          disabled={!selectValue}
        >
          Open
        </Button>
      </Flex>
      <Spacer $space={8} $samespace />
      {currentProfile && (
        <XTerminal
          endpoint={endpoint}
          nodeName={nodeName}
          profile={currentProfile}
          substractHeight={substractHeight}
          key={`${cluster}-${nodeName}-${currentProfile}-${hash}`}
        />
      )}
    </>
  )
}
