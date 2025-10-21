import styled from 'styled-components'

type TContainerProps = {
  $colorBorder: string
}

const Container = styled.div<TContainerProps>`
  height: 140px;
  border: 1px solid ${({ $colorBorder }) => $colorBorder};
  border-radius: 8px;
  padding: 2px;

  .monaco-editor,
  .overflow-guard {
    border-radius: 8px;
  }
`

export const Styled = {
  Container,
}
