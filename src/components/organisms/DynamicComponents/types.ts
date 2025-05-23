import { CardProps, FlexProps } from 'antd'
import type { TextProps } from 'antd/es/typography/Text'

export type TDynamicComponentsAppTypeMap = {
  antdText: { id: number; text: string } & Omit<TextProps, 'id'>
  // antdCard: { id: number; price: number }
  antdCard: { id: number } & Omit<CardProps, 'id'>
  partsOfUrl: { id: number; text: string }
  flexComponent: { id: number } & Omit<FlexProps, 'id' | 'children'>
}
