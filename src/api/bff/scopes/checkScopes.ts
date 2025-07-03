import axios from 'axios'
import {
  TCheckIfApiInstanceNamespaceScopedReq,
  TCheckIfApiInstanceNamespaceScopedRes,
  TCheckIfBuiltInInstanceNamespaceScopedReq,
  TCheckIfBuiltInInstanceNamespaceScopedRes,
} from 'localTypes/bff/scopes'

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
  const payload: TCheckIfApiInstanceNamespaceScopedReq = {
    typeName,
    apiGroup,
    apiVersion,
    clusterName,
  }
  const { data } = await axios.post<TCheckIfApiInstanceNamespaceScopedRes>(
    '/openapi-bff/scopes/checkScopes/checkIfApiNamespaceScoped',
    payload,
  )

  return data
}

export const checkIfBuiltInInstanceNamespaceScoped = async ({
  typeName,
  clusterName,
}: {
  typeName: string
  clusterName: string
}) => {
  const payload: TCheckIfBuiltInInstanceNamespaceScopedReq = {
    typeName,
    clusterName,
  }
  const { data } = await axios.post<TCheckIfBuiltInInstanceNamespaceScopedRes>(
    '/openapi-bff/scopes/checkScopes/checkIfBuiltInNamespaceScoped',
    payload,
  )

  return data
}
