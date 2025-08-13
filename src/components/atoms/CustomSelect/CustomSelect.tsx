import React, { FC } from 'react'
import { SelectProps } from 'antd'
import { Styled } from './styled'

type TCustomSelectProps = SelectProps & {
  paddingContainerEnd?: string
}

export const CustomSelect: FC<TCustomSelectProps> = props => {
  const { paddingContainerEnd, ...rest } = props

  return <Styled.CustomSelect $paddingContainerEnd={paddingContainerEnd} {...rest} />
}
