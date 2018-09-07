import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import pkg from './package.json'

export default [
  // browser-friendly UMD build
  {
    input: 'src/truncation-title.element.js',
    output: [
      {
        name: 'statefulButton',
        file: pkg.browser,
        format: 'umd'
      },
      { file: pkg.module, format: 'es' },
      { file: pkg.main, format: 'cjs' }
    ],
    plugins: [
      resolve(), // so Rollup can find `resize-observer-polyfill`
      commonjs() // so Rollup can convert `resize-observer-polyfill` to an ES module
    ]
  }
]
