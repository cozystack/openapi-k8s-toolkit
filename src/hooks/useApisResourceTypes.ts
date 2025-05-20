import { useQuery } from '@tanstack/react-query'
import { getApiResourceTypes, getApiResourceTypesByApiGroup } from 'api/getApiResourceTypes'
import { TApiGroupList, TApiGroupResourceTypeList } from 'localTypes/k8s'

export const useApisResourceTypes = ({ clusterName }: { clusterName: string }) => {
  return useQuery({
    queryKey: ['useApisResourceTypes', clusterName],
    queryFn: async () => (await getApiResourceTypes<TApiGroupList>({ clusterName })).data,
    refetchInterval: 5000,
  })
}

export const useApiResourceTypesByGroup = ({
  clusterName,
  apiGroup,
  apiVersion,
}: {
  clusterName: string
  apiGroup: string
  apiVersion: string
}) => {
  return useQuery({
    queryKey: ['useApiResourceTypesByGroup', clusterName, apiGroup, apiVersion],
    queryFn: async () =>
      (
        await getApiResourceTypesByApiGroup<TApiGroupResourceTypeList>({
          clusterName,
          apiGroup,
          apiVersion,
        })
      ).data,
    refetchInterval: 5000,
  })
}
