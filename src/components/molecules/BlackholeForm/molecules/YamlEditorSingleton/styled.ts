import styled from 'styled-components'

type TBorderRadiusContainerProps = {
  $designNewLayoutHeight?: number
}

const BorderRadiusContainer = styled.div<TBorderRadiusContainerProps>`
  height: ${({ $designNewLayoutHeight }) => ($designNewLayoutHeight ? `${$designNewLayoutHeight}px` : '75vh')};

  .monaco-editor,
  .overflow-guard {
    border-radius: 8px;
  }
`

export const Styled = {
  BorderRadiusContainer,
}
