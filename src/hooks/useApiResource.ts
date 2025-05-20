import { useQuery } from '@tanstack/react-query'
import { getApiResources, getApiResourceSingle } from 'api/getApiResource'
import { TApiResources, TSingleResource } from 'localTypes/k8s'

export const useApiResources = ({
  clusterName,
  namespace,
  apiGroup,
  apiVersion,
  typeName,
  limit,
  refetchInterval,
}: {
  clusterName: string
  namespace?: string
  apiGroup: string
  apiVersion: string
  typeName: string
  limit: string | null
  refetchInterval?: number | false
}) => {
  return useQuery({
    queryKey: ['useApiResources', clusterName, namespace, apiGroup, apiVersion, typeName, limit],
    queryFn: async () =>
      (
        await getApiResources<TApiResources>({
          clusterName,
          namespace,
          apiGroup,
          apiVersion,
          typeName,
          limit,
        })
      ).data,
    refetchInterval: refetchInterval !== undefined ? refetchInterval : 5000,
  })
}

export const useApiResourceSingle = ({
  clusterName,
  namespace,
  apiGroup,
  apiVersion,
  typeName,
  entryName,
  refetchInterval,
}: {
  clusterName: string
  namespace?: string
  apiGroup: string
  apiVersion: string
  typeName: string
  entryName: string
  refetchInterval?: number | false
}) => {
  return useQuery({
    queryKey: ['useApiResourceSingle', clusterName, namespace, apiGroup, apiVersion, typeName, entryName],
    queryFn: async () =>
      (
        await getApiResourceSingle<TSingleResource>({
          clusterName,
          namespace,
          apiGroup,
          apiVersion,
          typeName,
          entryName,
        })
      ).data,
    refetchInterval: refetchInterval !== undefined ? refetchInterval : 5000,
  })
}
