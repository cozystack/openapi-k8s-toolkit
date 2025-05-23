import React, { FC } from 'react'
import { useLocation } from 'react-router-dom'
import { TRenderableItem } from 'localTypes/dynamicRender'
import { DynamicComponents, TDynamicComponentsAppTypeMap } from '../DynamicComponents'
import { DynamicRenderer } from '../DynamicRenderer'
import { PartsOfUrlProvider } from './partsOfUrlContext'

export const dynamicExampleItems: TRenderableItem<TDynamicComponentsAppTypeMap>[] = [
  { type: 'antdText', data: { id: 1, text: 'Title 1' } },
  {
    type: 'flexComponent',
    data: { id: 2, justify: 'space-around' },
    children: [
      {
        type: 'antdCard',
        data: { id: 3, title: 'Card 1' },
        children: [{ type: 'antdText', data: { id: 4, text: 'In card 1 text' } }],
      },
      {
        type: 'antdCard',
        data: { id: 5, title: 'Card 2' },
        children: [
          { type: 'antdText', data: { id: 6, type: 'danger', text: 'In card 2 text' } },
          { type: 'antdText', data: { id: 7, type: 'danger', text: 'In card 2 text 2' } },
        ],
      },
    ],
  },
  { type: 'antdText', data: { id: 8, text: 'After flex text' } },
  { type: 'partsOfUrl', data: { id: 9, text: 'All parts of url can be used inside' } },
]

export const DynamicExample: FC = () => {
  const location = useLocation()

  return (
    <PartsOfUrlProvider value={{ partsOfUrl: location.pathname.split('/') }}>
      <DynamicRenderer items={dynamicExampleItems} components={DynamicComponents} />
    </PartsOfUrlProvider>
  )
}
