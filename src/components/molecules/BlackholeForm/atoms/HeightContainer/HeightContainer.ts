import styled from 'styled-components'

type THeightContainerProps = {
  $height: number
}

export const HeightContainer = styled.div<THeightContainerProps>`
  height: ${({ $height }) => $height}px;
`
