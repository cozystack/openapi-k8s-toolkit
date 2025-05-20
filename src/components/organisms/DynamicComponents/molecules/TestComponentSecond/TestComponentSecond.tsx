import React, { FC } from 'react'
import { TDynamicComponentsAppTypeMap } from '../../types'

export const TestComponentSecond: FC<{ data: TDynamicComponentsAppTypeMap['product'] }> = ({ data }) => (
  <div>Product: ${data.price.toFixed(2)}</div>
)
