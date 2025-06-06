/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import { ContentCard as Card } from 'components/atoms'
import { TDynamicComponentsAppTypeMap } from '../../types'

export const ContentCard: FC<{ data: TDynamicComponentsAppTypeMap['ContentCard']; children?: any }> = ({
  data,
  children,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...props } = data

  return <Card {...props}>{children}</Card>
}
