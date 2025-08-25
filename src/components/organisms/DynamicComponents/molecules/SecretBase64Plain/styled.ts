import styled, { createGlobalStyle } from 'styled-components'
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
  /* stylelint-disable declaration-no-important */
  cursor: ${({ $hidden }) => ($hidden ? 'default' : 'pointer')} !important;
`

const NotificationOverrides = createGlobalStyle`
  .no-message-notif .ant-notification-notice-message {
    margin-bottom: 0 !important;
  }
`

export const Styled = {
  NoSelect,
  DisabledInput,
  NotificationOverrides,
}
