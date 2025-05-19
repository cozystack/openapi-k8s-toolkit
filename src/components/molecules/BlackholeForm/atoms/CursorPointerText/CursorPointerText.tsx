import React, { FC, ReactNode } from 'react'
import { Typography } from 'antd'
import type { TextProps } from 'antd/es/typography/Text'
import { Styled } from './styled'

type TCursorPointerTextProps = TextProps & {
  children?: ReactNode
}

export const CursorPointerText: FC<TCursorPointerTextProps> = props => {
  const { children, ...restProps } = props

  return (
    <Styled.CursorPointer>
      <Typography.Text {...restProps}>{children}</Typography.Text>
    </Styled.CursorPointer>
  )
}
