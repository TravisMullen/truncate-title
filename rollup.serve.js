import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import pkg from './package.json'

export default [
  {
    input: 'src/truncation-title.element.js',
    output: { file: pkg.module, format: 'es' },
    plugins: [
      resolve(), // so Rollup can find `resize-observer-polyfill`
      commonjs(), // so Rollup can convert `resize-observer-polyfill` to an ES module
      serve({
        open: true,
        contentBase: ['','dist']
      }),
      livereload({
        watch: ['src', 'index.html']
      })
    ]
  }
]
