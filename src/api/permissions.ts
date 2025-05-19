import axios, { AxiosResponse } from 'axios'

export const checkPermission = async ({
  clusterName,
  body,
}: {
  clusterName: string
  body: {
    group: string
    resource: string
    verb: 'create' | 'delete' | 'patch' | 'update'
    namespace: string
  }
}): Promise<
  AxiosResponse<{
    status: {
      allowed?: boolean
    }
  }>
> => {
  const data = JSON.stringify({
    apiVersion: 'authorization.k8s.io/v1',
    kind: 'SelfSubjectAccessReview',
    spec: {
      resourceAttributes: {
        ...body,
      },
    },
  })
  return axios.post(`/api/clusters/${clusterName}/k8s/apis/authorization.k8s.io/v1/selfsubjectaccessreviews`, data, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
