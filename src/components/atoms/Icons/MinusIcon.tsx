import React, { FC } from 'react'
import { theme } from 'antd'

export const MinusIcon: FC = () => {
  const { token } = theme.useToken()

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.4277 7.32227H1.57059C1.49202 7.32227 1.42773 7.38655 1.42773 7.46512V8.53655C1.42773 8.61512 1.49202 8.67941 1.57059 8.67941H14.4277C14.5063 8.67941 14.5706 8.61512 14.5706 8.53655V7.46512C14.5706 7.38655 14.5063 7.32227 14.4277 7.32227Z"
        fill={token.colorText}
      />
    </svg>
  )
}
