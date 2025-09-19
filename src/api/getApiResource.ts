import axios, { AxiosResponse } from 'axios'

export const getApiResources = async <T>({
  clusterName,
  namespace,
  apiGroup,
  apiVersion,
  typeName,
  specificName,
  labels,
  fields,
  limit,
}: {
  clusterName: string
  namespace?: string
  apiGroup: string
  apiVersion: string
  typeName: string
  specificName?: string
  labels?: string[]
  fields?: string[]
  limit: string | null
}): Promise<AxiosResponse<T>> => {
  const params = new URLSearchParams()
  if (limit !== null) {
    params.set('limit', limit)
  }
  if (labels && labels.length > 0) {
    params.set('labelSelector', labels.join(','))
  }
  if (fields && fields.length > 0) {
    params.set('fieldSelector', fields.join(','))
  }
  const searchParams = params.toString()
  return axios.get(
    `/api/clusters/${clusterName}/k8s/apis/${apiGroup}/${apiVersion}${
      namespace ? `/namespaces/${namespace}` : ''
    }/${typeName}${specificName ? `/${specificName}` : ''}${searchParams.length > 0 ? `?${searchParams}` : ''}`,
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
