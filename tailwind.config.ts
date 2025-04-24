import type { Config } from 'tailwindcss'
import fs from 'fs'
import path from 'path'
//@ts-ignore
import { tailwind } from '@byte-creators/config'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  ...tailwind,
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/application/**/*.{js,ts,jsx,tsx}',
    './src/features/**/*.{js,ts,jsx,tsx}',
    './src/widgets/**/*.{js,ts,jsx,tsx}',
    './node_modules/@byte-creators/ui-kit/dist/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [
    ...(tailwind.plugins || []),
    plugin(({ addBase, theme }) => {
      let cssVars = ':root {\n'

      const generateCssVars = (config: Record<string, any>, prefix: string) => {
        Object.entries(config).forEach(([property, propertyValue]) => {
          if (property === 'global-hover' || property === 'no-hover') {
            return
          }

          if (
            typeof propertyValue === 'object' &&
            propertyValue !== null &&
            !Array.isArray(propertyValue)
          ) {
            Object.entries(propertyValue).forEach(([shade, shadeValue]) => {
              if (typeof shadeValue === 'string') {
                cssVars += `  --${prefix}-${property}-${shade}: ${shadeValue};\n`
                addBase({
                  ':root': {
                    [`--${prefix}-${property}-${shade}`]: shadeValue,
                  },
                })
              }
            })
          } else if (Array.isArray(propertyValue)) {
            const [size, { lineHeight }] = propertyValue

            cssVars += `  --${prefix}-${property}: ${size};\n`
            cssVars += `  --${prefix}-${property}-line-height: ${lineHeight};\n`

            addBase({
              ':root': {
                [`--${prefix}-${property}`]: size,
                [`--${prefix}-${property}-line-height`]: lineHeight,
              },
            })
          } else {
            cssVars += `  --${prefix}-${property}: ${propertyValue};\n`
            addBase({
              ':root': {
                [`--${prefix}-${property}`]: propertyValue,
              },
            })
          }
        })
      }

      if (theme('colors')) {
        generateCssVars(theme('colors'), 'color')
      }
      if (theme('fontSize')) {
        generateCssVars(theme('fontSize'), 'font-size')
      }
      if (theme('screens')) {
        generateCssVars(theme('screens'), 'screen')
      }

      cssVars += '}\n'

      fs.writeFileSync(path.resolve(__dirname, 'src', 'styles', 'vars.css'), cssVars, 'utf8')
    }),
  ],
}

export default config
