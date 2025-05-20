import axios, { AxiosResponse } from 'axios'

export const getApiResources = async <T>({
  clusterName,
  namespace,
  apiGroup,
  apiVersion,
  typeName,
  limit,
}: {
  clusterName: string
  namespace?: string
  apiGroup: string
  apiVersion: string
  typeName: string
  limit: string | null
}): Promise<AxiosResponse<T>> => {
  const parsedLimit = limit !== null ? `?limit=${limit}` : ''
  return axios.get(
    `/api/clusters/${clusterName}/k8s/apis/${apiGroup}/${apiVersion}${
      namespace ? `/namespaces/${namespace}` : ''
    }/${typeName}${parsedLimit}`,
  )
}

export const getApiResourceSingle = async <T>({
  clusterName,
  namespace,
  apiGroup,
  apiVersion,
  typeName,
  entryName,
}: {
  clusterName: string
  namespace?: string
  apiGroup: string
  apiVersion: string
  typeName: string
  entryName: string
}): Promise<AxiosResponse<T>> => {
  return axios.get(
    `/api/clusters/${clusterName}/k8s/apis/${apiGroup}/${apiVersion}${
      namespace ? `/namespaces/${namespace}` : ''
    }/${typeName}/${entryName}`,
  )
}
