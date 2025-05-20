import { ReactElement } from 'react'
// A map where keys are item types and values are the data shape for each
/*
  type MyItemTypeMap = {
    text: { content: string }
    image: { src: string; alt: string }
  }
*/
export type TItemTypeMap = Record<string, unknown>

// An individual renderable item
/*
  type MyRenderableItem =
    | { type: "text"; data: { content: string } }
    | { type: "image"; data: { src: string; alt: string } }
*/
export type TRenderableItem<T extends TItemTypeMap> = {
  [K in keyof T]: {
    type: K
    data: T[K]
    children?: readonly TRenderableItem<T>[] // Add optional children
  }
}[keyof T]

// Component mapping
/*
  const renderers: TRendererComponents<MyItemTypeMap> = {
    text: ({ data }) => <p>{data.content}</p>,
    image: ({ data }) => <img src={data.src} alt={data.alt} />
  }
*/
export type TRendererComponents<T extends TItemTypeMap> = {
  [K in keyof T]: React.ComponentType<{
    data: T[K]
    children?: ReactElement | ReactElement[]
  }>
}
