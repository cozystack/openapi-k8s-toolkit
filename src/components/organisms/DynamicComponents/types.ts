import { CardProps, FlexProps, RowProps, ColProps } from 'antd'
import type { TextProps } from 'antd/es/typography/Text'

export type TDynamicComponentsAppTypeMap = {
  antdText: { id: number; text: string } & Omit<TextProps, 'id'>
  // antdCard: { id: number; price: number }
  antdCard: { id: number } & Omit<CardProps, 'id'>
  antdFlex: { id: number } & Omit<FlexProps, 'id' | 'children'>
  antdRow: { id: number } & Omit<RowProps, 'id' | 'children'>
  antdCol: { id: number } & Omit<ColProps, 'id' | 'children'>
  partsOfUrl: { id: number; text: string }
  multiQuery: { id: number; text: string }
  parsedText: { id: number; text: string }
}
