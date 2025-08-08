import React, { FC } from 'react'
import { SelectProps } from 'antd'
import { Styled } from './styled'

type TUncontrolledSelectProps = SelectProps & {
  isCursorPointer?: boolean
}

export const UncontrolledSelect: FC<TUncontrolledSelectProps> = props => {
  const { isCursorPointer } = props

  return <Styled.UncontrolledSelect {...props} $isCursorPointer={isCursorPointer} />
}
