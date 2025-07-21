import { defineConfig } from 'vite'
import dsv from '@rollup/plugin-dsv';
import path from 'path';

export default defineConfig({
  assetsInclude: ['**/*.geojson'],
  plugins: [dsv()],
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
