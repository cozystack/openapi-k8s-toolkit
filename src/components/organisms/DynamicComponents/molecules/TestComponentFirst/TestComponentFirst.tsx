import React, { FC } from 'react'
import { TDynamicComponentsAppTypeMap } from '../../types'

export const TestComponentFirst: FC<{ data: TDynamicComponentsAppTypeMap['user'] }> = ({ data }) => (
  <div>User: {data.name}</div>
)
