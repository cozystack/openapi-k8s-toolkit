import React, { FC } from 'react'
import { useLocation } from 'react-router-dom'
import { TRenderableItem } from 'localTypes/dynamicRender'
import { DynamicComponents, TDynamicComponentsAppTypeMap } from '../DynamicComponents'
import { DynamicRenderer } from '../DynamicRenderer'
import { PartsOfUrlProvider } from './partsOfUrlContext'

const items: TRenderableItem<TDynamicComponentsAppTypeMap>[] = [
  { type: 'user', data: { id: 1, name: 'Alice' } },
  { type: 'product', data: { id: 2, price: 19.99 } },
  { type: 'partsOfUrl', data: { id: 3, text: 'All parts of url can be used inside' } },
  {
    type: 'flexComponent',
    data: { id: 4, title: 'Flex Container' },
    children: [
      { type: 'user', data: { id: 5, name: 'Nested User 1' } },
      { type: 'user', data: { id: 6, name: 'Nested User 2' } },
    ],
  },
]

export const DynamicExample: FC = () => {
  const location = useLocation()

  return (
    <PartsOfUrlProvider value={{ partsOfUrl: location.pathname.split('/') }}>
      <DynamicRenderer items={items} components={DynamicComponents} />
    </PartsOfUrlProvider>
  )
}
