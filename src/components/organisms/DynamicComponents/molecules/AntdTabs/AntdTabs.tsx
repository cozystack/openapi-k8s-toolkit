/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import { Tabs } from 'antd'
import { TDynamicComponentsAppTypeMap } from '../../types'

export const AntdTabs: FC<{ data: TDynamicComponentsAppTypeMap['antdTabs']; children?: any }> = ({
  data,
  children,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...tabsProps } = data

  return <Tabs {...tabsProps}>{children}</Tabs>
}
