import { defineConfig } from 'umi';
import { Routes } from './src/router';


// @ts-ignore
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  dynamicImport: {},
  analyze: {
    analyzerMode: 'server',
    analyzerPort: 8888,
    openAnalyzer: true,
    // generate stats file while ANALYZE_DUMP exist
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info',
    defaultSizes: 'parsed', // stat  // gzip
  },
  routes: Routes,
  title: false,
  proxy: {
    '/api/': {
      target: 'http://127.0.0.1:7788',
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
