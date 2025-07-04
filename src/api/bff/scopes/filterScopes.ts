import axios from 'axios'
import {
  TFilterIfApiInstanceNamespaceScopedReq,
  TFilterIfApiInstanceNamespaceScopedRes,
  TFilterIfBuiltInInstanceNamespaceScopedReq,
  TFilterIfBuiltInInstanceNamespaceScopedRes,
} from 'localTypes/bff/scopes'
import { TApiGroupResourceTypeList, TBuiltinResourceTypeList } from 'localTypes/k8s'

export const filterIfApiInstanceNamespaceScoped = async ({
  namespace,
  data,
  apiGroup,
  apiVersion,
  clusterName,
}: {
  namespace?: string
  data?: TApiGroupResourceTypeList
  apiGroup: string
  apiVersion: string
  clusterName: string
}) => {
  const payload: TFilterIfApiInstanceNamespaceScopedReq = {
    namespace,
    data,
    apiGroup,
    apiVersion,
    clusterName,
  }
  const result = await axios.post<TFilterIfApiInstanceNamespaceScopedRes>(
    '/openapi-bff/scopes/filterScopes/filterIfApiNamespaceScoped',
    payload,
  )

  return result.data
}

export const filterIfBuiltInInstanceNamespaceScoped = async ({
  namespace,
  data,
  clusterName,
}: {
  namespace?: string
  data?: TBuiltinResourceTypeList
  clusterName: string
}) => {
  const payload: TFilterIfBuiltInInstanceNamespaceScopedReq = {
    namespace,
    data,
    clusterName,
  }
  const result = await axios.post<TFilterIfBuiltInInstanceNamespaceScopedRes>(
    '/openapi-bff/scopes/filterScopes/filterIfBuiltInNamespaceScoped',
    payload,
  )

  return result.data
}
