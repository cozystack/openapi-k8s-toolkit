/* eslint-disable no-console */
import React, { FC } from 'react'
import { XTerminal } from './molecules'

export type TPodTerminalProps = {
  cluster: string
  namespace: string
  podName: string
}

export const PodTerminal: FC<TPodTerminalProps> = ({ cluster, namespace, podName }) => {
  const endpoint = `/api/clusters/${cluster}/openapi-bff-ws/terminal/terminalPod/terminalPod`

  return (
    <XTerminal endpoint={endpoint} namespace={namespace} podName={podName} key={`${cluster}-${namespace}-${podName}`} />
  )
}
