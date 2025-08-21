import styled from 'styled-components'

type TCursorDefaultDiv = {
  $default?: boolean
}

export const CursorDefaultDiv = styled.div<TCursorDefaultDiv>`
  cursor: ${({ $default }) => ($default ? 'default' : 'inherit')};
`
