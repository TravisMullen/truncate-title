# Truncation Title :scissors:

**Custom Element** for shortening text. Extends Abbr tag.

Add full text to `title` attribute.

```html
<abbr is="truncate-title" title="Lorem ipsum dolor amet typewriter pickled iPhone hella occupy neutra tattooed vinyl drinking vinegar ennui."></abbr>
```

The text will be truncated to fit the parent element. Any text that flows outside of the parent element will be removed. The default seporator is `&hellip;`. 

```html
<abbr is="truncate-title" title="Lorem ipsum dolor amet typewriter pickled iPhone hella occupy neutra tattooed vinyl drinking vinegar ennui.">Lorem ipsum dolor amet typewriter pickl&hellip;</abbr>
```
To truncate in the middle of the text set `title-break` to `center`. The default break is `tail` which will break at the end of the line.

```html
<abbr is="truncate-title" title="Lorem ipsum dolor amet typewriter pickled iPhone hella occupy neutra tattooed vinyl drinking vinegar ennui." title-break="tail">Lorem ipsum dolor amet typewriter pickl</abbr>
```

[Documentation](./documentation.md)