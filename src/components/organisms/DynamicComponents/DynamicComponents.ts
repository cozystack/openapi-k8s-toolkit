import { TRendererComponents } from 'localTypes/dynamicRender'
import { AntdText, AntdCard, PartsOfUrl, AntdFlex, AntdRow, AntdCol } from './molecules'
import { TDynamicComponentsAppTypeMap } from './types'

export const DynamicComponents: TRendererComponents<TDynamicComponentsAppTypeMap> = {
  antdText: AntdText,
  antdCard: AntdCard,
  partsOfUrl: PartsOfUrl,
  antdFlex: AntdFlex,
  antdRow: AntdRow,
  antdCol: AntdCol,
}
