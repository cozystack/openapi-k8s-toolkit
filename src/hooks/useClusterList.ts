import { useQuery } from '@tanstack/react-query'
import { getClusterList } from 'api/getClusterList'

export const useClusterList = ({ refetchInterval }: { refetchInterval?: number | false }) => {
  return useQuery({
    queryKey: ['useClusterList'],
    queryFn: async () => (await getClusterList()).data,
    refetchInterval: refetchInterval !== undefined ? refetchInterval : 5000,
  })
}
