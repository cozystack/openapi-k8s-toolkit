import axios, { AxiosResponse } from 'axios'
import { TClusterList } from 'localTypes/clusterList'

export const getClusterList = async (): Promise<AxiosResponse<TClusterList>> => {
  return axios.get('/clusterlist')
}
