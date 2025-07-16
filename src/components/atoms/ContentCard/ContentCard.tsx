import React, { FC, ReactNode } from 'react'
import { theme } from 'antd'
import { Styled } from './styled'

export type TContentCardProps = {
  children?: ReactNode
  flexGrow?: number
  displayFlex?: boolean
  flexFlow?: string
  maxHeight?: number
}

export const ContentCard: FC<TContentCardProps> = ({ children, flexGrow, displayFlex, flexFlow, maxHeight }) => {
  const { token } = theme.useToken()
  return (
    <Styled.ContentContainer
      $flexGrow={flexGrow}
      $bgColor={token.colorBgContainer}
      $borderColor={token.colorBorder}
      $displayFlex={displayFlex}
      $flexFlow={flexFlow}
      $maxHeight={maxHeight}
    >
      {children}
    </Styled.ContentContainer>
  )
}
