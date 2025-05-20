import { TRendererComponents } from 'localTypes/dynamicRender'
import { TestComponentFirst, TestComponentSecond } from './molecules'
import { TDynamicComponentsAppTypeMap } from './types'

export const DynamicComponents: TRendererComponents<TDynamicComponentsAppTypeMap> = {
  user: TestComponentFirst,
  product: TestComponentSecond,
}
