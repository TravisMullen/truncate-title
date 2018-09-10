# Truncation Title :scissors:

<!-- [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) -->


**Custom Element** for shortening text. Extends `abbr` tag.

[Documentation](./documentation.md)

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

## Demo

`npm run serve`


## Todo

- [ ] Add Test Coverage.
- [ ] Use CSS Property to set default animation styles.
- [ ] Set-up NPM for inclusion into other projects.
- [ ] Sperate functions into multiple files?



[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
