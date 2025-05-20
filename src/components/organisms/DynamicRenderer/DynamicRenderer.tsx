/* eslint-disable react/no-array-index-key */
import React, { ReactElement } from 'react'
import { TItemTypeMap, TRenderableItem, TRendererComponents } from 'localTypes/dynamicRender'

export type TDynamicRendererProps<T extends TItemTypeMap> = {
  items: readonly TRenderableItem<T>[]
  components: TRendererComponents<T>
}

export const DynamicRenderer = <T extends TItemTypeMap>(props: TDynamicRendererProps<T>): ReactElement => {
  const { items, components } = props

  return (
    <div>
      {items.map((item, index) => {
        const Component = components[item.type] as React.ComponentType<{ data: typeof item.data }>

        if (!Component) {
          return <div key={index}>❌ No component registered for type: {String(item.type)}</div>
        }

        return (
          <div key={index}>
            <Component data={item.data} />
          </div>
        )
      })}
    </div>
  )
}
