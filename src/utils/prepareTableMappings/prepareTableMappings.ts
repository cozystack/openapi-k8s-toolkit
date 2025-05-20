import { matchPath } from 'react-router-dom'
import { TTableMappingData } from 'localTypes/richTable'
import { prepareTemplate } from '../prepareTemplate'

export const prepareTableMappings = ({
  data,
  clusterName,
  projectName,
  instanceName,
  namespace,
  syntheticProject,
  entryType,
  apiGroup,
  apiVersion,
  typeName,
  entryName,
  apiExtensionVersion,
  crdName,
  pathname,
}: {
  data: Partial<TTableMappingData>[]
  clusterName?: string
  projectName?: string
  instanceName?: string
  namespace?: string
  syntheticProject?: string
  entryType?: string
  apiGroup?: string
  apiVersion?: string
  typeName?: string
  entryName?: string
  apiExtensionVersion?: string
  crdName?: string
  pathname: string
}): { pathToNavigate?: string; keysToParse?: string[] } | undefined => {
  const preparedData = data.map(({ pathToMatch, pathToNavigate, keysToParse }) => ({
    pathToMatch: pathToMatch
      ? prepareTemplate({
          template: pathToMatch,
          replaceValues: {
            clusterName,
            projectName,
            instanceName,
            namespace,
            syntheticProject,
            entryType,
            apiGroup,
            apiVersion,
            typeName,
            entryName,
            apiExtensionVersion,
            crdName,
          },
        })
      : undefined,
    pathToNavigate: pathToNavigate
      ? prepareTemplate({
          template: pathToNavigate,
          replaceValues: {
            clusterName,
            projectName,
            instanceName,
            namespace,
            syntheticProject,
            entryType,
            apiGroup,
            apiVersion,
            typeName,
            entryName,
            apiExtensionVersion,
            crdName,
          },
        })
      : undefined,
    keysToParse,
  }))

  return preparedData.find(({ pathToMatch }) => (pathToMatch ? matchPath(pathToMatch, pathname) : false))
}
