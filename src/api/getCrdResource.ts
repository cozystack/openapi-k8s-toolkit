import axios, { AxiosResponse } from 'axios'

export const getCrdResources = async <T>({
  clusterName,
  namespace,
  apiGroup,
  apiVersion,
  crdName,
}: {
  clusterName: string
  namespace?: string
  apiGroup: string
  apiVersion: string
  crdName: string
}): Promise<AxiosResponse<T>> => {
  return axios.get(
    `/api/clusters/${clusterName}/k8s/apis/${apiGroup}/${apiVersion}${
      namespace ? `/namespaces/${namespace}` : ''
    }/${crdName}`,
  )
}

export const getCrdResourceSingle = async <T>({
  clusterName,
  namespace,
  apiGroup,
  apiVersion,
  crdName,
  entryName,
}: {
  clusterName: string
  namespace?: string
  apiGroup: string
  apiVersion: string
  crdName: string
  entryName: string
}): Promise<AxiosResponse<T>> => {
  return axios.get(
    `/api/clusters/${clusterName}/k8s/apis/${apiGroup}/${apiVersion}${
      namespace ? `/namespaces/${namespace}` : ''
    }/${crdName}/${entryName}`,
  )
}
