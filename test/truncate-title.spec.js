
import service from 'ventrilo'
import { version } from '../package.json'

const CUSTOM_ELEMENT = 'abbr'
const EXTENDED_ELEMENT = 'truncate-title'
const CUSTOM_EVENT_TYPE = 'truncate-complete'
const TEST_ELEMENT_ID = 'this-element-is-for-testing-only'

const WRAPPER_SELELCTOR = '.wrapper-element'
const MAX_TIMEOUT = 25000

let customElementCreate
let elementHandle

// define custom properties/attributes
service.addMethod('title')
service.addMethod('titleBreak')
service.addMethod('separator')
service.addMethod('version')

describe(`Testing ${CUSTOM_ELEMENT}[is="${EXTENDED_ELEMENT}"]`, function () {
  this.timeout(MAX_TIMEOUT)

  // set-up and remove fresh instance for each test
  beforeEach(async () => {
    await service.resizeElement(WRAPPER_SELELCTOR, 700)
    // create a clean element instance.
    customElementCreate = await service.createCustomElementHandle(CUSTOM_ELEMENT, EXTENDED_ELEMENT, WRAPPER_SELELCTOR, {
      properties: {
        id: TEST_ELEMENT_ID
      }
    })
    // wait for it to render in the DOM.
    await page.waitFor(CUSTOM_ELEMENT)
    // grab the rendered element for test manipulation.
    elementHandle = await service.customElementHandle(CUSTOM_ELEMENT)
  })

  afterEach(async () => {
    // clean up mess.
    await service.removeCustomElementHandle(customElementCreate, WRAPPER_SELELCTOR)
    await elementHandle.dispose()
    await customElementCreate.dispose()
  })

  describe(`confirm the DOM is not polluted with duplicate elements of same type`, () => {
    // setup for other tests to confirm element can be grabbed by selector
    it(`should render test element and apply change to id`, async () => {
      const updatedId = 'updated-element-id'
      const testIdValue = await page.$eval(CUSTOM_ELEMENT, e => e.id)

      expect(testIdValue).to.equal(TEST_ELEMENT_ID)

      await service.setId(elementHandle, updatedId)
      const idValue = await page.$eval(CUSTOM_ELEMENT, e => e.id)

      expect(idValue).to.equal(updatedId)
    })
  })

  describe(`display as expected for initial page render [using defaults]`, () => {
    it(`should have version as property`, async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually.`

      await service.setAttributeTitle(elementHandle, testValue)
      const textContent = await page.$eval(CUSTOM_ELEMENT, e => e.version)

      // version from package.json
      expect(textContent).to.equal(version)
    })
    it(`should not be able to change version`, async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually.`

      await service.setVersion(elementHandle, testValue)
      const textContent = await page.$eval(CUSTOM_ELEMENT, e => e.version)

      expect(textContent).not.to.equal(testValue)
    })
    it(`should render title attribute as textContent`, async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually.`

      await service.setAttributeTitle(elementHandle, testValue)
      const textContent = await service.getTextContent(elementHandle)

      expect(textContent).to.equal(testValue)
    })

    it(`should render title property as textContent`, async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually.`

      await service.setTitle(elementHandle, testValue)
      const textContent = await service.getTextContent(elementHandle)

      expect(textContent).to.equal(testValue)
    })

    it(`emmit CustomEvent of ${CUSTOM_EVENT_TYPE} when augmentation is complete`, async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually, tattooed kickstarter direct trade try-hard woke four dollar toast truffaut. Green juice keffiyeh four dollar toast hot chicken pabst typewriter scenester before they sold out banh mi roof party bushwick ugh ennui edison bulb echo park. Street art edison bulb heirloom occupy health goth, cloud bread af small batch deep v crucifix intelligentsia try-hard. Wayfarers hexagon chartreuse, selvage lo-fi coloring book vape. Raw denim marfa taiyaki photo booth.`

      const ce = await service.customEventHandle(elementHandle, CUSTOM_EVENT_TYPE)

      await service.setAttributeTitle(elementHandle, testValue)

      await service.waitForCustomEvent(MAX_TIMEOUT)

      const { type } = await service.customEventGetter()
      expect(type).to.equal(CUSTOM_EVENT_TYPE)

      await ce.dispose()
    })

    it(`should have opacity of 1 when augmentation is complete`, async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually, tattooed kickstarter direct trade try-hard woke four dollar toast truffaut. Green juice keffiyeh four dollar toast hot chicken pabst typewriter scenester before they sold out banh mi roof party bushwick ugh ennui edison bulb echo park. Street art edison bulb heirloom occupy health goth, cloud bread af small batch deep v crucifix intelligentsia try-hard. Wayfarers hexagon chartreuse, selvage lo-fi coloring book vape. Raw denim marfa taiyaki photo booth.`

      const ce = await service.customEventHandle(elementHandle, CUSTOM_EVENT_TYPE)

      await service.setAttributeTitle(elementHandle, testValue)

      await service.waitForCustomEvent(MAX_TIMEOUT)

      const getOpacity = await page.$eval(CUSTOM_ELEMENT, e => e.style.opacity)

      expect(await getOpacity).to.equal('1')

      await ce.dispose()
    })

    it(`should render truncated variation of title tag string`, async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually, tattooed kickstarter direct trade try-hard woke four dollar toast truffaut. Green juice keffiyeh four dollar toast hot chicken pabst typewriter scenester before they sold out banh mi roof party bushwick ugh ennui edison bulb echo park. Street art edison bulb heirloom occupy health goth, cloud bread af small batch deep v crucifix intelligentsia try-hard. Wayfarers hexagon chartreuse, selvage lo-fi coloring book vape. Raw denim marfa taiyaki photo booth.`

      const ce = await service.customEventHandle(elementHandle, CUSTOM_EVENT_TYPE)

      await service.setTitle(elementHandle, testValue)

      await service.waitForCustomEvent(MAX_TIMEOUT)

      const textContent = await service.getTextContent(elementHandle)
      const textContentLength = await page.$eval(CUSTOM_ELEMENT, e => e.textContent.length)
      // remove 2 chars, separator + space
      const augmented = textContent.substring(0, textContentLength - 2)

      expect(testValue).to.include(augmented)

      await ce.dispose()
    })

    it('should render augmented content as smaller width than parent content width', async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually, tattooed kickstarter direct trade try-hard woke four dollar toast truffaut. Green juice keffiyeh four dollar toast hot chicken pabst typewriter scenester before they sold out banh mi roof party bushwick ugh ennui edison bulb echo park. Street art edison bulb heirloom occupy health goth, cloud bread af small batch deep v crucifix intelligentsia try-hard. Wayfarers hexagon chartreuse, selvage lo-fi coloring book vape. Raw denim marfa taiyaki photo booth.`

      const ce = await service.customEventHandle(elementHandle, CUSTOM_EVENT_TYPE)

      await service.setTitle(elementHandle, testValue)

      await service.waitForCustomEvent(MAX_TIMEOUT)

      const parentWidth = await page.$eval(WRAPPER_SELELCTOR, e => e.offsetWidth)
      const elementWidth = await page.$eval(CUSTOM_ELEMENT, e => e.offsetWidth)

      expect(elementWidth).to.be.below(parentWidth)

      await ce.dispose()
    })
  })

  describe(`display changes to textContent on parent resize`, () => {
    it('should have contentWidth for textContent', async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually.`

      await service.setTitle(elementHandle, testValue)

      const contentWidth = await page.$eval(CUSTOM_ELEMENT, e => e.contentWidth)
      const offsetWidth = await page.$eval(CUSTOM_ELEMENT, e => e.offsetWidth)

      expect(contentWidth).to.equal(offsetWidth)
    })
    it('should render full content when wrapper is larger than textContent', async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually.`

      const ce = await service.customEventHandle(elementHandle, CUSTOM_EVENT_TYPE)

      await service.setTitle(elementHandle, testValue)
      await service.resizeElement(WRAPPER_SELELCTOR, 50)

      await service.waitForCustomEvent(MAX_TIMEOUT)

      await service.resizeElement(WRAPPER_SELELCTOR, 760)
      await page.waitFor(500)

      const parentWidth = await page.$eval(WRAPPER_SELELCTOR, e => e.offsetWidth)
      const elementWidth = await page.$eval(CUSTOM_ELEMENT, e => e.offsetWidth)

      expect(elementWidth).to.be.below(parentWidth)

      const textContent = await service.getTextContent(elementHandle)

      expect(textContent).to.equal(testValue)

      await ce.dispose()
    })

    it('should render augmented content when wrapper is smaller than textContent', async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually.`

      const ce = await service.customEventHandle(elementHandle, CUSTOM_EVENT_TYPE)

      await service.setTitle(elementHandle, testValue)
      await service.resizeElement(WRAPPER_SELELCTOR, 50)

      await service.waitForCustomEvent(MAX_TIMEOUT)

      const parentWidth = await page.$eval(WRAPPER_SELELCTOR, e => e.offsetWidth)
      const elementWidth = await page.$eval(CUSTOM_ELEMENT, e => e.offsetWidth)

      expect(elementWidth).to.be.at.most(parentWidth)

      await ce.dispose()
    })
  })

  describe(`customized separator`, () => {
    it(`should define default separator as property`, async () => {
      const separator = await page.$eval(CUSTOM_ELEMENT, e => e.separator)

      expect(separator).to.equal('\u2026')
    })
    it(`should render truncated variation with new separator character`, async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually, tattooed kickstarter direct trade try-hard woke four dollar toast truffaut. Green juice keffiyeh four dollar toast hot chicken pabst typewriter scenester before they sold out banh mi roof party bushwick ugh ennui edison bulb echo park. Street art edison bulb heirloom occupy health goth, cloud bread af small batch deep v crucifix intelligentsia try-hard. Wayfarers hexagon chartreuse, selvage lo-fi coloring book vape. Raw denim marfa taiyaki photo booth.`
      const testSeparator = '+'
      const ce = await service.customEventHandle(elementHandle, CUSTOM_EVENT_TYPE)

      await service.setSeparator(elementHandle, testSeparator)
      await service.setTitle(elementHandle, testValue)

      await service.waitForCustomEvent(MAX_TIMEOUT)

      const textContent = await service.getTextContent(elementHandle)

      expect(textContent).to.include(testSeparator)

      await ce.dispose()
    })
    it(`should render from attribute on initial declaration`, async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually, tattooed kickstarter direct trade try-hard woke four dollar toast truffaut. Green juice keffiyeh four dollar toast hot chicken pabst typewriter scenester before they sold out banh mi roof party bushwick ugh ennui edison bulb echo park. Street art edison bulb heirloom occupy health goth, cloud bread af small batch deep v crucifix intelligentsia try-hard. Wayfarers hexagon chartreuse, selvage lo-fi coloring book vape. Raw denim marfa taiyaki photo booth.`
      const testSeparator = '+'

      // remove before because we want to create a new element with an attribute
      await service.removeCustomElementHandle(customElementCreate, WRAPPER_SELELCTOR)
      await elementHandle.dispose()
      await customElementCreate.dispose()

      // create new custom element with "separator" attribute
      customElementCreate = await service.createCustomElementHandle(CUSTOM_ELEMENT, EXTENDED_ELEMENT, WRAPPER_SELELCTOR, {
        attributes: {
          id: TEST_ELEMENT_ID,
          separator: testSeparator
        }
      })
      // wait for it to render in the DOM.
      await page.waitFor(CUSTOM_ELEMENT)
      // grab the rendered element for test manipulation.
      elementHandle = await service.customElementHandle(CUSTOM_ELEMENT)

      const ce = await service.customEventHandle(elementHandle, CUSTOM_EVENT_TYPE)

      await service.setAttributeSeparator(elementHandle, testSeparator)
      await service.setTitle(elementHandle, testValue)

      await service.waitForCustomEvent(MAX_TIMEOUT)

      const textContent = await service.getTextContent(elementHandle)

      expect(textContent).to.include(testSeparator)

      await ce.dispose()
    })

    it(`should not rerender from attribute update (not observed attribute)`, async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually, tattooed kickstarter direct trade try-hard woke four dollar toast truffaut. Green juice keffiyeh four dollar toast hot chicken pabst typewriter scenester before they sold out banh mi roof party bushwick ugh ennui edison bulb echo park. Street art edison bulb heirloom occupy health goth, cloud bread af small batch deep v crucifix intelligentsia try-hard. Wayfarers hexagon chartreuse, selvage lo-fi coloring book vape. Raw denim marfa taiyaki photo booth.`
      const testSeparator = '+'
      const ce = await service.customEventHandle(elementHandle, CUSTOM_EVENT_TYPE)

      await service.setAttributeSeparator(elementHandle, testSeparator)
      await service.setTitle(elementHandle, testValue)

      await service.waitForCustomEvent(MAX_TIMEOUT)

      const textContent = await service.getTextContent(elementHandle)

      expect(textContent).not.to.include(testSeparator)

      await ce.dispose()
    })
  })

  describe(`render new textContent from attribute and property change`, () => {
    it(`should render new content from property change`, async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually.`

      await service.setTitle(elementHandle, testValue)
      const defaultTextContent = await service.getTextContent(elementHandle)

      expect(defaultTextContent).to.equal(testValue)

      const updatedValue = `Updated: ${new Date()} Sartorial jean shorts actually, tattooed kickstarter direct trade try-hard woke four dollar toast truffaut. Green juice keffiyeh four dollar toast hot chicken pabst typewriter scenester before they sold out banh mi roof party bushwick ugh ennui edison bulb echo park. Street art edison bulb heirloom occupy health goth, cloud bread af small batch deep v crucifix intelligentsia try-hard. Wayfarers hexagon chartreuse, selvage lo-fi coloring book vape. Raw denim marfa taiyaki photo booth.`

      const ce = await service.customEventHandle(elementHandle, CUSTOM_EVENT_TYPE)

      await service.setTitle(elementHandle, updatedValue)
      await service.waitForCustomEvent(MAX_TIMEOUT)

      const textContent = await service.getTextContent(elementHandle)
      const textContentLength = await page.$eval(CUSTOM_ELEMENT, e => e.textContent.length)
      // remove 2 chars, separator + space
      const augmented = textContent.substring(0, textContentLength - 2)

      expect(updatedValue).to.include(augmented)

      await ce.dispose()
    })

    it(`should render new content from attribute change`, async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually.`

      await service.setAttributeTitle(elementHandle, testValue)
      const defaultTextContent = await service.getTextContent(elementHandle)

      expect(defaultTextContent).to.equal(testValue)

      const updatedValue = `Updated: ${new Date()} Sartorial jean shorts actually, tattooed kickstarter direct trade try-hard woke four dollar toast truffaut. Green juice keffiyeh four dollar toast hot chicken pabst typewriter scenester before they sold out banh mi roof party bushwick ugh ennui edison bulb echo park. Street art edison bulb heirloom occupy health goth, cloud bread af small batch deep v crucifix intelligentsia try-hard. Wayfarers hexagon chartreuse, selvage lo-fi coloring book vape. Raw denim marfa taiyaki photo booth.`

      const ce = await service.customEventHandle(elementHandle, CUSTOM_EVENT_TYPE)

      await service.setAttributeTitle(elementHandle, updatedValue)
      await service.waitForCustomEvent(MAX_TIMEOUT)

      const textContent = await service.getTextContent(elementHandle)
      const textContentLength = await page.$eval(CUSTOM_ELEMENT, e => e.textContent.length)
      // remove 2 chars, separator + space
      const augmented = textContent.substring(0, textContentLength - 2)

      expect(updatedValue).to.include(augmented)

      await ce.dispose()
    })
  })

  describe(`augmented the string ending as when attribute 'title-break' is set to 'center'`, () => {
    it(`should render truncated variation of title tag string`, async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually, tattooed kickstarter direct trade try-hard woke four dollar toast truffaut. Green juice keffiyeh four dollar toast hot chicken pabst typewriter scenester before they sold out banh mi roof party bushwick ugh ennui edison bulb echo park. Street art edison bulb heirloom occupy health goth, cloud bread af small batch deep v crucifix intelligentsia try-hard. Wayfarers hexagon chartreuse, selvage lo-fi coloring book vape. Raw denim marfa taiyaki photo booth.`

      const ce = await service.customEventHandle(elementHandle, CUSTOM_EVENT_TYPE)

      await service.setTitle(elementHandle, testValue)
      await service.setAttributeTitleBreak(elementHandle, 'center')
      await service.waitForCustomEvent(MAX_TIMEOUT)

      const textContent = await service.getTextContent(elementHandle)
      const textContentSeparatorIndex = await page.$eval(CUSTOM_ELEMENT, e => (
        e.textContent.indexOf(e.separator)
      ))
      const textContentLength = await page.$eval(CUSTOM_ELEMENT, e => e.textContent.length)

      const beginingChunk = textContent.substring(0, textContentSeparatorIndex - 1)
      const endingChunk = textContent.substring(textContentSeparatorIndex + 1, textContentLength - textContentSeparatorIndex + 1)

      expect(testValue).to.include(beginingChunk, 'begining does not match')
      expect(testValue).to.include(endingChunk, 'end does not match')

      await ce.dispose()
    })

    it(`should render truncated variation on property change (title then title-break)`, async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually, tattooed kickstarter direct trade try-hard woke four dollar toast truffaut. Green juice keffiyeh four dollar toast hot chicken pabst typewriter scenester before they sold out banh mi roof party bushwick ugh ennui edison bulb echo park. Street art edison bulb heirloom occupy health goth, cloud bread af small batch deep v crucifix intelligentsia try-hard. Wayfarers hexagon chartreuse, selvage lo-fi coloring book vape. Raw denim marfa taiyaki photo booth.`

      const ce = await service.customEventHandle(elementHandle, CUSTOM_EVENT_TYPE)

      await service.setTitle(elementHandle, testValue)
      await service.setAttributeTitleBreak(elementHandle, 'center')
      await service.waitForCustomEvent(MAX_TIMEOUT)

      const textContent = await service.getTextContent(elementHandle)
      const textContentSeparatorIndex = await page.$eval(CUSTOM_ELEMENT, e => {
        const content = e.textContent
        return content.indexOf(e.separator)
      })
      const textContentLength = await page.$eval(CUSTOM_ELEMENT, e => e.textContent.length)

      const beginingChunk = textContent.substring(0, textContentSeparatorIndex - 1)
      const endingChunk = textContent.substring(textContentSeparatorIndex + 1, textContentLength - textContentSeparatorIndex + 1)

      expect(testValue).to.include(beginingChunk, 'begining does not match')
      expect(testValue).to.include(endingChunk, 'end does not match')

      await ce.dispose()
    })

    it(`should render truncated variation on property change (title-break then title)`, async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually, tattooed kickstarter direct trade try-hard woke four dollar toast truffaut. Green juice keffiyeh four dollar toast hot chicken pabst typewriter scenester before they sold out banh mi roof party bushwick ugh ennui edison bulb echo park. Street art edison bulb heirloom occupy health goth, cloud bread af small batch deep v crucifix intelligentsia try-hard. Wayfarers hexagon chartreuse, selvage lo-fi coloring book vape. Raw denim marfa taiyaki photo booth.`

      const ce = await service.customEventHandle(elementHandle, CUSTOM_EVENT_TYPE)

      await service.setAttributeTitleBreak(elementHandle, 'center')
      await service.setTitle(elementHandle, testValue)
      await service.waitForCustomEvent(MAX_TIMEOUT)

      const textContent = await service.getTextContent(elementHandle)
      const textContentSeparatorIndex = await page.$eval(CUSTOM_ELEMENT, e => {
        const content = e.textContent
        return content.indexOf(e.separator)
      })
      const textContentLength = await page.$eval(CUSTOM_ELEMENT, e => e.textContent.length)

      const beginingChunk = textContent.substring(0, textContentSeparatorIndex - 1)
      const endingChunk = textContent.substring(textContentSeparatorIndex + 1, textContentLength - textContentSeparatorIndex + 1)

      expect(testValue).to.include(beginingChunk, 'begining does not match')
      expect(testValue).to.include(endingChunk, 'end does not match')

      await ce.dispose()
    })

    it(`should render truncated variation on inital load (not changed after)`, async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually, tattooed kickstarter direct trade try-hard woke four dollar toast truffaut. Green juice keffiyeh four dollar toast hot chicken pabst typewriter scenester before they sold out banh mi roof party bushwick ugh ennui edison bulb echo park. Street art edison bulb heirloom occupy health goth, cloud bread af small batch deep v crucifix intelligentsia try-hard. Wayfarers hexagon chartreuse, selvage lo-fi coloring book vape. Raw denim marfa taiyaki photo booth.`

      // remove before because we want to create a new element with an attribute
      await service.removeCustomElementHandle(customElementCreate, WRAPPER_SELELCTOR)
      await elementHandle.dispose()
      await customElementCreate.dispose()

      // create new custom element with "separator" attribute
      customElementCreate = await service.createCustomElementHandle(CUSTOM_ELEMENT, EXTENDED_ELEMENT, WRAPPER_SELELCTOR, {
        attributes: {
          id: TEST_ELEMENT_ID,
          'text-break': 'center'
        }
      })

      // wait for it to render in the DOM.
      await page.waitFor(CUSTOM_ELEMENT)
      // grab the rendered element for test manipulation.
      elementHandle = await service.customElementHandle(CUSTOM_ELEMENT)

      // await service.setAttributeTitleBreak(elementHandle, 'center')
      await service.setTitle(elementHandle, testValue)

      const ce = await service.customEventHandle(elementHandle, CUSTOM_EVENT_TYPE)

      const textContent = await service.getTextContent(elementHandle)
      const textContentSeparatorIndex = await page.$eval(CUSTOM_ELEMENT, e => {
        const content = e.textContent
        return content.indexOf(e.separator)
      })
      const textContentLength = await page.$eval(CUSTOM_ELEMENT, e => e.textContent.length)

      const beginingChunk = textContent.substring(0, textContentSeparatorIndex - 1)
      const endingChunk = textContent.substring(textContentSeparatorIndex + 1, textContentLength - textContentSeparatorIndex + 1)

      expect(testValue).to.include(beginingChunk, 'begining does not match')
      expect(testValue).to.include(endingChunk, 'end does not match')

      await ce.dispose()
    })
  })

  describe(`augmented the string end as when attribute 'title-break' is set to 'end'`, () => {
    it(`should render truncated variation of title tag string`, async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually, tattooed kickstarter direct trade try-hard woke four dollar toast truffaut. Green juice keffiyeh four dollar toast hot chicken pabst typewriter scenester before they sold out banh mi roof party bushwick ugh ennui edison bulb echo park. Street art edison bulb heirloom occupy health goth, cloud bread af small batch deep v crucifix intelligentsia try-hard. Wayfarers hexagon chartreuse, selvage lo-fi coloring book vape. Raw denim marfa taiyaki photo booth.`

      const ce = await service.customEventHandle(elementHandle, CUSTOM_EVENT_TYPE)

      await service.setTitleBreak(elementHandle, 'end')
      await service.setTitle(elementHandle, testValue)
      await service.waitForCustomEvent(MAX_TIMEOUT)

      const textContent = await service.getTextContent(elementHandle)
      const textContentLength = await page.$eval(CUSTOM_ELEMENT, e => e.textContent.length)
      // remove 2 chars, separator + space
      const augmented = textContent.substring(0, textContentLength - 2)

      expect(testValue).to.include(augmented)

      await ce.dispose()
    })

    it(`should render truncated variation of title tag string, then title-break`, async () => {
      const testValue = `${new Date()} Sartorial jean shorts actually, tattooed kickstarter direct trade try-hard woke four dollar toast truffaut. Green juice keffiyeh four dollar toast hot chicken pabst typewriter scenester before they sold out banh mi roof party bushwick ugh ennui edison bulb echo park. Street art edison bulb heirloom occupy health goth, cloud bread af small batch deep v crucifix intelligentsia try-hard. Wayfarers hexagon chartreuse, selvage lo-fi coloring book vape. Raw denim marfa taiyaki photo booth.`

      const ce = await service.customEventHandle(elementHandle, CUSTOM_EVENT_TYPE)

      await service.setTitle(elementHandle, testValue)
      await service.setTitleBreak(elementHandle, 'end')
      await service.waitForCustomEvent(MAX_TIMEOUT)

      const textContent = await service.getTextContent(elementHandle)
      const textContentLength = await page.$eval(CUSTOM_ELEMENT, e => e.textContent.length)
      // remove 2 chars, separator + space
      const augmented = textContent.substring(0, textContentLength - 2)

      expect(testValue).to.include(augmented)

      await ce.dispose()
    })
  })

  describe(`reject invalid break types`, () => {
    it(`should accept a valid type`, async () => {
      const type = 'center'
      const textBreak = await service.getTitleBreak(elementHandle)
      console.log('textBreak', textBreak)
      await service.setTitleBreak(elementHandle, type)
      const updatedTextBreak = await service.getTitleBreak(elementHandle)
      console.log('updatedTextBreak', updatedTextBreak)

      expect(type).not.to.equal(textBreak)
      expect(type).to.equal(updatedTextBreak)
      expect(textBreak).not.to.equal(updatedTextBreak)
    })
    it(`should not change break type property`, async () => {
      const type = 'foo'
      const textBreak = await service.getTitleBreak(elementHandle)

      await service.setTitleBreak(elementHandle, type)
      const updatedTextBreak = await service.getTitleBreak(elementHandle)

      expect(type).not.to.equal(updatedTextBreak)
      expect(textBreak).to.equal(updatedTextBreak)
    })
    it(`should not change break type attribute`, async () => {
      const textBreak = await service.getAttributeTitleBreak(elementHandle)

      await service.setTitleBreak(elementHandle, 'foo')
      const updatedTextBreak = await service.getAttributeTitleBreak(elementHandle)

      expect(textBreak).to.equal(updatedTextBreak)
    })
    // it.skip(`should throw warning if 'debug' attribute is assigned`, async () => {

    //   const textBreak = await service.getTitleBreak(elementHandle)

    //   await service.setTitleBreak(elementHandle, 'foo')
    //   const updatedTextBreak = await service.getTitleBreak(elementHandle)

    //   expect(textBreak).to.equal(updatedTextBreak)
    // })
  })
})
