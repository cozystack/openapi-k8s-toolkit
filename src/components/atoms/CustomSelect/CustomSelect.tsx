import React, { FC } from 'react'
import { SelectProps } from 'antd'
import { Styled } from './styled'

export const CustomSelect: FC<SelectProps> = props => {
  return <Styled.CustomSelect {...props} />
}
