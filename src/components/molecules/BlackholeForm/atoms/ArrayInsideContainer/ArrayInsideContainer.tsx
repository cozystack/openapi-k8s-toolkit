import React, { FC, PropsWithChildren } from 'react'
import { useDesignNewLayout } from '../../organisms/BlackholeForm/context'
import { Styled } from './styled'

type ArrayInsideContainer = PropsWithChildren

export const ArrayInsideContainer: FC<ArrayInsideContainer> = ({ children }) => {
  const designNewLayout = useDesignNewLayout()

  return <Styled.Content $designNewLayout={designNewLayout}>{children}</Styled.Content>
}
