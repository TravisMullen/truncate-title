import pkg from './package.json'
import build from './rollup.build.js'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
  input: build[0].input,
  output: build[0].output,
  plugins: [
    ...build[0].plugins,
    serve({
      port: pkg.config.ports.serve,
      open: true,
      contentBase: ['', 'dist']
    }),
    livereload({
      watch: ['src', 'index.html']
    })
  ]
}
