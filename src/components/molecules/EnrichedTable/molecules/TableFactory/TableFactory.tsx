import React, { FC } from 'react'
import { DynamicRendererWithProviders, DynamicComponents } from 'components/organisms'
import '@xterm/xterm/css/xterm.css'

type TTableFactoryProps = {
  theme: 'dark' | 'light'
  record: unknown
  customProps: unknown
}

export const TableFactory: FC<TTableFactoryProps> = ({ record, customProps, theme }) => {
  if (!customProps) {
    return null
  }

  return (
    <DynamicRendererWithProviders
      urlsToFetch={[]}
      dataToApplyToContext={record}
      theme={theme}
      // nodeTerminalDefaultProfile={}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items={customProps as any}
      components={DynamicComponents}
    />
  )
}
