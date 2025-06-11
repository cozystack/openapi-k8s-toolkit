/* eslint-disable @typescript-eslint/no-explicit-any */
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

        // Modify data: if data.items is an array, wrap their children with DynamicRendererInner
        let modifiedData = item.data
        if (
          typeof item.data === 'object' &&
          item.data !== null &&
          'items' in item.data &&
          Array.isArray((item.data as any).items)
        ) {
          const { items: childItems, ...rest } = item.data as any
          modifiedData = {
            ...rest,
            items: childItems.map((child: any) => ({
              ...child,
              children: Array.isArray(child.children) ? (
                <DynamicRendererInner items={child.children} components={components} />
              ) : (
                child.children
              ),
            })),
          }
        }

        const children = item.children ? <DynamicRendererInner items={item.children} components={components} /> : null

        return (
          <Fragment key={index}>
            <Component data={modifiedData} children={children} />
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
