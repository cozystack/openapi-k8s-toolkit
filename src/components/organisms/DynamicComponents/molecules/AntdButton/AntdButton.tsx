/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import { Button } from 'antd'
import { TDynamicComponentsAppTypeMap } from '../../types'

export const AntdButton: FC<{ data: TDynamicComponentsAppTypeMap['antdButton']; children?: any }> = ({
  data,
  children,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, text, ...buttonProps } = data

  return (
    <Button {...buttonProps}>
      {data.text}
      {children}
    </Button>
  )
}
