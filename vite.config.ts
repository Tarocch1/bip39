import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  base: '/bip39/',
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  preview: { host: '0.0.0.0', port: 3000, open: 'http://localhost:3000' },
  server: { host: '0.0.0.0', port: 3000, open: 'http://localhost:3000' },
  plugins: [
    vue(),
    ui({
      autoImport: { dts: './src/typings/auto-imports.d.ts' },
      components: { dts: './src/typings/components.d.ts' },
      ui: { colors: { primary: 'blue', secondary: 'orange' } },
    }),
  ],
})
