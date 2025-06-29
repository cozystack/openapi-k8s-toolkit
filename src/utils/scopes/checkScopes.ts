import axios from 'axios'
import { TCheckIfApiInstanceNamespaceScopedRes, TCheckIfBuiltInInstanceNamespaceScopedRes } from 'localTypes/scopes'

export const checkIfApiInstanceNamespaceScoped = async ({
  typeName,
  apiGroup,
  apiVersion,
  clusterName,
}: {
  typeName: string
  apiGroup: string
  apiVersion: string
  clusterName: string
}) => {
  const { data } = await axios.post<TCheckIfApiInstanceNamespaceScopedRes>(
    '/openapi-bff/scopes/checkScopes/checkIfApiNamespaceScoped',
    {
      typeName,
      apiGroup,
      apiVersion,
      clusterName,
    },
  )

  const { isClusterWide, isNamespaceScoped } = data
  return { isClusterWide, isNamespaceScoped }
}

export const checkIfBuiltInInstanceNamespaceScoped = async ({
  typeName,
  clusterName,
}: {
  typeName: string
  clusterName: string
}) => {
  const { data } = await axios.post<TCheckIfBuiltInInstanceNamespaceScopedRes>(
    '/openapi-bff/scopes/checkScopes/checkIfBuiltInNamespaceScoped',
    {
      typeName,
      clusterName,
    },
  )

  const { isClusterWide, isNamespaceScoped } = data
  return { isClusterWide, isNamespaceScoped }
}
