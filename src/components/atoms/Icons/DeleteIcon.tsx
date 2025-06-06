import React, { FC } from 'react'
import { theme } from 'antd'

export const DeleteIcon: FC = () => {
  const { token } = theme.useToken()

  return (
    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.25 3.5H14.25V1.625C14.25 0.797656 13.5773 0.125 12.75 0.125H5.25C4.42266 0.125 3.75 0.797656 3.75 1.625V3.5H0.75C0.335156 3.5 0 3.83516 0 4.25V5C0 5.10313 0.084375 5.1875 0.1875 5.1875H1.60312L2.18203 17.4453C2.21953 18.2445 2.88047 18.875 3.67969 18.875H14.3203C15.1219 18.875 15.7805 18.2469 15.818 17.4453L16.3969 5.1875H17.8125C17.9156 5.1875 18 5.10313 18 5V4.25C18 3.83516 17.6648 3.5 17.25 3.5ZM12.5625 3.5H5.4375V1.8125H12.5625V3.5Z"
        fill={token.colorText}
      />
    </svg>
  )
}
