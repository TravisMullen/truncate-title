import resolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import pkg from './package.json'

const plugins = [
  json({
    preferConst: true
  }),
  resolve({
    modulesOnly: true
  })
]

export default [
  {
    input: 'src/truncate-title.registered.js',
    output: {
      name: 'truncateTitle',
      file: pkg.browser,
      format: 'es'
    },
    plugins
  },
  {
    input: 'src/truncate-title.element.js',
    external: ['resize-observer-polyfill'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins
  }]



// [
//   {
//     input: 'src/truncate-title.registered.js',
//     output: { file: pkg.main, format: 'es' },
//     plugins
//   },
//   {
//     input: 'src/truncate-title.registered.js',
//     output: { file: pkg.main, format: 'es' },
//     plugins
//   },
//   {
//     input: 'src/truncate-title.element.js',
//     output: { file: pkg.module, format: 'es' },
//     plugins
//   }
// ]
