import { TApiGroupList, TBuiltinResourceTypeList } from 'localTypes/k8s'
import { filterIfBuiltInInstanceNamespaceScoped } from 'utils/scopes/filterScopes'

export const getGroupsByCategory = async ({
  clusterName,
  apiGroupListData,
  builtinResourceTypesData,
  namespace,
  noncrds = ['apps', 'autoscaling', 'batch', 'policy'],
}: {
  clusterName: string
  namespace?: string
  apiGroupListData?: TApiGroupList
  builtinResourceTypesData?: TBuiltinResourceTypeList
  noncrds?: string[]
}): Promise<{
  crdGroups?: TApiGroupList['groups']
  nonCrdGroups?: TApiGroupList['groups']
  builtinGroups?: TBuiltinResourceTypeList['resources']
  apiExtensionVersion?: string
}> => {
  const apiExtensionVersion = apiGroupListData?.groups?.find(({ name }) => name === 'apiextensions.k8s.io')
    ?.preferredVersion.version

  const crdGroups = apiGroupListData?.groups
    .filter(({ name }) => !noncrds.includes(name) && !name.includes('.k8s.io'))
    .sort((a, b) => a.name.localeCompare(b.name))

  // const nonCrdGroups = apiGroupListData?.groups
  //   .filter(({ name }) => noncrds.includes(name) || name.includes('.k8s.io'))
  //   .sort((a, b) => a.name.localeCompare(b.name))
  const nonCrdGroups = apiGroupListData?.groups.sort((a, b) => a.name.localeCompare(b.name))

  const filteredBuiltinData = await filterIfBuiltInInstanceNamespaceScoped({
    namespace,
    data: builtinResourceTypesData,
    clusterName,
  })

  return { crdGroups, nonCrdGroups, builtinGroups: filteredBuiltinData, apiExtensionVersion }
}
