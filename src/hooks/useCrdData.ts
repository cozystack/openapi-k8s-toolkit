import { useQuery } from '@tanstack/react-query'
import { getCrdData } from 'api/getCrdData'
import { TCRD } from 'localTypes/k8s'

export const useCrdData = ({
  clusterName,
  apiExtensionVersion,
  crdName,
}: {
  clusterName: string
  apiExtensionVersion: string
  crdName: string
}) => {
  return useQuery({
    queryKey: ['useCrdData', clusterName, apiExtensionVersion, crdName],
    queryFn: async () =>
      (
        await getCrdData<TCRD>({
          clusterName,
          apiExtensionVersion,
          crdName,
        })
      ).data,
    refetchInterval: 5000,
  })
}
