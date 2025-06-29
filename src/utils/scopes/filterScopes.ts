import axios from 'axios'
import { TFilterIfApiInstanceNamespaceScopedRes, TFilterIfBuiltInInstanceNamespaceScopedRes } from 'localTypes/scopes'
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
  const result = await axios.post<TFilterIfApiInstanceNamespaceScopedRes>(
    '/openapi-bff/scopes/filterScopes/filterIfApiNamespaceScoped',
    {
      namespace,
      data,
      apiGroup,
      apiVersion,
      clusterName,
    },
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
  const result = await axios.post<TFilterIfBuiltInInstanceNamespaceScopedRes>(
    '/openapi-bff/scopes/filterScopes/filterIfBuiltInNamespaceScoped',
    {
      namespace,
      data,
      clusterName,
    },
  )

  return result.data
}
