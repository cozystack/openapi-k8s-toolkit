/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useState, useEffect } from 'react'
import { YamlEditorSingleton as Editor } from 'components'
import { prepareTemplate } from 'utils/prepareTemplate'
import { TDynamicComponentsAppTypeMap } from '../../types'
import { useMultiQuery } from '../../../DynamicRendererWithProviders/multiQueryProvider'
import { usePartsOfUrl } from '../../../DynamicRendererWithProviders/partsOfUrlContext'
import { useTheme } from '../../../DynamicRendererWithProviders/themeContext'
import { parseMutliqueryText } from './utils'

export const YamlEditorSingleton: FC<{ data: TDynamicComponentsAppTypeMap['YamlEditorSingleton']; children?: any }> = ({
  data,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  children,
}) => {
  const { data: multiQueryData, isLoading: isMultiqueryLoading } = useMultiQuery()

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    cluster,
    isNameSpaced,
    type,
    apiGroup,
    apiVersion,
    typeName,
    prefillValuesRequestIndex,
    substractHeight,
    ...props
  } = data

  const [height, setHeight] = useState(0)

  useEffect(() => {
    const height = window.innerHeight - (substractHeight || 340)
    setHeight(height)

    const handleResize = () => {
      setHeight(height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [substractHeight])

  const theme = useTheme()
  const partsOfUrl = usePartsOfUrl()

  const replaceValues = partsOfUrl.partsOfUrl.reduce<Record<string, string | undefined>>((acc, value, index) => {
    acc[index.toString()] = value
    return acc
  }, {})

  const clusterPrepared = prepareTemplate({
    template: parseMutliqueryText({ text: cluster, multiQueryData }),
    replaceValues,
  })

  const apiGroupPrepared = prepareTemplate({
    template: parseMutliqueryText({ text: apiGroup, multiQueryData }),
    replaceValues,
  })

  const apiVersionPrepared = prepareTemplate({
    template: parseMutliqueryText({ text: apiVersion, multiQueryData }),
    replaceValues,
  })

  const typeNamePrepared = prepareTemplate({
    template: parseMutliqueryText({ text: typeName, multiQueryData }),
    replaceValues,
  })

  const prefillValues = multiQueryData[`req${prefillValuesRequestIndex}`]

  if (isMultiqueryLoading) {
    return <div>Loading multiquery</div>
  }

  return (
    <>
      <Editor
        cluster={clusterPrepared}
        theme={theme}
        prefillValuesSchema={prefillValues}
        isNameSpaced={isNameSpaced}
        isCreate={false}
        type={type}
        apiGroupApiVersion={type === 'builtin' ? 'api/v1' : `${apiGroupPrepared}/${apiVersionPrepared}`}
        typeName={typeNamePrepared}
        designNewLayout
        designNewLayoutHeight={height}
        {...props}
      />
      {children}
    </>
  )
}
