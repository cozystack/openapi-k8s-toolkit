import styled from 'styled-components'

type TVisibilityContainerProps = {
  $hidden?: boolean
}

const VisibilityContainer = styled.div<TVisibilityContainerProps>`
  display: ${({ $hidden }) => ($hidden ? 'none' : 'block')};
`

export const Styled = {
  VisibilityContainer,
}
