/* eslint-disable react/no-children-prop */
/* eslint-disable react/no-array-index-key */
import React, { Fragment, ReactElement } from 'react'
import { TItemTypeMap, TRenderableItem, TRendererComponents } from 'localTypes/dynamicRender'

export type TDynamicRendererProps<T extends TItemTypeMap> = {
  items: readonly TRenderableItem<T>[]
  components: TRendererComponents<T>
}

const DynamicRendererInner = <T extends TItemTypeMap>({
  items,
  components,
}: TDynamicRendererProps<T>): ReactElement => {
  return (
    <>
      {items.map((item, index) => {
        const Component = components[item.type] as React.ComponentType<{
          data: typeof item.data
          children?: JSX.Element | null
        }>

        if (!Component) {
          return <div key={index}>❌ No component registered for type: {String(item.type)}</div>
        }

        const children = item.children ? <DynamicRendererInner items={item.children} components={components} /> : null

        return (
          <Fragment key={index}>
            <Component data={item.data} children={children} />
          </Fragment>
        )
      })}
    </>
  )
}

// Public API wrapper
export const DynamicRenderer = <T extends TItemTypeMap>(props: TDynamicRendererProps<T>): ReactElement => {
  return <DynamicRendererInner {...props} />
}
