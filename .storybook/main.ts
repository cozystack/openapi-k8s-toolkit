import type { StorybookConfig } from '@storybook/react-vite' // change to your renderer
import { mergeConfig } from 'vite'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(baseConfig) {
    return mergeConfig(baseConfig, {
      // 👇 key bit for GitHub Pages
      base: './',

      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),

          // 👇 Add our Storybook-only mocks for the hooks
          '../../../DynamicRendererWithProviders/multiQueryProvider': path.resolve(
            __dirname,
            './mocks/multiQueryProvider.tsx',
          ),
          '../../../DynamicRendererWithProviders/partsOfUrlContext': path.resolve(
            __dirname,
            './mocks/partsOfUrlContext.tsx',
          ),
        },
      },
    })
  },
}

export default config
