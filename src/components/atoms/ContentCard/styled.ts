import styled from 'styled-components'

type TContentContainerProps = {
  $bgColor: string
  $borderColor: string
  $flexGrow?: number
  $displayFlex?: boolean
  $flexFlow?: string
  $maxHeight?: number
}

export const ContentContainer = styled.div<TContentContainerProps>`
  border: 1px solid ${({ $borderColor }) => $borderColor};
  border-radius: 6px;
  background-color: ${({ $bgColor }) => $bgColor};
  width: 100%;
  height: ${({ $maxHeight }) => $maxHeight || '100%'};
  overflow-y: auto;
  padding: 24px;
  flex-grow: ${({ $flexGrow }) => $flexGrow};
  display: ${({ $displayFlex }) => ($displayFlex ? 'flex' : 'block')};
  flex-flow: ${({ $flexFlow }) => $flexFlow};
`

export const Styled = {
  ContentContainer,
}
