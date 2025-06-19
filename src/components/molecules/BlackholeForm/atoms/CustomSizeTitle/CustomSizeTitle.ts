import styled from 'styled-components'

type TCustomSizeTitleProps = {
  $designNewLayout?: boolean
}

export const CustomSizeTitle = styled.div<TCustomSizeTitleProps>`
  font-size: ${({ $designNewLayout }) => ($designNewLayout ? '16px' : '14px')};
  line-height: ${({ $designNewLayout }) => ($designNewLayout ? '24px' : '22px')};
`
