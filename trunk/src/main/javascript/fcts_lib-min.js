var FctsJSLib=new Object();FctsJSLib.Version=new Object();if(!document.getElementsByClassName){document.getElementsByClassName=function(a){var v=a.split(" ");var w="";var g=[];var d,i,h;if(document.evaluate){var t="http://www.w3.org/1999/xhtml";var c=(document.documentElement.namespaceURI===t)?t:null;for(var q=0,r=v.length;q<r;q+=1){w+="[contains(concat(' ', @class, ' '), ' "+v[q]+" ')]"}try{h=document.evaluate(".//*"+w,document,c,0,null)}catch(u){h=document.evaluate(".//*"+w,document,null,0,null)}while((d=h.iterateNext())){g.push(d)}}else{w=[];h=(document.all)?document.all:document.getElementsByTagName("*");for(var p=0,b=v.length;p<b;p+=1){w.push(new RegExp("(^|\\s)"+v[p]+"(\\s|$)"))}for(var o=0,f=h.length;o<f;o+=1){i=h[o];d=false;for(var n=0,s=w.length;n<s;n+=1){d=w[n].test(i.className);if(!d){break}}if(d){g.push(i)}}}return g}}var FctsTools=new Array();FctsTools.windowHeight=function(){return((window.innerHeight)?window.innerHeight:document.body.offsetHeight)};FctsTools.windowWidth=function(){return((window.innerWidth)?window.innerWidth:document.body.offsetWidth)};FctsTools.viewHeight=function(){return Math.max(document.documentElement.clientHeight,document.body.clientHeight)};FctsTools.viewWidth=function(){return Math.max(document.documentElement.clientWidth,document.body.clientWidth)};FctsTools.scrollTop=function(){if(typeof pageYOffset!="undefined"){return pageYOffset}else{var b=document.body;var a=document.documentElement;a=(a.clientHeight)?a:b;return a.scrollTop}};FctsTools.scrollLeft=function(){return document.body.scrollLeft};FctsTools.typeOf=function(b){var a=typeof b;if(a==="object"){if(b){if(typeof b.length==="number"&&!(b.propertyIsEnumerable("length"))&&typeof b.splice==="function"){a="array"}}else{a="null"}}return a};FctsTools.extend=function(c,a){function b(){}b.prototype=a.prototype;c.prototype=new b();c.prototype.constructor=c;c.baseConstructor=a;c.superClass=a.prototype};FctsTools.removeSelected=function(b){var d=new Array();var a=new Array();for(var c=0;c<b.options.length;c++){if(b.options[c].selected){d[d.length]=b.options[c]}else{a[a.length]=b.options[c]}}FctsTools.setOptions(b,a);return d};FctsTools.getSelected=function(b){var c=new Array();for(var a in b.options){if(b.options[a].selected){c[c.length]=b.options[a]}}return c};FctsTools.setOptions=function(b,c){b.options.length=0;for(var a in c){b.options[b.options.length]=c[a]}};FctsTools.addOptions=function(b,c){for(var a in c){b.options[b.options.length]=c[a]}};FctsTools.moveSelected=function(a,b){FctsTools.addOptions(b,FctsTools.removeSelected(a))};FctsTools.moveAllOptions=function(c,d){var b=new Array();for(var a=0;a<c.options.length;a++){b[a]=c.options[a]}for(var a=0;a<b.length;a++){d.options[d.options.length]=new Option(b[a].text,b[a].value)}c.length=0};FctsTools.getOptionValues=function(a){var b=new Array();for(var c=0;c<a.options.length;c++){b[c]=a.options[c].value}return b};FctsTools.isBlankRegex=new RegExp("^[ \t]+$");FctsTools.isBlank=function(a){return((typeof a)=="undefined"||a==null||a==""||this.isBlankRegex.test(a))};FctsTools.sortOptionsByValue=function(b,f){var d=new Array();var a=new Array();for(var e=0;e<b.options.length;e++){d[e]=b.options[e];a[e]=b.options[e].value}b.options.length=0;if(f==null||!f){a.sort(function(j,h){if(FctsTools.isBlank(j)&&FctsTools.isBlank(h)){return 0}else{if(FctsTools.isBlank(j)||FctsTools.isBlank(h)){return(FctsTools.isBlank(j)?-1:1)}}if(document.all){j=new String(j);h=new String(h)}j=j.toLowerCase();h=h.toLowerCase();for(var g=0;g<j.length;g++){if(j.charCodeAt(g)==h.charCodeAt(g)){continue}return j.charCodeAt(g)-h.charCodeAt(g)}return 0})}else{a.sort(f)}for(var e=0;e<a.length;e++){for(var c=0;c<d.length;c++){if(a[e]==d[c].value){b.options[b.options.length]=d[c];d.splice(c--,1);continue}}}};FctsTools.sortOptionsByText=function(a,e){var c=new Array();var f=new Array();for(var d=0;d<a.options.length;d++){c[d]=a.options[d];f[d]=a.options[d].text}a.options.length=0;if(e==null||!e){f.sort(function(j,h){if(FctsTools.isBlank(j)&&FctsTools.isBlank(h)){return 0
}else{if(FctsTools.isBlank(j)||FctsTools.isBlank(h)){return(FctsTools.isBlank(j)?-1:1)}}if(document.all){j=new String(j);h=new String(h)}j=j.toLowerCase();h=h.toLowerCase();for(var g=0;g<j.length;g++){if(j.charCodeAt(g)==h.charCodeAt(g)){continue}return j.charCodeAt(g)-h.charCodeAt(g)}return 0})}else{f.sort(e)}for(var d=0;d<f.length;d++){for(var b=0;b<c.length;b++){if(f[d]==c[b].text){a.options[a.options.length]=c[b];c.splice(b--,1);continue}}}};FctsTools.escapeRegex=function(a){if(!arguments.callee.sRE){var b=["/",".","*","+","?","|","(",")","[","]","{","}","\\"];arguments.callee.sRE=new RegExp("(\\"+b.join("|\\")+")","g")}return a.replace(arguments.callee.sRE,"\\$1")};FctsTools.addStyleClass=function(b,c){if(b.className==null||b.className==""){b.className=c;return}var a=b.className.split(" ");for(idx in a){if(a[idx]==c){return}}a.push(c);b.className=a.join(" ")};FctsTools.removeStyleClass=function(b,c){if(b.className==null||b.className==""){return}if(b.className==c){b.className=""}var a=b.className.split(" ");var d=new Array();for(idx in a){if(a[idx]==c){continue}d.push(a[idx])}b.className=d.join(" ")};FctsTools.replaceStyleClass=function(a,b,c){this.removeStyleClass(a,b);this.addStyleClass(a,c)};FctsTools.getStyleValue=function(a,b,c){if(window.getComputedStyle){return getComputedStyle(a,c)[b]}else{return a.currentStyle[b]}};FctsTools.parseToBool=function(b,a){if((typeof b)=="undefined"||b==null){return null}if((typeof b)=="boolean"){return b}if(!(b instanceof String)&&!((typeof b)=="string")){return null}if(a!=null&&(a instanceof Array)){for(var c=0;c<a.length;c++){if(b==a[c]){return true}}}return(b=="true")};FctsTools.capitaliseFirstLetter=function(a){return a.charAt(0).toUpperCase()+a.slice(1).toLowerCase()};