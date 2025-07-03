import { TApiGroupResourceTypeList, TBuiltinResourceTypeList } from '../k8s'

export type TCheckIfApiInstanceNamespaceScopedReq = {
  typeName: string
  apiGroup: string
  apiVersion: string
  clusterName: string
}

export type TCheckIfApiInstanceNamespaceScopedRes = {
  isClusterWide: boolean
  isNamespaceScoped: boolean
}

export type TCheckIfBuiltInInstanceNamespaceScopedReq = {
  typeName: string
  clusterName: string
}

export type TCheckIfBuiltInInstanceNamespaceScopedRes = {
  isClusterWide: boolean
  isNamespaceScoped: boolean
}

export type TFilterIfApiInstanceNamespaceScopedReq = {
  namespace?: string
  data?: TApiGroupResourceTypeList
  apiGroup: string
  apiVersion: string
  clusterName: string
}

export type TFilterIfApiInstanceNamespaceScopedRes = TApiGroupResourceTypeList['resources'] | undefined

export type TFilterIfBuiltInInstanceNamespaceScopedReq = {
  namespace?: string
  data?: TBuiltinResourceTypeList
  clusterName: string
}

export type TFilterIfBuiltInInstanceNamespaceScopedRes = TBuiltinResourceTypeList['resources'] | undefined
