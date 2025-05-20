import React, { FC } from 'react'
import { TRenderableItem } from 'localTypes/dynamicRender'
import { DynamicComponents, TDynamicComponentsAppTypeMap } from '../DynamicComponents'
import { DynamicRenderer } from '../DynamicRenderer'

const items: TRenderableItem<TDynamicComponentsAppTypeMap>[] = [
  { type: 'user', data: { id: 1, name: 'Alice' } },
  { type: 'product', data: { id: 101, price: 19.99 } },
]

export const DynamicExample: FC = () => {
  return <DynamicRenderer items={items} components={DynamicComponents} />
}
