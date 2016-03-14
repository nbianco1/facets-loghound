## Minification ##

#### Links ####
[YUI Compressor Home](http://developer.yahoo.com/yui/compressor)<br />
[YUI Compressor Download](http://yuilibrary.com/downloads/)

#### Info ####
YUI Compressor seems to work well for 2.0.0 beta 1:
```
loghound.js      43,626 bytes
loghound-min.js  29,137 bytes
```

#### Code ####
To minify loghound.js:
```
java -jar yuicompressor.jar -v --charset utf-8 --line-break 4000 -o loghound-min.js loghound.js
```


---


## JsDoc ##
[JsDoc Toolkit](http://code.google.com/p/jsdoc-toolkit/) seems to be the tool to use.

#### Reference ####

http://code.google.com/p/jsdoc-toolkit/wiki/CommandlineOptions

http://code.google.com/p/jsdoc-toolkit/wiki/TagReference

#### Code ####
```
java -jar jsrun.jar app/run.js loghound.js -t=templates/jsdoc
```