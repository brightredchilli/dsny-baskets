import { defineConfig } from 'vite'
import dsv from '@rollup/plugin-dsv';
import path from 'path';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  assetsInclude: ['**/*.geojson', '**/*.csv'],
  plugins: [tailwindcss()],
  base: '/dsny-baskets', // github page is served at brightredchilli.github.io/dsny-baskets
  build: {
    outDir: 'dist/'
  },
  worker: {
    format: 'es' // needed because worker has a top level await, and iife(default output format) is not compatible with it
  },
  resolve: {
    alias: [
      { find: 'src', replacement: path.resolve(__dirname, 'src') },
    ],
  }
})
