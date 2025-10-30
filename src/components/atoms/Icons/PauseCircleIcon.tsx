import React, { FC } from 'react'
import { theme } from 'antd'

type TPauseCircleIconProps = {
  size?: number
}

export const PauseCircleIcon: FC<TPauseCircleIconProps> = ({ size }) => {
  const { token } = theme.useToken()

  return (
    <svg width={size ?? 35} height={size ?? 35} viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.5 0C7.83594 0 0 7.83594 0 17.5C0 27.1641 7.83594 35 17.5 35C27.1641 35 35 27.1641 35 17.5C35 7.83594 27.1641 0 17.5 0ZM14.375 23.4375C14.375 23.6094 14.2344 23.75 14.0625 23.75H12.1875C12.0156 23.75 11.875 23.6094 11.875 23.4375V11.5625C11.875 11.3906 12.0156 11.25 12.1875 11.25H14.0625C14.2344 11.25 14.375 11.3906 14.375 11.5625V23.4375ZM23.125 23.4375C23.125 23.6094 22.9844 23.75 22.8125 23.75H20.9375C20.7656 23.75 20.625 23.6094 20.625 23.4375V11.5625C20.625 11.3906 20.7656 11.25 20.9375 11.25H22.8125C22.9844 11.25 23.125 11.3906 23.125 11.5625V23.4375Z"
        fill={token.colorText}
        fillOpacity="0.88"
      />
    </svg>
  )
}
