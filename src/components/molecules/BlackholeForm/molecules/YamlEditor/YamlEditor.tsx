/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
import React, { FC, useEffect, useRef, useState } from 'react'
import { theme as antdtheme } from 'antd'
import Editor from '@monaco-editor/react'
import type * as monaco from 'monaco-editor'
import * as yaml from 'yaml'
import { Styled } from './styled'

type TYamlEditProps = {
  theme: 'light' | 'dark'
  currentValues: Record<any, unknown>
  onChange: (values: Record<string, unknown>) => void
  editorUri: string
}

export const YamlEditor: FC<TYamlEditProps> = ({ theme, currentValues, onChange, editorUri }) => {
  const { token } = antdtheme.useToken()
  const [yamlData, setYamlData] = useState<string>('')

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<typeof monaco | null>(null)
  const isFocusedRef = useRef<boolean>(false)
  const pendingExternalYamlRef = useRef<string | null>(null)
  const isApplyingExternalUpdateRef = useRef<boolean>(false)

  useEffect(() => {
    const next = yaml.stringify(currentValues, {
      // Use literal block scalar for multiline strings
      blockQuote: 'literal',
      // Preserve line breaks
      lineWidth: 0,
      // Use double quotes for strings that need escaping
      doubleQuotedAsJSON: false,
    })
    if (isFocusedRef.current) {
      // Defer applying external updates to avoid cursor jumps while typing
      pendingExternalYamlRef.current = next ?? ''
      return
    }
    setYamlData(next ?? '')
  }, [currentValues])

  useEffect(() => {
    // Keep one stable model and enforce yaml language
    const editor = editorRef.current
    const monaco = monacoRef.current
    if (editor && monaco) {
      if (isFocusedRef.current) return
      const uri = monaco.Uri.parse(editorUri)
      let model = editor.getModel() || monaco.editor.getModel(uri)

      if (!model) {
        model = monaco.editor.createModel(yamlData ?? '', 'yaml', uri)
      }

      if (model) {
        monaco.editor.setModelLanguage(model, 'yaml')
        const current = model.getValue()

        if ((yamlData ?? '') !== current) {
          // Mark that we are applying an external update so onChange is ignored once
          isApplyingExternalUpdateRef.current = true
          model.setValue(yamlData ?? '')
        }
      }
    }
  }, [yamlData, editorUri])

  return (
    <Styled.BorderRadiusContainer $colorBorder={token.colorBorder}>
      <Editor
        language="yaml"
        path={editorUri}
        keepCurrentModel
        width="100%"
        height="100%"
        defaultValue={yamlData ?? ''}
        onMount={(editor: monaco.editor.IStandaloneCodeEditor, m: typeof monaco) => {
          editorRef.current = editor
          monacoRef.current = m
          // initialize focus state and listeners to control external updates while typing
          try {
            isFocusedRef.current = !!editor.hasTextFocus?.()
          } catch {
            isFocusedRef.current = false
          }
          editor.onDidFocusEditorText(() => {
            isFocusedRef.current = true
          })
          editor.onDidBlurEditorText(() => {
            isFocusedRef.current = false
            // Apply any deferred external update after blur
            if (pendingExternalYamlRef.current !== null) {
              setYamlData(pendingExternalYamlRef.current)
              pendingExternalYamlRef.current = null
            }
          })
          const uri = m.Uri.parse('inmemory://openapi-ui/form.yaml')
          let model = editor.getModel() || m.editor.getModel(uri)
          if (!model) {
            model = m.editor.createModel(yamlData ?? '', 'yaml', uri)
          }
          if (model) {
            m.editor.setModelLanguage(model, 'yaml')
          }
        }}
        onChange={value => {
          // Ignore changes that come from our own programmatic model.setValue
          if (isApplyingExternalUpdateRef.current) {
            isApplyingExternalUpdateRef.current = false
            setYamlData(value || '')
            return
          }
          try {
            onChange(yaml.parse(value || ''))
          } catch {
            // ignore parse errors while typing
          }
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
