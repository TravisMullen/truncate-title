
const approxFontWidth = fontSize => (
  Math.floor(fontSize / 2.2)
)

const fitCharacters = (containerWidth, fontWidth) => (
  Math.ceil(containerWidth / fontWidth)
)

export const estimateWidth = (targetElement, parentElement, title = '') => {
  if (typeof (title) !== 'string') return

  const fontSize = parseInt(window.getComputedStyle(targetElement).fontSize.replace('px', ''), 10)
  const width = parentElement
    ? parseInt(parentElement.clientWidth, 10)
    : parseInt(window.innerWidth, 10)
  return Math.trunc(
    Math.abs(
      title.length - fitCharacters(
        width,
        approxFontWidth(fontSize)
      )
    ) // pad it a bit then d
  )
}
