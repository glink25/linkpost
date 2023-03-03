import { transformWithEsbuild, defineConfig, Plugin } from 'vite'
import { readFile, writeFile } from "fs/promises";
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue'
import UnoCSS from "unocss/vite";
import mkcert from "vite-plugin-mkcert";

import { presetIcons, transformerDirectives, presetWind } from "unocss";


const readJsonFile = async (path: string) =>
  JSON.parse(
    await readFile(
      resolve(__dirname, `./node_modules/${path}`), { encoding: 'utf-8' }
    )
  )

const SWPlugin = (): Plugin => {
  return {
    name: 'sw-plugin',
    async config() {
      const file = await readFile('src/sw.ts', 'utf-8')
      const code = await transformWithEsbuild(file.replace('export { }', ''), 'sw.ts')
      // console.log(code)
      await writeFile('public/sw.js', code.code)

    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    https: true,
    headers: {
      'Service-Worker-Allowed': '/'
    }
  },
  plugins: [
    vue(),
    UnoCSS({
      presets: [
        presetWind(),
        presetIcons({
          collections: {
            material: () => readJsonFile('@iconify-json/mdi/icons.json').then(i => i.default),
          }
        }),
      ],
      transformers: [transformerDirectives()]
    }),
    SWPlugin(),
    mkcert()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'lib': resolve(__dirname, './src/lib'),
    },
  },
}))
