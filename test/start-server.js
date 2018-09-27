import { spawn } from 'child_process'

/**
 * Asynchronous process creation of a server for tests to run on.
 * Server should be configured for use by `npm run serve`, or alternate script name, in package.json.
 *
 * @param {npmScript} string Name of script in package.json which will start server.
 * @returns {child_process}
 * @example <caption>Stop server using `child_process.kill()`</caption>
 * // runningServer.kill()
 * const runningServer = startServer('npm-script-name')
 */
const startServer = (npmScript = 'serve') => {
  // start server
  const serv = spawn('npm', ['run', npmScript])
  // watch server output
  serv.stdout.on('data', data => {
    console.log(`stdout: ${data}`)
  })
  serv.stderr.on('data', data => {
    console.log(`stderr: ${data}`)
  })
  serv.on('close', code => {
    console.log(`Server has been stopped. Exit code: ${code}`)
  })
  return serv
}

export { startServer as default }
