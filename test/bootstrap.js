/* eslint-env mocha */
/* global browser: false, page: false */

// @todo - update to @babel/..
import 'babel-register'
import 'babel-polyfill'

import pkg from '../package.json'

import puppeteer from 'puppeteer'
import { expect, assert } from 'chai'
import { swap, restore } from 'swap-global'

import startServer from './start-server.js'
import validateServer from './validate-server.js'

const opts = {
  headless: false,
  defaultViewport: {
    width: 800,
    height: 600
  },
  // slowMo: 100,
  waitUntil: 'domcontentloaded'
}

let testServer
// expose variables
before(async () => {
  testServer = startServer('test:serve')

  // shared browser session
  swap('browser', await puppeteer.launch(opts))
  // shared page state
  swap('page', await browser.newPage())
  // set testing properties
  swap('expect', expect)
  swap('assert', assert)
})

after(async () => {
  await testServer.kill()

  await page.close()

  await browser.close()

  await restore()
})

let testServerPort = 10001 // default port for rollup server.
// check for a port to be defined in package.json as config.ports.test
if (pkg.config &&
  pkg.config.ports &&
  pkg.config.ports.test) {
  testServerPort = pkg.config.ports.test
}
// confirm server is running!
validateServer(testServerPort)
