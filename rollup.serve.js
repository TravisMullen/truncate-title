import build from './rollup.build.js'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
    input: build.input,
    output: build.output,
    plugins: [
      ...build.plugins,
      serve({
        open: true,
        contentBase: ['','dist']
      }),
      livereload({
        watch: ['src', 'index.html']
      })
    ]
  }
