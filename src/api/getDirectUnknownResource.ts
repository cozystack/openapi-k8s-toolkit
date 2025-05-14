import axios, { AxiosResponse } from 'axios'

export const getDirectUnknownResource = async <T>({ uri }: { uri: string }): Promise<AxiosResponse<T>> => {
  return axios.get(uri)
}
