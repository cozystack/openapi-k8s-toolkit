/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC } from 'react'
import { OpenAPIV2 } from 'openapi-types'
import { TJSON } from 'localTypes/JSON'

type TBlackholeFormProps = {
  staticProperties: OpenAPIV2.SchemaObject['properties']
  required?: string[]
  hiddenPaths?: string[][]
  expandedPaths?: string[][]
  persistedPaths?: string[][]
  prefillValuesSchema?: TJSON
  prefillValueNamespaceOnly?: string
  isNameSpaced?: false | string[]
  isCreate?: boolean
  type: 'builtin' | 'apis'
  apiGroupApiVersion: string
  kindName: string
  typeName: string
  backlink?: string | null
}

// const Editor = React.lazy(() => import('@monaco-editor/react'))

export const BlackholeForm: FC<TBlackholeFormProps> = ({
  staticProperties,
  required,
  hiddenPaths,
  expandedPaths,
  persistedPaths,
  prefillValuesSchema,
  prefillValueNamespaceOnly,
  isNameSpaced,
  isCreate,
  type,
  apiGroupApiVersion,
  kindName,
  typeName,
  backlink,
}) => {
  return <div>To be done</div>
}
