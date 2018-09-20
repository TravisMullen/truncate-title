
import puppeteer from 'puppeteer'
import { expect, assert } from 'chai'

const testServerPort = 10002

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
      process.exit(1)
    }
    assert.strictEqual(response.status(), 200)
    // expect([200, 304]).to.include(response.status());
  })
})
