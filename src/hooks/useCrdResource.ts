import { useQuery } from '@tanstack/react-query'
import { getCrdResources, getCrdResourceSingle } from 'api/getCrdResource'
import { TCrdResources, TSingleResource } from 'localTypes/k8s'
import { TJSON } from 'localTypes/JSON'

export const useCrdResources = <T = TJSON[]>({
  clusterName,
  namespace,
  apiGroup,
  apiVersion,
  crdName,
  refetchInterval,
}: {
  clusterName: string
  namespace?: string
  apiGroup: string
  apiVersion: string
  crdName: string
  refetchInterval?: number | false
}) => {
  return useQuery({
    queryKey: ['useCrdResources', clusterName, namespace, apiGroup, apiVersion, crdName],
    queryFn: async () =>
      (
        await getCrdResources<TCrdResources<T>>({
          clusterName,
          namespace,
          apiGroup,
          apiVersion,
          crdName,
        })
      ).data,
    refetchInterval: refetchInterval !== undefined ? refetchInterval : 5000,
  })
}

export const useCrdResourceSingle = ({
  clusterName,
  namespace,
  apiGroup,
  apiVersion,
  crdName,
  entryName,
  refetchInterval,
}: {
  clusterName: string
  namespace?: string
  apiGroup: string
  apiVersion: string
  crdName: string
  entryName: string
  refetchInterval?: number | false
}) => {
  return useQuery({
    queryKey: ['useCrdResourceSingle', clusterName, namespace, apiGroup, apiVersion, crdName, entryName],
    queryFn: async () =>
      (
        await getCrdResourceSingle<TSingleResource>({
          clusterName,
          namespace,
          apiGroup,
          apiVersion,
          crdName,
          entryName,
        })
      ).data,
    refetchInterval: refetchInterval !== undefined ? refetchInterval : 5000,
  })
}
