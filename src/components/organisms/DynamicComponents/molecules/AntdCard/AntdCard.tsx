/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import { Card } from 'antd'
import { TDynamicComponentsAppTypeMap } from '../../types'

export const AntdCard: FC<{ data: TDynamicComponentsAppTypeMap['antdCard']; children?: any }> = ({
  data,
  children,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...cardProps } = data

  return <Card {...cardProps}>{children}</Card>
}
