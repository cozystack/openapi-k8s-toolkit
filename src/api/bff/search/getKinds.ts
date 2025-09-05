import axios from 'axios'
import { TKindIndex } from 'localTypes/bff/search'

export const getKinds = async ({ clusterName }: { clusterName: string }) => {
  const result = await axios.get<TKindIndex>(`/api/clusters/${clusterName}/openapi-bff/search/kinds/getKinds`)

  return result.data
}
