import { TApiGroupResourceTypeList, TBuiltinResourceTypeList } from './k8s'

export type TCheckIfApiInstanceNamespaceScopedRes = {
  isClusterWide: boolean
  isNamespaceScoped: boolean
}

export type TCheckIfBuiltInInstanceNamespaceScopedRes = {
  isClusterWide: boolean
  isNamespaceScoped: boolean
}

export type TFilterIfApiInstanceNamespaceScopedRes = TApiGroupResourceTypeList['resources'] | undefined

export type TFilterIfBuiltInInstanceNamespaceScopedRes = TBuiltinResourceTypeList['resources'] | undefined
