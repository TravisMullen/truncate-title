# Truncate Title :scissors:

**Custom Element** for shortening text. Extends `abbr` tag.

[:book: Documentation](https://github.com/TravisMullen/truncate-title/blob/master/documentation.md)

[:white_check_mark: Verbose Test Coverage](https://github.com/TravisMullen/truncate-title/blob/master/test/truncate-title.spec.js)

## Usage

Add full text to `title` attribute.

```html
<abbr is="truncate-title" title="Lorem ipsum dolor amet typewriter pickled iPhone hella occupy neutra tattooed vinyl drinking vinegar ennui."></abbr>
```

The text will be truncated to fit the parent element. Any text that flows outside of the parent element will be removed. The default seporator is `&hellip;`. 

```html
<abbr is="truncate-title" title="Lorem ipsum dolor amet typewriter pickled iPhone hella occupy neutra tattooed vinyl drinking vinegar ennui.">Medium Lorem ipsum dolor amet typewriter pickled iPho …</abbr>
```
To truncate in the middle of the text set `title-break` to `center`. The default break is `tail` which will break at the end of the line.

```html
<abbr is="truncate-title" title="Lorem ipsum dolor amet typewriter pickled iPhone hella occupy neutra tattooed vinyl drinking vinegar ennui." title-break="tail">Medium Lorem ipsum dolor a … yl drinking vinegar ennui.</abbr>
```

## Modules

The default `{ "main": "dist/truncate-title.registered.js" }` module will register the Custom Element using `customElements.define`.

For the unregisted version use `{ "module": "dist/truncate-title.esm.js" }`, and function `registerCustomElement` will be availible to register using a custom name or the default if no argument present.

## Custom Event

CustomEvent `truncate-complete` is emmited everytime a truncation event is complete. 

**`detail` contains the following `<Object>`:**
```js
detail: { 
  before: <string>, // pre augmented title
  after: <string>, // post augmented title
  width: <number> // width title was truncated to be less than
}
```

## Demo

`npm run serve`


## Todo

- [ ] More examples in `readme.md`
- [ ] Use CSS Property to set default animation styles.



[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
