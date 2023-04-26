import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { UnifiedViteWeappTailwindcssPlugin as uvwt } from 'weapp-tailwindcss-webpack-plugin/vite'
import postcss from './postcss.config'
import AutoImport from 'unplugin-auto-import/vite'
import path from 'path'

const isH5 = process.env.UNI_PLATFORM === 'h5'
const app = process.env.UNI_PLATFORM === 'app'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    ...(isH5 || app ? [] : [uvwt()]),
    AutoImport({
      imports: [
        'vue',
        'pinia',
        'uni-app'
      ],
      dirs: [
        'src/store',
        'src/hooks/**'
      ],
      dts: true, // or a custom path
      eslintrc: {
        enabled: true
      }
    })
  ],
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`
    }
  },
  css: {
    postcss
  }
})
