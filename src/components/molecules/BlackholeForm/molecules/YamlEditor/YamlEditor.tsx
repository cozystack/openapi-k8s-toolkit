/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
import React, { FC, useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import * as yaml from 'yaml'
import { Styled } from './styled'

type TYamlEditProps = {
  theme: 'light' | 'dark'
  currentValues: Record<any, unknown>
  onChange: (values: Record<string, unknown>) => void
}

export const YamlEditor: FC<TYamlEditProps> = ({ theme, currentValues, onChange }) => {
  const [yamlData, setYamlData] = useState<string>('')

  useEffect(() => {
    setYamlData(yaml.stringify(currentValues))
  }, [currentValues])

  return (
    <Styled.BorderRadiusContainer>
      <Editor
        defaultLanguage="yaml"
        width="100%"
        height="100%"
        value={yamlData}
        onChange={value => {
          onChange(yaml.parse(value || ''))
          setYamlData(value || '')
        }}
        theme={theme === 'dark' ? 'vs-dark' : theme === undefined ? 'vs-dark' : 'vs'}
        options={{
          theme: theme === 'dark' ? 'vs-dark' : theme === undefined ? 'vs-dark' : 'vs',
        }}
      />
    </Styled.BorderRadiusContainer>
  )
}
