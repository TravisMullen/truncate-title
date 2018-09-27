/* eslint-env mocha */
/* global page: false, assert: false */

const validateServer = (serverPort = 10001) => {
  describe('Validate Testing Server', function () {
    it(`should be running on port ${serverPort}`, async () => {
      let response
      try {
        response = await page.goto(`http://localhost:${serverPort}/`, {
          timeout: 0,
          waitUntil: 'domcontentloaded'
        })
        console.log(`

        Server is running on port: ${serverPort}
        
        Response Status: ${response.status()}


        `)
      } catch (err) {
        console.warn(`

        Test Server is not running! 

  ${err}




        Stopping tests.

        `)
        process.exit(0)
      }
      assert.strictEqual(response.status(), 200)
      // expect([200, 304]).to.include(response.status())
    })
  })
}

export { validateServer as default }
