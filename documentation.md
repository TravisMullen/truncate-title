## Classes

<dl>
<dt><a href="#Enumeration">Enumeration</a></dt>
<dd><p>Enumeration - Immutable key value pairs.</p>
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
Enumeration - Immutable key value pairs.

**Kind**: global class  
**Link**: https://bitbucket.org/snippets/travismullen/6egzxX/enumeration.git  
<a name="Enumeration+has"></a>

### enumeration.has(key) ⇒ <code>boolean</code>
Is a valid key/value of instance.

**Kind**: instance method of [<code>Enumeration</code>](#Enumeration)  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

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
        * [._doTruncate(title, grow)](#TruncateTitle+_doTruncate)
        * [._updateContent(newValue)](#TruncateTitle+_updateContent)
    * _static_
        * [.shouldAugment(self)](#TruncateTitle.shouldAugment) ⇒ <code>boolean</code>
        * [.shouldTruncate(self)](#TruncateTitle.shouldTruncate) ⇒ <code>boolean</code>
        * [.shouldGrow(self)](#TruncateTitle.shouldGrow) ⇒ <code>boolean</code>
        * [.cutEnd(title, increment)](#TruncateTitle.cutEnd) ⇒ <code>string</code>
        * [.cutCenter(title, increment)](#TruncateTitle.cutCenter) ⇒ <code>string</code>

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

- _doTruncate
- disconnectedCallback

<a name="TruncateTitle+contentWidth"></a>

### truncateTitle.contentWidth
Size of full text node (inner content) as rendered in DOM.

**Kind**: instance property of [<code>TruncateTitle</code>](#TruncateTitle)  
**See**

- _updateContent
- shouldAugment

<a name="TruncateTitle+separator"></a>

### truncateTitle.separator
Character added to truncated text.

**Kind**: instance property of [<code>TruncateTitle</code>](#TruncateTitle)  
**Default**: <code>…</code>  
**Todo**

- [ ] Make this an attribute?

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
<a name="TruncateTitle+_doTruncate"></a>

### truncateTitle._doTruncate(title, grow)
Animate removal or addition of characters depending on parent's size.

**Kind**: instance method of [<code>TruncateTitle</code>](#TruncateTitle)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| title | <code>string</code> |  | Text be truncated |
| grow | <code>boolean</code> | <code>true</code> | Should the text be lengthened or shortened |

<a name="TruncateTitle+_updateContent"></a>

### truncateTitle._updateContent(newValue)
Get and save the text width for comparison.

**Kind**: instance method of [<code>TruncateTitle</code>](#TruncateTitle)  

| Param | Type |
| --- | --- |
| newValue | <code>string</code> | 

<a name="TruncateTitle.shouldAugment"></a>

### TruncateTitle.shouldAugment(self) ⇒ <code>boolean</code>
Determines if full title text, rendered as inner content, is larger than its parent.

**Kind**: static method of [<code>TruncateTitle</code>](#TruncateTitle)  
**See**: this._resizeObserver  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>HTMLElement</code> | Instance of TruncateTitle |

<a name="TruncateTitle.shouldTruncate"></a>

### TruncateTitle.shouldTruncate(self) ⇒ <code>boolean</code>
Determines if truncated title text is larger than its parent.

**Kind**: static method of [<code>TruncateTitle</code>](#TruncateTitle)  
**See**: _doTruncate  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>HTMLElement</code> | Instance of TruncateTitle |

<a name="TruncateTitle.shouldGrow"></a>

### TruncateTitle.shouldGrow(self) ⇒ <code>boolean</code>
Determines if truncated title text has room within its parent to add more characters.

**Kind**: static method of [<code>TruncateTitle</code>](#TruncateTitle)  
**Note**: Accounts for padding of parent.  
**See**: _doTruncate  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>HTMLElement</code> | Instance of TruncateTitle |

<a name="TruncateTitle.cutEnd"></a>

### TruncateTitle.cutEnd(title, increment) ⇒ <code>string</code>
Remove characters from the end of the string.

**Kind**: static method of [<code>TruncateTitle</code>](#TruncateTitle)  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>string</code> |  |
| increment | <code>number</code> | Number of characters to be removed. |

<a name="TruncateTitle.cutCenter"></a>

### TruncateTitle.cutCenter(title, increment) ⇒ <code>string</code>
Remove characters from the center of the string.

**Kind**: static method of [<code>TruncateTitle</code>](#TruncateTitle)  
**Note**: `increment` is doubled since it is applied twice.  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>string</code> |  |
| increment | <code>number</code> | Number of characters to be removed. |

<a name="TYPES"></a>

## TYPES : <code>enum</code>
Availible truncation types.

**Kind**: global enum  
**Read only**: true  
**See**

- TruncateTitle.cutCenter
- TruncateTitle.cutEnd

<a name="elementRegistryName"></a>

## elementRegistryName
HTML implementation name

**Kind**: global constant  
