## Classes

<dl>
<dt><a href="#Enumeration">Enumeration</a></dt>
<dd><p>Quick Enumeration</p>
</dd>
<dt><a href="#TruncateTitle">TruncateTitle</a> ⇐ <code>HTMLElement</code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#elementRegistryName">elementRegistryName</a></dt>
<dd><p>HTML implementation name</p>
</dd>
</dl>

<a name="Enumeration"></a>

## Enumeration
Quick Enumeration

**Kind**: global class  
**Link**: https://bitbucket.org/snippets/travismullen/6egzxX/enumeration.git  
<a name="new_Enumeration_new"></a>

### new exports.Enumeration(types)

| Param | Type | Description |
| --- | --- | --- |
| types | <code>object</code> | keys will serve as valid types. values will be results of test |

<a name="TruncateTitle"></a>

## TruncateTitle ⇐ <code>HTMLElement</code>
**Kind**: global class  
**Extends**: <code>HTMLElement</code>  

* [TruncateTitle](#TruncateTitle) ⇐ <code>HTMLElement</code>
    * [new TruncateTitle()](#new_TruncateTitle_new)
    * _instance_
        * [.truncationType](#TruncateTitle+truncationType)
        * [._rAF](#TruncateTitle+_rAF)
        * [.contentWidth](#TruncateTitle+contentWidth)
        * [.separator](#TruncateTitle+separator)
        * [._increment](#TruncateTitle+_increment)
        * [._hasChanged](#TruncateTitle+_hasChanged)
        * [.textContent](#TruncateTitle+textContent)
        * [.contentWidth](#TruncateTitle+contentWidth)
        * [._resizeObserver](#TruncateTitle+_resizeObserver)
        * [.doTruncate(title, grow)](#TruncateTitle+doTruncate)
        * [.updateContent(newValue)](#TruncateTitle+updateContent)
    * _static_
        * [.shouldAugment(self)](#TruncateTitle.shouldAugment) ⇒ <code>boolean</code>
        * [.shouldTruncate(self)](#TruncateTitle.shouldTruncate) ⇒ <code>boolean</code>
        * [.shouldGrow(self)](#TruncateTitle.shouldGrow) ⇒ <code>boolean</code>
        * [.cutTail()](#TruncateTitle.cutTail)
        * [.cutCenter()](#TruncateTitle.cutCenter)

<a name="new_TruncateTitle_new"></a>

### new TruncateTitle()
Custom Element to truncate text within an `abbr` tag.

<a name="TruncateTitle+truncationType"></a>

### truncateTitle.truncationType
Truncation type.

**Kind**: instance property of [<code>TruncateTitle</code>](#TruncateTitle)  
**See**: attributeChangedCallback  
<a name="TruncateTitle+_rAF"></a>

### truncateTitle._rAF
requestAnimationFrame reference for cancellation.

**Kind**: instance property of [<code>TruncateTitle</code>](#TruncateTitle)  
**See**

- doTruncate
- disconnectedCallback

<a name="TruncateTitle+contentWidth"></a>

### truncateTitle.contentWidth
Size of full text node (inner content) as rendered in DOM.

**Kind**: instance property of [<code>TruncateTitle</code>](#TruncateTitle)  
**See**

- updateContent
- shouldAugment

<a name="TruncateTitle+separator"></a>

### truncateTitle.separator
Character added to truncated text.

**Kind**: instance property of [<code>TruncateTitle</code>](#TruncateTitle)  
**Default**: <code>…</code>  
**Todo**

- [ ] - Make this an attribute?

<a name="TruncateTitle+_increment"></a>

### truncateTitle._increment
Amount of characters removed from text.

**Kind**: instance property of [<code>TruncateTitle</code>](#TruncateTitle)  
**Default**: <code>2</code>  
<a name="TruncateTitle+_hasChanged"></a>

### truncateTitle._hasChanged
State of last detected resize event.

**Kind**: instance property of [<code>TruncateTitle</code>](#TruncateTitle)  
<a name="TruncateTitle+textContent"></a>

### truncateTitle.textContent
render the raw text string in the DOM

**Kind**: instance property of [<code>TruncateTitle</code>](#TruncateTitle)  
<a name="TruncateTitle+contentWidth"></a>

### truncateTitle.contentWidth
store width value for comparison later

**Kind**: instance property of [<code>TruncateTitle</code>](#TruncateTitle)  
<a name="TruncateTitle+_resizeObserver"></a>

### truncateTitle._resizeObserver
ResizeObserver callback function for handling truncation logic.

**Kind**: instance property of [<code>TruncateTitle</code>](#TruncateTitle)  
**See**: https://wicg.github.io/ResizeObserver/  
<a name="TruncateTitle+doTruncate"></a>

### truncateTitle.doTruncate(title, grow)
Animate removal or addition of characters depending on parent's size.

**Kind**: instance method of [<code>TruncateTitle</code>](#TruncateTitle)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| title | <code>string</code> |  | title Text be truncated |
| grow | <code>boolean</code> | <code>true</code> | [grow=true] Should the text be lengthened or shortened |

<a name="TruncateTitle+updateContent"></a>

### truncateTitle.updateContent(newValue)
Get and save the text width for comparison.

**Kind**: instance method of [<code>TruncateTitle</code>](#TruncateTitle)  

| Param | Type | Description |
| --- | --- | --- |
| newValue | <code>string</code> | newValue |
|  | <code>string</code> | newValue |

<a name="TruncateTitle.shouldAugment"></a>

### TruncateTitle.shouldAugment(self) ⇒ <code>boolean</code>
Determines if full title text, rendered as inner content, is larger than its parent.

**Kind**: static method of [<code>TruncateTitle</code>](#TruncateTitle)  
**Returns**: <code>boolean</code> - -  
**See**: this._resizeObserver  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>HTMLElement</code> | self Instance of TruncateTitle |

<a name="TruncateTitle.shouldTruncate"></a>

### TruncateTitle.shouldTruncate(self) ⇒ <code>boolean</code>
Determines if truncated title text is larger than its parent.

**Kind**: static method of [<code>TruncateTitle</code>](#TruncateTitle)  
**Returns**: <code>boolean</code> - -  
**See**: doTruncate  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>HTMLElement</code> | self Instance of TruncateTitle |

<a name="TruncateTitle.shouldGrow"></a>

### TruncateTitle.shouldGrow(self) ⇒ <code>boolean</code>
Determines if truncated title text has room within its parent to add more characters.

**Kind**: static method of [<code>TruncateTitle</code>](#TruncateTitle)  
**Returns**: <code>boolean</code> - -  
**Note**: - accounts for padding of parent  
**See**: doTruncate  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>HTMLElement</code> | self Instance of TruncateTitle |

<a name="TruncateTitle.cutTail"></a>

### TruncateTitle.cutTail()
Remove characters from the end of the string.

**Kind**: static method of [<code>TruncateTitle</code>](#TruncateTitle)  
<a name="TruncateTitle.cutCenter"></a>

### TruncateTitle.cutCenter()
Remove characters from the center of the string.

**Kind**: static method of [<code>TruncateTitle</code>](#TruncateTitle)  
<a name="TYPES"></a>

## TYPES : <code>enum</code>
Availible truncation types.

**Kind**: global enum  
**Read only**: true  
**See**

- cutCenter
- cutTail

<a name="elementRegistryName"></a>

## elementRegistryName
HTML implementation name

**Kind**: global constant  
