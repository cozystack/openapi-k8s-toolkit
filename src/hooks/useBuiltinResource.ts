import { useQuery } from '@tanstack/react-query'
import { getBuiltinResources, getBuiltinResourceSingle } from 'api/getBuiltinResource'
import { TBuiltinResources, TSingleResource } from '../localTypes/k8s'

export const useBuiltinResources = ({
  clusterName,
  namespace,
  typeName,
  limit,
  refetchInterval,
}: {
  clusterName: string
  namespace?: string
  typeName: string
  limit: string | null
  refetchInterval?: number | false
}) => {
  return useQuery({
    queryKey: ['useBuiltinResourceType', clusterName, namespace, typeName, limit],
    queryFn: async () =>
      (await getBuiltinResources<TBuiltinResources>({ clusterName, namespace, typeName, limit })).data,
    refetchInterval: refetchInterval !== undefined ? refetchInterval : 5000,
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
