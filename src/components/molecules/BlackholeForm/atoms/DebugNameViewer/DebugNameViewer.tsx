import React, { FC } from 'react'
import { TFormName } from 'localTypes/form'

type TDebugNameViewerProps = {
  name: TFormName
  arrKey?: number
  arrName?: TFormName
  persistName?: TFormName
  expandName?: TFormName
}

export const DebugNameViewer: FC<TDebugNameViewerProps> = ({ name, arrKey, arrName, persistName, expandName }) => {
  return (
    <div>
      <div>Name: {JSON.stringify(name)}</div>
      <div>Arr Key: {JSON.stringify(arrKey)}</div>
      <div>Arr Name: {JSON.stringify(arrName)}</div>
      <div>Persisted Name: {JSON.stringify(persistName)}</div>
      <div>Expand Name: {JSON.stringify(expandName)}</div>
    </div>
  )
}
