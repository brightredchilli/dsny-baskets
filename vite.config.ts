import { defineConfig } from 'vite'
import dsv from '@rollup/plugin-dsv';
import path from 'path';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  assetsInclude: ['**/*.geojson'],
  plugins: [dsv(), tailwindcss()],
  base: '/dsny-baskets', // github page is served at brightredchilli.github.io/dsny-baskets
  build: {
    outDir: 'dist/'
  },
  resolve: {
    alias: [
      { find: 'src', replacement: path.resolve(__dirname, 'src') },
    ],
  }
})
