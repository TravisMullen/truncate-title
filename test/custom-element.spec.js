// /* eslint-env mocha */
// /* eslint-disable no-unused-vars */

// import service from './ventriloquist.js'

// service.addMethod('headline')
// // service.addMethod('is')

// const CUSTOM_ELEMENT = 'example-element'
// // /* eslint-env mocha */
// // /* global browser: false, page: false, assert: false, expect: false */

// const EXTENDED_ELEMENT = null
// // const CUSTOM_EVENT_TYPE = 'trigger-item'

// const testElementId = 'this-element-is-for-testing-only'

// let customElementCreate
// // let emittedEvents // pointer to window.emittedEvents
// // const emittedEventsListener = ({ detail, timeStamp }) => {
// //   window.emittedEvents.push({ type, timeStamp, detail })
// // }
// // let docHandle // to removeEventListener

// describe(`Testing ${CUSTOM_ELEMENT}[is="${EXTENDED_ELEMENT}"]`, () => {
//   // set-up and remove fresh instance for each test
//   beforeEach(async () => {
//     customElementCreate = await service.createCustomElementHandle(CUSTOM_ELEMENT, EXTENDED_ELEMENT, {
//       id: testElementId
//     })
//   })
//   afterEach(async () => {
//     // await service.removeCustomElementHandle(customElementCreate)
//   })

//   describe(`display as expected for initial page render`, () => {
//     it('should render match id of test element', async () => {
//       await page.waitFor(CUSTOM_ELEMENT)
//       const idValue = await page.$eval(CUSTOM_ELEMENT, e => e.id)
//       console.log('Test element id: ', idValue, testElementId)
//       expect(idValue).to.equal(testElementId)
//     })
//     it('should render title attribute as textContent', async () => {
//       const testValue = 'Some short text.'

//       await page.waitFor(CUSTOM_ELEMENT)
//       const elementHandle = await service.customElementHandle(CUSTOM_ELEMENT)
//       // const setIs = await service.setIs(elementHandle, EXTENDED_ELEMENT)
//       // // change property value
//       // // const doUpdate = await page.evaluateHandle((el, update) => el.headline = update, elementHandle, testValue);
//       const setHeadline = await service.setHeadline(elementHandle, testValue)
//       // const updatedValue = await page.$eval(BASE_ELEMENT, e => e.headline);
//       // const getTextContent = await service.shadowRootHandle('h1')
//       const getTextContent = await service.textContent(elementHandle, 'h1')

//       console.log('h1: ', await getTextContent.jsonValue())
//       // // confirm it matches
//       // expect(await await getTextContent).to.equal(testValue)

//       console.log('Test element id: ', await getTextContent)
//       // await elementHandle.dispose()
//       // await setHeadline.dispose()
//     })
//   })
// })
