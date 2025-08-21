import styled from 'styled-components'
import { Input } from 'antd'

const NoSelect = styled.div`
  * {
    user-select: none;
  }
`

type TDisabledInputProps = {
  $hidden?: boolean
}

const DisabledInput = styled(Input)<TDisabledInputProps>`
  cursor: ${({ $hidden }) => ($hidden ? 'default' : 'pointer')} !important;
`

export const Styled = {
  NoSelect,
  DisabledInput,
}
