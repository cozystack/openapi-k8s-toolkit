/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import { Row } from 'antd'
import { TDynamicComponentsAppTypeMap } from '../../types'

export const AntdRow: FC<{ data: TDynamicComponentsAppTypeMap['antdRow']; children?: any }> = ({ data, children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rowProps } = data

  return <Row {...rowProps}>{children}</Row>
}
