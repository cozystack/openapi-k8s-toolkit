import React, { FC, ReactNode } from 'react'
import { theme } from 'antd'
import { Styled } from './styled'

export type TContentCardProps = {
  children?: ReactNode
  flexGrow?: number
  displayFlex?: boolean
  flexFlow?: string
}

export const ContentCard: FC<TContentCardProps> = ({ children, flexGrow, displayFlex, flexFlow }) => {
  const { token } = theme.useToken()
  return (
    <Styled.ContentContainer
      $flexGrow={flexGrow}
      $bgColor={token.colorBgContainer}
      $borderColor={token.colorBorder}
      $displayFlex={displayFlex}
      $flexFlow={flexFlow}
    >
      {children}
    </Styled.ContentContainer>
  )
}
