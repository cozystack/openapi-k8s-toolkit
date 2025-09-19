import { useQuery } from '@tanstack/react-query'
import { getBuiltinResources, getBuiltinResourceSingle } from 'api/getBuiltinResource'
import { TBuiltinResources, TSingleResource } from '../localTypes/k8s'

export const useBuiltinResources = ({
  clusterName,
  namespace,
  typeName,
  specificName,
  labels,
  fields,
  limit,
  refetchInterval,
  isEnabled,
}: {
  clusterName: string
  namespace?: string
  typeName: string
  specificName?: string
  labels?: string[]
  fields?: string[]
  limit: string | null
  refetchInterval?: number | false
  isEnabled?: boolean
}) => {
  return useQuery({
    queryKey: ['useBuiltinResourceType', clusterName, namespace, typeName, specificName, labels, fields, limit],
    queryFn: async () => {
      const response = await getBuiltinResources<TBuiltinResources>({
        clusterName,
        namespace,
        typeName,
        specificName,
        labels,
        fields,
        limit,
      })
      // Deep clone the data (to avoid mutating the original response)
      const data = JSON.parse(JSON.stringify(response.data))
      // Remove deeply nested field
      if (data.metadata?.resourceVersion) {
        delete data.metadata.resourceVersion
      }
      return data as TBuiltinResources
    },
    refetchInterval: refetchInterval !== undefined ? refetchInterval : 5000,
    enabled: isEnabled,
  })
}

export const useBuiltinResourceSingle = ({
  clusterName,
  namespace,
  typeName,
  entryName,
  refetchInterval,
}: {
  clusterName: string
  namespace?: string
  typeName: string
  entryName: string
  refetchInterval?: number | false
}) => {
  return useQuery({
    queryKey: ['useBuiltinResourceSingle', clusterName, namespace, typeName, entryName],
    queryFn: async () =>
      (await getBuiltinResourceSingle<TSingleResource>({ clusterName, namespace, typeName, entryName })).data,
    refetchInterval: refetchInterval !== undefined ? refetchInterval : 5000,
  })
}
