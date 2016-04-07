# byteSize

Returns the byte length of an utf8 string or an object (when parsed to JSON)

**Parameters**

-   `obj`  

# chalk

Publicly export the chalk color library

# cleanUrl

Replace all (/.../g) leading slash (^\\/) or (|) trailing slash (\\/$) with an empty string.

**Parameters**

-   `url` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** URL / Path to cleanup

Returns **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

# clearLogHistory

Clears (empties) the log object

# colorize

Colors the messages by searching for specific indicator strings
TODO: Allow to add to the colorMap

**Parameters**

-   `msg` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

# debug

Prints out debugging information for the current model object

**Parameters**

-   `obj` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object
-   `silent`  

# error

Prints errors

**Parameters**

-   `obj` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object
-   `silent`  

# getConfig

Gets the current config

# getDateArray

Returns an array with date / time information
Starts with year at index 0 up to index 6 for milliseconds

**Parameters**

-   `date` **[Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)=** Optional date object. If falsy, will take current time.

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** 

# getLogHistory

Returns the global.moboLogObject

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** 

# getStatistics

Gets the current config

# humanDate

Returns nicely formatted date-time

**Parameters**

-   `date` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** 

**Examples**

```javascript
2015-02-10 16:01:12
```

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

# humanTime

Returns nicely formatted date-time

**Parameters**

-   `date` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** 

**Examples**

```javascript
16:01:12
```

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

# log

Custom Logging function

Writes Logs to console, stringifies objects first

**Parameters**

-   `msg` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)\|[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object))** Message String or Object
-   `obj`  
-   `silent` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)=** Dot not print message to the console, but stores it to the log history.

# pad

Pad a number with n digits

**Parameters**

-   `number` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** number to pad
-   `digits` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** number of total digits

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

# prettyBytes

**Parameters**

-   `bytes`  
-   `si`  

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

# prettyNumber

Adds dots as thousand separators to numbers

<http://stackoverflow.com/a/2901298>

**Parameters**

-   `number`  

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

# roboDate

Returns a formatted date-time, optimized for machines

**Parameters**

-   `date` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** 

**Examples**

```javascript
2015-02-10_16-00-08
```

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

# roboTime

Returns a formatted date-time, optimized for machines

**Parameters**

-   `date` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** 

**Examples**

```javascript
2015-02-10_16-00-08
```

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

# stripTrailingSlash

Strips trailing slashes from URL

**Parameters**

-   `url` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** URL to cleanup

Returns **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

# updateConfig

Updates the config.
Only those parameters that have been given will be updated

**Parameters**

-   `config` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

# 

semlog
A semantic logger that colors and formats messages automatically according to the content

**Meta**

-   **author**: Simon Heimler
