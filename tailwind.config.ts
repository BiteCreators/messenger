import type { Config } from 'tailwindcss'

// @ts-ignore
import { tailwind } from '@byte-creators/config'

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
  plugins: [],
}

export default config
