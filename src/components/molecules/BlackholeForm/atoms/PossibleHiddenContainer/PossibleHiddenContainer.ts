import styled from 'styled-components'

type TPossibleHiddenContainerProps = {
  $isHidden?: boolean
}

export const PossibleHiddenContainer = styled.div<TPossibleHiddenContainerProps>`
  display: ${({ $isHidden }) => ($isHidden ? 'none' : 'block')};
`
