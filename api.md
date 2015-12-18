# byteSize

Returns the byte length of an utf8 string or an object (when parsed to JSON)

**Parameters**

-   `obj`  

# chalk

Publicly export the chalk color library

# cleanUrl

Replace all (/.../g) leading slash (^\/) or (|) trailing slash (\/$) with an empty string.

**Parameters**

-   `url` **String** URL / Path to cleanup

Returns **String** 

# clearLogHistory

Clears (empties) the log object

# colorize

Colors the messages by searching for specific indicator strings
TODO: Allow to add to the colorMap

**Parameters**

-   `msg` **string** 

Returns **string** 

# debug

Prints out debugging information for the current model object

**Parameters**

-   `obj` **object** Object
-   `silent`  

# error

Prints errors

**Parameters**

-   `obj` **object** Object
-   `silent`  

# getConfig

Gets the current config

# getDateArray

Returns an array with date / time information
Starts with year at index 0 up to index 6 for milliseconds

**Parameters**

-   `date` **[Date]** Optional date object. If falsy, will take current time.

Returns **Array** 

# getLogHistory

Returns the global.moboLogObject

Returns **Array** 

# humanDate

Returns nicely formatted date-time

**Parameters**

-   `date` **[object]** 

**Examples**

```javascript
2015-02-10 16:01:12
```

Returns **string** 

# humanTime

Returns nicely formatted date-time

**Parameters**

-   `date` **[object]** 

**Examples**

```javascript
16:01:12
```

Returns **string** 

# log

Custom Logging function

Writes Logs to console, stringifies objects first

**Parameters**

-   `msg` **string or object** Message String or Object
-   `obj`  
-   `silent` **[boolean]** Dot not print message to the console, but stores it to the log history.

# pad

Pad a number with n digits

**Parameters**

-   `number` **number** number to pad
-   `digits` **number** number of total digits

Returns **string** 

# prettyBytes

**Parameters**

-   `bytes`  
-   `si`  

Returns **string** 

# prettyNumber

Adds dots as thousand separators to numbers

<http://stackoverflow.com/a/2901298>

**Parameters**

-   `number`  

Returns **string** 

# roboDate

Returns a formatted date-time, optimized for machines

**Parameters**

-   `date` **[object]** 

**Examples**

```javascript
2015-02-10_16-00-08
```

Returns **string** 

# roboTime

Returns a formatted date-time, optimized for machines

**Parameters**

-   `date` **[object]** 

**Examples**

```javascript
2015-02-10_16-00-08
```

Returns **string** 

# stripTrailingSlash

Strips trailing slashes from URL

**Parameters**

-   `url` **String** URL to cleanup

Returns **String** 

# updateConfig

Updates the config.
Only those parameters that have been given will be updated

**Parameters**

-   `config` **object** 

# 

semlog
A semantic logger that colors and formats messages automatically according to the content
