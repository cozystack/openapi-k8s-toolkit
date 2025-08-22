// src/components/ParsedText/ParsedText.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import React, { CSSProperties } from 'react'
import Editor from '@monaco-editor/react'
import * as yaml from 'yaml'
import { TUnitInput } from './types'
import { ConverterBytes } from './ConverterBytes'

// Storybook-only mocks (aliased in .storybook/main.ts via viteFinal)
import { MultiQueryMockProvider } from '../../../../../../.storybook/mocks/multiQueryProvider'
import { PartsOfUrlMockProvider } from '../../../../../../.storybook/mocks/partsOfUrlContext'

type ConverterBytesInner = {
  id: number | string
  bytesValue: string // reqs
  unit?: TUnitInput // do not enter if wanna auto format
  /** If true, returns "12.3 GiB" instead of just 12.3 */
  format?: boolean
  /** Max fraction digits when formatting (default 2) */
  precision?: number
  /** Locale for number formatting (default: undefined => user agent) */
  locale?: string
  standard?: 'si' | 'iec'
  notANumberText?: string
  style?: CSSProperties
}

type ProviderArgs = {
  isLoading: boolean
  isError: boolean
  errors: { message: string }[]
  multiQueryData: Record<string, unknown> | null
  partsOfUrl: string[]
}

type Args = ConverterBytesInner & ProviderArgs

const meta: Meta<Args> = {
  title: 'Factory/ConverterBytes',
  component: ConverterBytes as any,
  // Expose *inner* fields as top-level controls
  argTypes: {
    id: { control: 'text', description: 'data.id' },
    bytesValue: { control: 'text', description: 'data.bytesValue' },
    unit: { control: 'text', description: 'data.unit' },
    format: { control: { type: 'boolean' }, description: 'data.format' },
    precision: { control: 'number', description: 'data.precision' },
    locale: { control: 'text', description: 'data.locale' },
    standard: { options: ['si', 'iec'], control: { type: 'radio' }, description: 'data.standard' },
    notANumberText: { control: 'text', description: 'data.locale' },
    style: { control: 'object', description: 'data.style' },

    // provider knobs
    isLoading: { control: 'boolean' },
    isError: { control: 'boolean' },
    errors: { control: 'object' },
    multiQueryData: { control: 'object' },
    partsOfUrl: { control: 'object' },
  },

  // Map flat args -> component's { data } prop
  render: args => (
    <>
      <MultiQueryMockProvider
        value={{
          isLoading: args.isLoading,
          isError: args.isError,
          errors: args.errors,
          data: args.multiQueryData,
        }}
      >
        <PartsOfUrlMockProvider value={{ partsOfUrl: args.partsOfUrl }}>
          <div style={{ padding: 16 }}>
            <ConverterBytes
              data={{
                id: args.id,
                bytesValue: args.bytesValue,
                unit: args.unit,
                format: args.format,
                precision: args.precision,
                locale: args.locale,
                standard: args.standard,
                notANumberText: args.notANumberText,
                style: args.style,
              }}
            />
          </div>
        </PartsOfUrlMockProvider>
      </MultiQueryMockProvider>
      <Editor
        defaultLanguage="yaml"
        width="100%"
        height={150}
        value={yaml.stringify({
          type: 'ConverterBytes',
          data: {
            id: args.id,
            bytesValue: args.bytesValue,
            unit: args.unit,
            format: args.format,
            precision: args.precision,
            locale: args.locale,
            standard: args.standard,
            notANumberText: args.notANumberText,
            style: args.style,
          },
        })}
        theme={'vs-dark'}
        options={{
          theme: 'vs-dark',
          readOnly: true,
        }}
      />
    </>
  ),

  parameters: {
    controls: { expanded: true },
  },
}
export default meta

type Story = StoryObj<Args>

export const Default: Story = {
  args: {
    id: 'example-converter-bytes',
    bytesValue: "{reqsJsonPath[0]['.data.block.bytes']['-']}",
    format: true,
    style: { fontSize: 24 },

    // providers
    isLoading: false,
    isError: false,
    errors: [],
    multiQueryData: { req0: { data: { block: { bytes: 123456 } } } },
    partsOfUrl: [],
  },
}

export const Unit: Story = {
  args: {
    ...Default.args,
    unit: 'Mi',
  },
}

export const FormatOff: Story = {
  args: {
    ...Default.args,
    unit: 'k',
    format: false,
  },
}

export const Precision: Story = {
  args: {
    ...Default.args,
    precision: 5,
  },
}

export const Locale: Story = {
  args: {
    ...Default.args,
    locale: 'de-DE',
  },
}

export const Standard: Story = {
  args: {
    ...Default.args,
    standard: 'iec',
  },
}

export const Error: Story = {
  args: {
    ...Default.args,
    id: 'example-converter-bytes',
    bytesValue: "{reqsJsonPath[0]['.data.block.bytessss']['-']}",
    notANumberText: '0',
  },
}
