/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
import React, { FC, useEffect, useState } from 'react'
import { Alert, Button } from 'antd'
import Editor from '@monaco-editor/react'
import * as yaml from 'yaml'
import { useNavigate } from 'react-router-dom'
import { TRequestError } from 'localTypes/api'
import { TJSON } from 'localTypes/JSON'
import { createNewEntry, updateEntry } from 'api/forms'
import { Spacer } from 'components/atoms'
import { Styled } from './styled'

type TYamlEditorSingletonProps = {
  theme: 'light' | 'dark'
  cluster: string
  prefillValuesSchema?: TJSON
  isNameSpaced?: false | string[]
  isCreate?: boolean
  type: 'builtin' | 'apis'
  apiGroupApiVersion: string
  typeName: string
  backlink?: string | null
  designNewLayoutHeight?: number
}

export const YamlEditorSingleton: FC<TYamlEditorSingletonProps> = ({
  theme,
  cluster,
  prefillValuesSchema,
  isNameSpaced,
  isCreate,
  type,
  apiGroupApiVersion,
  typeName,
  backlink,
  designNewLayoutHeight,
}) => {
  const navigate = useNavigate()

  const [yamlData, setYamlData] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<TRequestError>()

  useEffect(() => {
    setYamlData(yaml.stringify(prefillValuesSchema))
  }, [prefillValuesSchema])

  const onSubmit = () => {
    setIsLoading(true)
    setError(undefined)
    const currentValues = yaml.parse(yamlData)
    const { namespace } = currentValues.metadata as { namespace?: string }
    const { name } = currentValues.metadata as { name?: string }
    const body = currentValues
    const endpoint = `/api/clusters/${cluster}/k8s/${type === 'builtin' ? 'api' : 'apis'}/${apiGroupApiVersion}${
      isNameSpaced ? `/namespaces/${namespace}` : ''
    }/${typeName}/${isCreate ? '' : name}`
    if (isCreate) {
      createNewEntry({ endpoint, body })
        .then(res => {
          console.log(res)
          if (backlink) {
            navigate(backlink)
          }
        })
        .catch(error => {
          console.log('Form submit error', error)
          setIsLoading(false)
          setError(error)
        })
    } else {
      updateEntry({ endpoint, body })
        .then(res => {
          console.log(res)
          if (backlink) {
            navigate(backlink)
          }
        })
        .catch(error => {
          console.log('Form submit error', error)
          setIsLoading(false)
          setError(error)
        })
    }
  }

  return (
    <>
      {error && <Alert message={`An error has occurred: ${error?.response?.data?.message} `} type="error" />}
      <Styled.BorderRadiusContainer $designNewLayoutHeight={designNewLayoutHeight}>
        <Editor
          defaultLanguage="yaml"
          width="100%"
          height={designNewLayoutHeight || '75vh'}
          value={yamlData}
          onChange={value => {
            setYamlData(value || '')
          }}
          theme={theme === 'dark' ? 'vs-dark' : theme === undefined ? 'vs-dark' : 'vs'}
          options={{
            theme: theme === 'dark' ? 'vs-dark' : theme === undefined ? 'vs-dark' : 'vs',
          }}
        />
      </Styled.BorderRadiusContainer>
      <Spacer $space={12} $samespace />
      <Button type="primary" onClick={onSubmit} loading={isLoading}>
        Submit
      </Button>
    </>
  )
}
