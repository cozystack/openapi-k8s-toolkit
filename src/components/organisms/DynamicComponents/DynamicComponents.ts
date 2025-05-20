import { TRendererComponents } from 'localTypes/dynamicRender'
import { TestComponentFirst, TestComponentSecond, TestComponentThird } from './molecules'
import { TDynamicComponentsAppTypeMap } from './types'

export const DynamicComponents: TRendererComponents<TDynamicComponentsAppTypeMap> = {
  user: TestComponentFirst,
  product: TestComponentSecond,
  partsOfUrl: TestComponentThird,
}
