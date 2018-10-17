import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import pkg from './package.json'

const plugins = [
  json({
    preferConst: true
  }),
  resolve(), // so Rollup can find `resize-observer-polyfill`
  commonjs() // so Rollup can convert `resize-observer-polyfill` to an ES module
]

export default [
  {
    input: 'src/truncate-title.registered.js',
    output: { file: pkg.main, format: 'es' },
    plugins
  },
  {
    input: 'src/truncate-title.element.js',
    output: { file: pkg.module, format: 'es' },
    plugins
  }
]
