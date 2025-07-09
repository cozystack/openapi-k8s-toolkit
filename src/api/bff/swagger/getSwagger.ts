import axios, { AxiosResponse } from 'axios'
import { TGetDerefedSwaggerRes } from 'localTypes/bff/swagger'

export const getSwagger = async ({
  clusterName,
}: {
  clusterName: string
}): Promise<AxiosResponse<TGetDerefedSwaggerRes>> => {
  return axios.get<TGetDerefedSwaggerRes>(`/api/clusters/${clusterName}/openapi-bff/swagger/swagger/${clusterName}`)
}
