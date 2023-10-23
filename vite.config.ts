import { defineConfig } from 'vite'
import dsv from '@rollup/plugin-dsv';

export default defineConfig({
  assetsInclude: ['**/*.geojson'],
  plugins:[dsv()],
  base: '/dsny-baskets', // github page is served at brightredchilli.github.io/dsny-baskets
  build: {
    outDir: 'docs/'
  }
})
