import { TRendererComponents } from 'localTypes/dynamicRender'
import { AntdText, AntdCard, PartsOfUrl, FlexComponent } from './molecules'
import { TDynamicComponentsAppTypeMap } from './types'

export const DynamicComponents: TRendererComponents<TDynamicComponentsAppTypeMap> = {
  antdText: AntdText,
  antdCard: AntdCard,
  partsOfUrl: PartsOfUrl,
  flexComponent: FlexComponent,
}
