/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import { Typography } from 'antd'
import { TDynamicComponentsAppTypeMap } from '../../types'

export const AntdText: FC<{ data: TDynamicComponentsAppTypeMap['antdText']; children?: any }> = ({
  data,
  children,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, text, ...textProps } = data

  return (
    <Typography.Text {...textProps}>
      {text}
      {children}
    </Typography.Text>
  )
}
