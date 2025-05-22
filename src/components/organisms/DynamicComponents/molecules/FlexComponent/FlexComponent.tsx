/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import { Flex } from 'antd'
import { TDynamicComponentsAppTypeMap } from '../../types'

export const FlexComponent: FC<{ data: TDynamicComponentsAppTypeMap['flexComponent']; children?: any }> = ({
  data,
  children,
}) => (
  <>
    <div>{data.title}</div>
    <Flex justify="center" align="center">
      {children}
    </Flex>
  </>
)
