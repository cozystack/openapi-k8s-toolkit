import { useQuery } from '@tanstack/react-query'
import { getBuiltinResourceTypes } from 'api/getBuiltinResourceTypes'
import { TBuiltinResourceTypeList } from 'localTypes/k8s'

export const useBuiltinResourceTypes = ({ clusterName }: { clusterName: string }) => {
  return useQuery({
    queryKey: ['useBuiltinResourceTypes', clusterName],
    queryFn: async () => (await getBuiltinResourceTypes<TBuiltinResourceTypeList>({ clusterName })).data,
    refetchInterval: 5000,
  })
}
