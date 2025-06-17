import styled from 'styled-components'

type TTitleProps = {
  $designNewLayout?: boolean
}

const Title = styled.div<TTitleProps>`
  font-size: ${({ $designNewLayout }) => ($designNewLayout ? '16px' : '14px')};
  line-height: ${({ $designNewLayout }) => ($designNewLayout ? '24px' : '22px')};
`

export const Styled = {
  Title,
}
