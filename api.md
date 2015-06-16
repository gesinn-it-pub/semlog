## Members
<dl>
<dt><a href="#chalk">chalk</a></dt>
<dd><p>Publicly export the chalk color library</p>
</dd>
<dt><a href="#events">events</a></dt>
<dd><p>semlog events
Currently only &#39;log&#39;</p>
</dd>
</dl>
## Functions
<dl>
<dt><a href="#log">log(msg, [silent])</a></dt>
<dd><p>Custom Logging function</p>
<p>Writes Logs to console, stringifies objects first</p>
</dd>
<dt><a href="#debug">debug(obj, silent)</a></dt>
<dd><p>Prints out debugging information for the current model object</p>
</dd>
<dt><a href="#colorMessage">colorMessage(msg)</a> ⇒ <code>string</code></dt>
<dd><p>Colors the messages by searching for specific indicator strings</p>
</dd>
<dt><a href="#getConfig">getConfig()</a></dt>
<dd><p>Gets the current config</p>
</dd>
<dt><a href="#updateConfig">updateConfig(config)</a></dt>
<dd><p>Updates the config.
Only those parameters that have been given will be updated</p>
</dd>
<dt><a href="#clearLogHistory">clearLogHistory()</a></dt>
<dd><p>Clears (empties) the log object</p>
</dd>
<dt><a href="#getLogHistory">getLogHistory()</a> ⇒ <code>Array</code></dt>
<dd><p>Returns the global.moboLogObject</p>
</dd>
<dt><a href="#pad">pad(number, digits)</a> ⇒ <code>string</code></dt>
<dd><p>Pad a number with n digits</p>
</dd>
<dt><a href="#prettyNumber">prettyNumber(number)</a> ⇒ <code>string</code></dt>
<dd><p>Adds dots as thousand separators to numbers</p>
<p><a href="http://stackoverflow.com/a/2901298">http://stackoverflow.com/a/2901298</a></p>
</dd>
<dt><a href="#stripTrailingSlash">stripTrailingSlash(url)</a> ⇒ <code>String</code></dt>
<dd><p>Strips trailing slashes from URL</p>
</dd>
<dt><a href="#byteSize">byteSize()</a></dt>
<dd><p>Returns the byte length of an utf8 string or an object (when parsed to JSON)</p>
</dd>
<dt><a href="#prettyBytes">prettyBytes(bytes, [si])</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#getDateArray">getDateArray([date])</a> ⇒ <code>Array</code></dt>
<dd><p>Returns an array with date / time information
Starts with year at index 0 up to index 6 for milliseconds</p>
</dd>
<dt><a href="#humanDate">humanDate([date])</a> ⇒ <code>string</code></dt>
<dd><p>Returns nicely formatted date-time</p>
</dd>
<dt><a href="#roboDate">roboDate([date])</a> ⇒ <code>string</code></dt>
<dd><p>Returns a formatted date-time, optimized for machines</p>
</dd>
<dt><a href="#humanTime">humanTime([date])</a> ⇒ <code>string</code></dt>
<dd><p>Returns nicely formatted date-time</p>
</dd>
<dt><a href="#roboTime">roboTime([date])</a> ⇒ <code>string</code></dt>
<dd><p>Returns a formatted date-time, optimized for machines</p>
</dd>
</dl>
<a name="chalk"></a>
## chalk
Publicly export the chalk color library

**Kind**: global variable  
<a name="events"></a>
## events
semlog events
Currently only 'log'

**Kind**: global variable  
<a name="log"></a>
## log(msg, [silent])
Custom Logging function

Writes Logs to console, stringifies objects first

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>string</code> &#124; <code>object</code> | Message String or Object |
| [silent] | <code>boolean</code> | Dot not print message to the console, but stores it to the log history. |

<a name="debug"></a>
## debug(obj, silent)
Prints out debugging information for the current model object

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | Object from Development Model |
| silent | <code>boolean</code> | Silent mode (logs only to file) |

<a name="colorMessage"></a>
## colorMessage(msg) ⇒ <code>string</code>
Colors the messages by searching for specific indicator strings

**Kind**: global function  

| Param | Type |
| --- | --- |
| msg | <code>string</code> | 

<a name="getConfig"></a>
## getConfig()
Gets the current config

**Kind**: global function  
<a name="updateConfig"></a>
## updateConfig(config)
Updates the config.
Only those parameters that have been given will be updated

**Kind**: global function  

| Param | Type |
| --- | --- |
| config | <code>Object</code> | 

<a name="clearLogHistory"></a>
## clearLogHistory()
Clears (empties) the log object

**Kind**: global function  
<a name="getLogHistory"></a>
## getLogHistory() ⇒ <code>Array</code>
Returns the global.moboLogObject

**Kind**: global function  
<a name="pad"></a>
## pad(number, digits) ⇒ <code>string</code>
Pad a number with n digits

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| number | <code>number</code> | number to pad |
| digits | <code>number</code> | number of total digits |

<a name="prettyNumber"></a>
## prettyNumber(number) ⇒ <code>string</code>
Adds dots as thousand separators to numbers

http://stackoverflow.com/a/2901298

**Kind**: global function  

| Param |
| --- |
| number | 

<a name="stripTrailingSlash"></a>
## stripTrailingSlash(url) ⇒ <code>String</code>
Strips trailing slashes from URL

**Kind**: global function  
**See**: http://stackoverflow.com/a/6680858/776425  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | URL to cleanup |

<a name="byteSize"></a>
## byteSize()
Returns the byte length of an utf8 string or an object (when parsed to JSON)

**Kind**: global function  
**See**: http://stackoverflow.com/a/23329386  
<a name="prettyBytes"></a>
## prettyBytes(bytes, [si]) ⇒ <code>string</code>
**Kind**: global function  
**See**: http://stackoverflow.com/a/14919494  

| Param |
| --- |
| bytes | 
| [si] | 

<a name="getDateArray"></a>
## getDateArray([date]) ⇒ <code>Array</code>
Returns an array with date / time information
Starts with year at index 0 up to index 6 for milliseconds

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [date] | <code>Date</code> | Optional date object. If falsy, will take current time. |

<a name="humanDate"></a>
## humanDate([date]) ⇒ <code>string</code>
Returns nicely formatted date-time

**Kind**: global function  

| Param | Type |
| --- | --- |
| [date] | <code>object</code> | 

**Example**  
```js
2015-02-10 16:01:12
```
<a name="roboDate"></a>
## roboDate([date]) ⇒ <code>string</code>
Returns a formatted date-time, optimized for machines

**Kind**: global function  

| Param | Type |
| --- | --- |
| [date] | <code>object</code> | 

**Example**  
```js
2015-02-10_16-00-08
```
<a name="humanTime"></a>
## humanTime([date]) ⇒ <code>string</code>
Returns nicely formatted date-time

**Kind**: global function  

| Param | Type |
| --- | --- |
| [date] | <code>object</code> | 

**Example**  
```js
16:01:12
```
<a name="roboTime"></a>
## roboTime([date]) ⇒ <code>string</code>
Returns a formatted date-time, optimized for machines

**Kind**: global function  

| Param | Type |
| --- | --- |
| [date] | <code>object</code> | 

**Example**  
```js
2015-02-10_16-00-08
```
