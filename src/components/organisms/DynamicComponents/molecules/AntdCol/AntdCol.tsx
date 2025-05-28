/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import { Col } from 'antd'
import { TDynamicComponentsAppTypeMap } from '../../types'

export const AntdCol: FC<{ data: TDynamicComponentsAppTypeMap['antdCol']; children?: any }> = ({ data, children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rowProps } = data

  return <Col {...rowProps}>{children}</Col>
}
