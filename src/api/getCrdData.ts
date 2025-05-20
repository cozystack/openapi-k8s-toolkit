import axios, { AxiosResponse } from 'axios'

export const getCrdData = async <T>({
  clusterName,
  apiExtensionVersion,
  crdName,
}: {
  clusterName: string
  apiExtensionVersion: string
  crdName: string
}): Promise<AxiosResponse<T>> => {
  return axios.get(
    `/api/clusters/${clusterName}/k8s/apis/apiextensions.k8s.io/${apiExtensionVersion}/customresourcedefinitions/${crdName}`,
  )
}
