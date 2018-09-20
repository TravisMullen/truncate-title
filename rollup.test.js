import pkg from './package.json'
import build from './rollup.build.js'
import serve from 'rollup-plugin-serve'

export default {
  input: build.input,
  output: build.output,
  plugins: [
    ...build.plugins,
    serve({
      port: pkg.config.ports.test,
      // 'test' must be first so rollup will grab that index.html
      // and not the demo index.html in ''
      contentBase: ['test', '', 'dist']
    })
  ]
}
