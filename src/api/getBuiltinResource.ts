import axios, { AxiosResponse } from 'axios'

export const getBuiltinResources = async <T>({
  clusterName,
  namespace,
  typeName,
  specificName,
  labels,
  limit,
}: {
  clusterName: string
  namespace?: string
  typeName: string
  specificName?: string
  labels?: string[]
  limit: string | null
}): Promise<AxiosResponse<T>> => {
  const params = new URLSearchParams()
  if (limit !== null) {
    params.set('limit', limit)
  }
  if (labels && labels.length > 0) {
    params.set('labelSelector', labels.join(','))
  }
  const searchParams = params.toString()
  return axios.get(
    `/api/clusters/${clusterName}/k8s/api/v1${namespace ? `/namespaces/${namespace}` : ''}/${typeName}${
      specificName ? `/${specificName}` : ''
    }${searchParams.length > 0 ? `?${searchParams}` : ''}`,
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
