import axios, { AxiosResponse } from 'axios'
import { OpenAPIV2 } from 'openapi-types'

export const getSwagger = async ({
  clusterName,
}: {
  clusterName: string
}): Promise<AxiosResponse<OpenAPIV2.Document>> => {
  return axios.get(`/openapi-bff/swagger/swagger/${clusterName}`)
}
