import styled from 'styled-components'

type TPaddingContainerProps = {
  $padding: string
}

export const PaddingContainer = styled.div<TPaddingContainerProps>`
  padding: ${({ $padding }) => $padding};
`
