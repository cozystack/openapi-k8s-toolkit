import styled from 'styled-components'

type TContainerProps = {
  $designNewLayout?: boolean
  $borderColor: string
  $bgColor: string
}

const Container = styled.div<TContainerProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ $designNewLayout }) => ($designNewLayout ? '4px' : '8px')};
  border: 1px solid ${({ $borderColor }) => $borderColor};
  border-radius: ${({ $designNewLayout }) => ($designNewLayout ? '6px' : '8px')};
  background-color: ${({ $designNewLayout, $bgColor }) => ($designNewLayout ? $bgColor : 'initial')};
  width: 100%;
  padding: ${({ $designNewLayout }) => ($designNewLayout ? '16px' : 'initial')};
  margin-bottom: ${({ $designNewLayout }) => ($designNewLayout ? '10px' : '16px')};
  box-shadow: ${({ $designNewLayout }) =>
    $designNewLayout
      ? `
    0 6px 16px 0 #00000014,
    0 3px 6px -4px #0000001f,
    0 9px 28px 8px #0000000d`
      : 'initial'};
`

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
`

type TContentProps = {
  $isOpen?: boolean
}

const Content = styled.div<TContentProps>`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  padding: 4px;
`

export const Styled = {
  Container,
  TitleBar,
  Content,
}
