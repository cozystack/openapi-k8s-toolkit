import styled from 'styled-components'

type TContentProps = {
  $isOpen?: boolean
  $designNewLayout?: boolean
}

const Content = styled.div<TContentProps>`
  padding: ${({ $designNewLayout }) => ($designNewLayout ? '0 0 0 6px' : '4px')};
`

export const Styled = {
  Content,
}
