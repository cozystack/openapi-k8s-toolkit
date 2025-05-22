import React, { FC } from 'react'
import { TDynamicComponentsAppTypeMap } from '../../types'
import { usePartsOfUrl } from '../../../DynamicExample/partsOfUrlContext'

export const TestComponentThird: FC<{ data: TDynamicComponentsAppTypeMap['partsOfUrl'] }> = ({ data }) => {
  const partsOfUrl = usePartsOfUrl()

  return (
    <div>
      {data.text}: {JSON.stringify(partsOfUrl.partsOfUrl)}
    </div>
  )
}
