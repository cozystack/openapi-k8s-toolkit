import { CardProps, FlexProps, RowProps, ColProps } from 'antd'
import type { TextProps } from 'antd/es/typography/Text'
import { TContentCardProps } from 'components/atoms'

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
  ProjectInfoCard: {
    id: number
    clusterNamePartOfUrl: string
    namespacePartOfUrl: string
    baseApiGroup: string
    baseApiVersion: string
    baseProjectVersion: string
    projectResourceName: string
    mpResourceName: string
    baseprefix?: string
  }
  MarketplaceCard: {
    id: number
    clusterNamePartOfUrl: string
    namespacePartOfUrl: string
    baseApiGroup: string
    baseApiVersion: string
    mpResourceName: string
    mpResourceKind: string
    baseprefix?: string
  }
  ContentCard: { id: number } & TContentCardProps
}
