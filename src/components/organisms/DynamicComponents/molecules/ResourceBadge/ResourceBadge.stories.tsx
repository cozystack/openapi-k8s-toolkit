import type { Meta, StoryObj } from '@storybook/react'
import React, { CSSProperties } from 'react'
import Editor from '@monaco-editor/react'
import * as yaml from 'yaml'
import { ResourceBadge } from './ResourceBadge'

// Storybook-only mocks (aliased in .storybook/main.ts via viteFinal)
import { MultiQueryMockProvider } from '../../../../../../.storybook/mocks/multiQueryProvider'
import { PartsOfUrlMockProvider } from '../../../../../../.storybook/mocks/partsOfUrlContext'
import { ThemeProvider } from '../../../../../../.storybook/mocks/themeContext'

type ResourceBadgeInner = {
  id: number | string
  value: string // to get color and maybe abbr
  abbreviation?: string
  style?: CSSProperties
}

type ProviderArgs = {
  isLoading: boolean
  isError: boolean
  errors: { message: string }[]
  multiQueryData: Record<string, unknown> | null
  partsOfUrl: string[]
  theme: 'dark' | 'light'
}

type Args = ResourceBadgeInner & ProviderArgs

const meta: Meta<Args> = {
  title: 'Factory/ResourceBadge',
  component: ResourceBadge as any,
  // Expose *inner* fields as top-level controls
  argTypes: {
    id: { control: 'text', description: 'data.id' },
    value: { control: 'text', description: 'data.value' },
    abbreviation: { control: 'text', description: 'data.abbreviation' },
    style: { control: 'object', description: 'data.style' },

    // provider knobs
    isLoading: { control: 'boolean' },
    isError: { control: 'boolean' },
    errors: { control: 'object' },
    multiQueryData: { control: 'object' },
    partsOfUrl: { control: 'object' },
    theme: { options: ['dark', 'light'], control: { type: 'radio' } },
  },

  // Map flat args -> component's { data } prop
  render: args => (
    <>
      <ThemeProvider value={{ theme: args.theme }}>
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
              <ResourceBadge
                data={{
                  id: args.id,
                  value: args.value,
                  abbreviation: args.abbreviation,
                  style: args.style,
                }}
              />
            </div>
          </PartsOfUrlMockProvider>
        </MultiQueryMockProvider>
      </ThemeProvider>
      <Editor
        defaultLanguage="yaml"
        width="100%"
        height={150}
        value={yaml.stringify({
          type: 'ResourceBadge',
          data: {
            id: args.id,
            value: args.value,
            abbreviation: args.abbreviation,
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
    id: 'example-resource-badge',
    value: "{reqsJsonPath[0]['.data.block.componentName']['-']}",

    // providers
    isLoading: false,
    isError: false,
    errors: [],
    multiQueryData: {
      req0: {
        data: {
          block: {
            componentName: 'Pod',
          },
        },
      },
    },
    partsOfUrl: [],
    theme: 'light',
  },
}

export const AnotherValueExample: Story = {
  args: {
    ...Default.args,
    value: 'namespace',
  },
}

export const WithAbbreviation: Story = {
  args: {
    ...Default.args,
    value: 'namespace',
    abbreviation: 'NS',
  },
}

export const AutoUppercase: Story = {
  args: {
    ...Default.args,
    value: 'VirtualMachine',
  },
}

export const AutoUppercaseLong: Story = {
  args: {
    ...Default.args,
    value: 'CustomColumnsOverrideCustomColumnsOverride',
    style: {
      width: '4rem',
    },
  },
}

export const CustomStyle: Story = {
  args: {
    ...Default.args,
    style: {
      fontWeight: 'bold',
    },
  },
}

export const CustomSize: Story = {
  args: {
    ...Default.args,
    style: {
      width: '2.5rem',
      height: '2.5rem',
    },
  },
}
