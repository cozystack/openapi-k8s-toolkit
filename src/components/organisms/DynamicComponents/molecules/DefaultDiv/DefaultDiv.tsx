/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import { TDynamicComponentsAppTypeMap } from '../../types'

export const DefaultDiv: FC<{ data: TDynamicComponentsAppTypeMap['DefaultDiv']; children?: any }> = ({
  data,
  children,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...props } = data

  return <div {...props}>{children}</div>
}
