import axios, { AxiosResponse } from 'axios'

export const getBuiltinResourceTypes = async <T>({
  clusterName,
}: {
  clusterName: string
}): Promise<AxiosResponse<T>> => {
  return axios.get(`/api/clusters/${clusterName}/k8s/api/v1`)
}
