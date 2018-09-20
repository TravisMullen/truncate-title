// @todo - update to @babel
import 'babel-register'
import 'babel-polyfill'

import { swap, restore, pending, inMemory } from './swap-globals.js'

import puppeteer from 'puppeteer'
import { expect, assert } from 'chai'

const opts = {
  headless: false,
  slowMo: 100,
  timeout: 10000,
  waitUntil: 'domcontentloaded'
}

// expose variables
before(async () => {

  // shared browser session
  swap('browser', await puppeteer.launch(opts))
  // shared page state
  swap('page', await browser.newPage())

  swap('expect', expect)
  swap('assert', assert)

  console.log(`global pointers to be swapped (includes previously undefined) - ${pending()}`)
  console.log(`any global variables that preexisted and will be held in alternative memory pointers - ${inMemory()}`)
})

const testServerPort = 10001

describe('Validate Testing Server', function () {
  it('Component Should Load Successfully from Testing Server.', async () => {
    let response
    try {
      response = await page.goto(`http://localhost:${testServerPort}/`, {
        timeout: 0,
        waitUntil: 'domcontentloaded'
      })
      console.log('Response Status: ' + response.status())
    } catch (err) {
      console.warn(
        `
        Test Server is not running! 

  ${err}




        Stopping tests.



        use \`npm run test:serve\`


        then run \`npm run test\` 
        in new terminal/shell session.



        `)
      // console.log('Start your test server!')
      process.exit(0)
    }
    assert.strictEqual(response.status(), 200)
    // expect([200, 304]).to.include(response.status());
  })
})


// const { swap, restore, pending, inMemory } = require('./manageGlobals.js')

// // puppeteer options
// const opts = {
//   headless: false,
//   slowMo: 100,
//   timeout: 10000,
//   waitUntil: 'domcontentloaded'
// }

// // expose variables
// before(async () => {
//   // shared browser session
//   swap('browser', await puppeteer.launch(opts))
//   // shared page state
//   swap('page', await browser.newPage())

//   swap('expect', expect)
//   swap('assert', assert)

//   console.log(`global pointers to be swapped (includes previously undefined) - ${pending()}`)
//   console.log(`any global variables that preexisted and will be held in alternative memory pointers - ${inMemory()}`)
// })

// // close browser and reset global variables
// after(async () => {
//   console.log('closing page...');
//   await page.close();
//   console.log('page closed.');
//   await browser.close();

//   const restored = await restore()
//   console.log(`global pointers that have be returned to state of proir to test...
//     - ${restored}
//   `)
//   console.log(`global memory swaps still being held (should be none) - ${inMemory()} - ${pending()}`)
// })

// // confirm server is running!
// require('./tools/validate-server.js')

// console.log('bootstrap loaded!')
