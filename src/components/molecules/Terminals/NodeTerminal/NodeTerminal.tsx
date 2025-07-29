/* eslint-disable no-console */
import React, { FC, useState } from 'react'
import { Select } from 'antd'
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
  const [currentProfile, setCurrentProfile] = useState<string>('general')

  const endpoint = `/api/clusters/${cluster}/openapi-bff-ws/terminal/terminalNode/terminalNode`

  const profiles = ['legacy', 'general', 'baseline', 'netadmin', 'restricted', 'sysadmin']

  return (
    <>
      <Styled.CustomSelect>
        <Select
          placeholder="Select profile"
          options={profiles.map(profile => ({ value: profile, label: profile }))}
          filterOption={filterSelectOptions}
          showSearch
          value={currentProfile}
          onChange={value => setCurrentProfile(value)}
        />
      </Styled.CustomSelect>
      <Spacer $space={16} $samespace />
      {currentProfile && (
        <XTerminal
          endpoint={endpoint}
          nodeName={nodeName}
          profile={currentProfile}
          substractHeight={substractHeight}
          key={`${cluster}-${nodeName}-${currentProfile}`}
        />
      )}
    </>
  )
}
