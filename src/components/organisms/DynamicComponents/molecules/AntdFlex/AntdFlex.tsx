/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import { Flex } from 'antd'
import { TDynamicComponentsAppTypeMap } from '../../types'

export const AntdFlex: FC<{ data: TDynamicComponentsAppTypeMap['antdFlex']; children?: any }> = ({
  data,
  children,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...flexProps } = data

  return <Flex {...flexProps}>{children}</Flex>
}
