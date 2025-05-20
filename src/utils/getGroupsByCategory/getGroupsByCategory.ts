import { OpenAPIV2 } from 'openapi-types'
import { TApiGroupList, TBuiltinResourceTypeList } from 'localTypes/k8s'
import { checkIfBuiltInInstanceNamespaceScoped } from 'utils/openApi'

export const getGroupsByCategory = ({
  swagger,
  apiGroupListData,
  builtinResourceTypesData,
  namespace,
  noncrds = ['apps', 'autoscaling', 'batch', 'policy'],
}: {
  swagger: OpenAPIV2.Document | undefined
  namespace?: string
  apiGroupListData?: TApiGroupList
  builtinResourceTypesData?: TBuiltinResourceTypeList
  noncrds?: string[]
}): {
  crdGroups?: TApiGroupList['groups']
  nonCrdGroups?: TApiGroupList['groups']
  builtinGroups?: TBuiltinResourceTypeList['resources']
  apiExtensionVersion?: string
} => {
  const apiExtensionVersion = apiGroupListData?.groups?.find(({ name }) => name === 'apiextensions.k8s.io')
    ?.preferredVersion.version

  const crdGroups = apiGroupListData?.groups
    .filter(({ name }) => !noncrds.includes(name) && !name.includes('.k8s.io'))
    .sort((a, b) => a.name.localeCompare(b.name))

  const nonCrdGroups = apiGroupListData?.groups
    .filter(({ name }) => noncrds.includes(name) || name.includes('.k8s.io'))
    .sort((a, b) => a.name.localeCompare(b.name))

  const filteredBuiltinData =
    namespace && swagger
      ? builtinResourceTypesData?.resources?.filter(
          ({ name }) => checkIfBuiltInInstanceNamespaceScoped({ typeName: name, swagger }).isNamespaceScoped,
        )
      : builtinResourceTypesData?.resources

  return { crdGroups, nonCrdGroups, builtinGroups: filteredBuiltinData, apiExtensionVersion }
}
