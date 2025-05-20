import axios, { AxiosResponse } from 'axios'

export const getBuiltinResources = async <T>({
  clusterName,
  namespace,
  typeName,
  limit,
}: {
  clusterName: string
  namespace?: string
  typeName: string
  limit: string | null
}): Promise<AxiosResponse<T>> => {
  const parsedLimit = limit !== null ? `?limit=${limit}` : ''
  return axios.get(
    `/api/clusters/${clusterName}/k8s/api/v1${namespace ? `/namespaces/${namespace}` : ''}/${typeName}${parsedLimit}`,
  )
}

export const getBuiltinResourceSingle = async <T>({
  clusterName,
  namespace,
  typeName,
  entryName,
}: {
  clusterName: string
  namespace?: string
  typeName: string
  entryName: string
}): Promise<AxiosResponse<T>> => {
  return axios.get(
    `/api/clusters/${clusterName}/k8s/api/v1${namespace ? `/namespaces/${namespace}` : ''}/${typeName}/${entryName}`,
  )
}
