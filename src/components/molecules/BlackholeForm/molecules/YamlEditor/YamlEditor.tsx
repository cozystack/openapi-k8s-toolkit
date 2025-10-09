/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useMemo, useRef, useEffect } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import * as YAML from 'yaml'

type TYamlEditProps = {
  theme: 'light' | 'dark'
  currentValues: Record<string, unknown>
  onChange: (values: Record<string, unknown>) => void
}

const MODEL_PATH = 'cozystack/blackhole.yaml'
const MODEL_URI = 'inmemory://cozystack/blackhole.yaml'

export const YamlEditor: FC<TYamlEditProps> = ({ theme, currentValues, onChange }) => {
  const uriRef = useRef<any>(null)

  const yamlText = useMemo(() => {
    try {
      return YAML.stringify(currentValues ?? {}, { lineWidth: 120 })
    } catch {
      return ''
    }
  }, [currentValues])

  const handleChange = (val?: string) => {
    try {
      const obj = YAML.parse(val || '') as Record<string, unknown> | null
      onChange(obj && typeof obj === 'object' ? obj : {})
    } catch {
      /* ignore parse errors until valid */
    }
  }

  const onMount: OnMount = (editor, monaco) => {
    const uri = monaco.Uri.parse(MODEL_URI)
    uriRef.current = uri
    const existing = monaco.editor.getModel(uri)
    const model = existing ?? monaco.editor.createModel(yamlText, 'yaml', uri)
    if (!existing) monaco.editor.setModelLanguage(model, 'yaml')
    editor.setModel(model)
  }

  useEffect(() => {
    const monacoAny = (window as any).monaco
    const model = uriRef.current ? monacoAny?.editor?.getModel(uriRef.current) : undefined
    if (model && model.getValue() !== yamlText) model.setValue(yamlText)
  }, [yamlText])

  return (
    <Editor
      language="yaml"
      theme={theme === 'dark' ? 'vs-dark' : 'light'}
      value={yamlText}
      onChange={handleChange}
      onMount={onMount}
      path={MODEL_PATH}
      keepCurrentModel
      options={{ minimap: { enabled: false }, automaticLayout: true }}
    />
  )
}

export default YamlEditor
