import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

export default defineConfig({
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
    wasm(),
    topLevelAwait(),
  ],
})
