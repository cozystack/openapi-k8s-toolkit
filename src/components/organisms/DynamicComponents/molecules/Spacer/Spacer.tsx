/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import { Spacer as SpacerAtom } from 'components/atoms'
import { TDynamicComponentsAppTypeMap } from '../../types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Spacer: FC<{ data: TDynamicComponentsAppTypeMap['Spacer']; children?: any }> = ({ data, children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...props } = data

  return <SpacerAtom {...props} />
}
