import axios, { AxiosResponse } from 'axios'

export const getApiResourceTypes = async <T>({ clusterName }: { clusterName: string }): Promise<AxiosResponse<T>> => {
  return axios.get(`/api/clusters/${clusterName}/k8s/apis/`)
}

export const getApiResourceTypesByApiGroup = async <T>({
  clusterName,
  apiGroup,
  apiVersion,
}: {
  clusterName: string
  apiGroup: string
  apiVersion: string
}): Promise<AxiosResponse<T>> => {
  return axios.get(`/api/clusters/${clusterName}/k8s/apis/${apiGroup}/${apiVersion}/`)
}
