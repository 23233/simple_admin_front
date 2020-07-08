import { defineConfig } from 'umi';
import { Routes } from './src/router';


// @ts-ignore
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: Routes,

  proxy: {
    '/api/': {
      target: 'http://127.0.0.1:8080',
      changeOrigin: true,
      pathRewrite: {
        '^/api/': '',
      },
    },
  },
  headScripts: [
    {
      content: IS_PROD ? `window.sp_prefix = '{{.prefix}}';` : `window.sp_prefix = 'admin';`,
    },
  ],
  outputPath: 'simple_admin_templates',
  publicPath: '/simple_admin_static/',
});
