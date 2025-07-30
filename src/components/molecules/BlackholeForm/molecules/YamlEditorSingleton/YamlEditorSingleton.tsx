/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
import React, { FC, useEffect, useState } from 'react'
import { theme as antdtheme, Flex, Button, Modal, Typography } from 'antd'
import Editor from '@monaco-editor/react'
import * as yaml from 'yaml'
import { useNavigate } from 'react-router-dom'
import { TRequestError } from 'localTypes/api'
import { TJSON } from 'localTypes/JSON'
import { createNewEntry, updateEntry } from 'api/forms'
import { Styled } from './styled'

type TYamlEditorSingletonProps = {
  theme: 'light' | 'dark'
  cluster: string
  prefillValuesSchema?: TJSON
  isNameSpaced?: boolean
  isCreate?: boolean
  type: 'builtin' | 'apis'
  apiGroupApiVersion: string
  typeName: string
  backlink?: string | null
  designNewLayout?: boolean
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
  designNewLayout,
  designNewLayoutHeight,
}) => {
  const { token } = antdtheme.useToken()
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
    const endpoint = `/api/clusters/${cluster}/k8s/${type === 'builtin' ? '' : 'apis/'}${apiGroupApiVersion}${
      isNameSpaced ? `/namespaces/${namespace}` : ''
    }/${typeName}/${isCreate ? '' : name}`
    if (isCreate) {
      createNewEntry({ endpoint, body })
        .then(res => {
          console.log(res)
          if (backlink) {
            navigate(backlink)
          }
          setIsLoading(false)
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
          setIsLoading(false)
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
      <Styled.ControlsRowContainer $bgColor={token.colorPrimaryBg} $designNewLayout={designNewLayout}>
        <Flex gap={designNewLayout ? 10 : 16} align="center">
          <Button type="primary" onClick={onSubmit} loading={isLoading}>
            Submit
          </Button>
          {backlink && <Button onClick={() => navigate(backlink)}>Cancel</Button>}
        </Flex>
      </Styled.ControlsRowContainer>
      {error && (
        <Modal
          open={!!error}
          onOk={() => setError(undefined)}
          // onClose={() => setError(undefined)}
          onCancel={() => setError(undefined)}
          title={
            <Typography.Text type="danger">
              <Styled.BigText>Error!</Styled.BigText>
            </Typography.Text>
          }
          cancelButtonProps={{ style: { display: 'none' } }}
        >
          An error has occurred: {error?.response?.data?.message}
        </Modal>
      )}
    </>
  )
}
