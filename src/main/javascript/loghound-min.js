var LogHoundVer=[];LogHoundVer.major="2";LogHoundVer.minor="5";LogHoundVer.fix="0";LogHoundVer.build="$Rev$";if(LogHoundVer.build.length>5){LogHoundVer.build=LogHoundVer.build.substring(5).split(" ")[1]}else{LogHoundVer.build="alpha 1"}LogHoundVer.release="";LogHoundVer.getLongText=function(){var a=this.major+"."+this.minor+"."+this.fix;if(this.build!=""){a=a+"."+this.build}if(this.release!=""){a=a+"."+this.release}return a};LogHoundVer.getShortText=function(){return"v"+this.major+"."+this.minor+"."+this.fix+" "+this.release};function LogHoundLevel(c,b,a){this.id=c;this.text=b.toLowerCase();this.enabled=a}LogHoundLevel.prototype.getId=function(){return this.id};LogHoundLevel.prototype.getName=function(){return this.text};LogHoundLevel.prototype.isEnabled=function(){return this.enabled};LogHoundLevel.prototype.setEnabled=function(a){this.enabled=a};var LogHoundLevels=[];LogHoundLevels.getByName=function(b){b=b.toLowerCase();for(var a=0;a<this.length;a++){if(this[a].getName()==b){return this[a]}}return null};LogHoundLevels.getById=function(b){for(var a=0;a<this.length;a++){if(this[a].getId()==b){return this[a]}}return null};LogHoundLevels.getLevel=function(a){if(a==null){return null}if((typeof a)=="number"){return this.getById(a)}else{if((a instanceof String)||(typeof a)=="string"){return this.getByName(a)}else{if(!(a instanceof LogHoundLevel)){return null}}}return a};LogHoundLevels.addLevel=function(b){FctsTools.extend(b,LogHoundLevel);var a=new b();LogHoundLevels[a.getName().toUpperCase()]=a;LogHoundLevels.push(a)};function FatalLogHoundLevel(){FatalLogHoundLevel.baseConstructor.call(this,100,"fatal",true)}LogHoundLevels.addLevel(FatalLogHoundLevel);function ErrorLogHoundLevel(){ErrorLogHoundLevel.baseConstructor.call(this,90,"error",true)}LogHoundLevels.addLevel(ErrorLogHoundLevel);function WarnLogHoundLevel(){WarnLogHoundLevel.baseConstructor.call(this,80,"warn",true)}LogHoundLevels.addLevel(WarnLogHoundLevel);function InfoLogHoundLevel(){InfoLogHoundLevel.baseConstructor.call(this,70,"info",true)}LogHoundLevels.addLevel(InfoLogHoundLevel);function DebugLogHoundLevel(){DebugLogHoundLevel.baseConstructor.call(this,60,"debug",true)}LogHoundLevels.addLevel(DebugLogHoundLevel);function TraceLogHoundLevel(){TraceLogHoundLevel.baseConstructor.call(this,50,"trace",true)}LogHoundLevels.addLevel(TraceLogHoundLevel);if((typeof(LogHoundLevelPreload)!="undefined")&&(LogHoundLevelPreload instanceof Array)){for(var i=0;i<LogHoundLevelPreload.length;i++){LogHoundLevels.addLevel(LogHoundLevelPreload[i])}}function LogHound(){this.me=this;this.msgCount=0;this.logLevel=LogHoundLevels.DEBUG;this.msgDispMode="brief";this.killSwitch=false;this.enabled=true;this.initialised=false;this.helpEnabled=false;this.tagNameRegex=new RegExp("^[a-z][-a-z0-9_]+$","i");this._viewPlates=[];this._shadeState=false}LogHound.prototype.doSetup=function(){if(this.killSwitch){return}var g=this;this.tagMode="any";this.killSwitch=true;this.initialised=true;this.helpEntries=[];this.msgRecords=[];this.msgTags=[];this.msgFilters=[];this.msgFilters.push(new LogHoundMessageLevelFilter());var b=document.createElement("DIV");b.setAttribute("id","lhPlate");b.setAttribute("class","lhRndCorners");this.logPlate=document.body.appendChild(b);this.logPlate.lhIsShowing=true;this._createTitlePanel();this._createHelpPanel();this._createControlPanel();this._createTagPanel();this._createLogsPanel();var d=document.getElementsByClassName("lhBtn");for(var c=0;c<d.length;c++){FctsTools.addStyleClass(d[c],"lhBtnOut")}for(var c=0;c<d.length;c++){d[c].onmouseover=this.buttonMouseOver;d[c].onmouseout=this.buttonMouseOut;d[c].lhBtnState="off"}document.getElementById("lhTagCtrlAddBtn").onclick=function(h){g.moveTagAssignments("add")};document.getElementById("lhTagCtrlRemBtn").onclick=function(h){g.moveTagAssignments("rem")};document.getElementById("lhTagCtrlRemAllBtn").onclick=function(h){g.moveTagAssignments("remAll")};document.getElementById("lhTagCtrlAddAllBtn").onclick=function(h){g.moveTagAssignments("addAll")
};document.getElementById("lhCtrlMore").onclick=function(h){g.adjustMessagePaneSize(true)};document.getElementById("lhCtrlLess").onclick=function(h){g.adjustMessagePaneSize(false)};var f=document.getElementsByClassName("lhCtrlLvl");var e=function(h){g.showMessageLevel(this.id.slice(9))};for(var a=0;a<f.length;a++){f[a].onclick=e}document.getElementById("lhCtrlMsgDispModeBtn").onclick=function(h){g.setMessageLayout()};this.activateTagMode("any");this.setLogLevel(this.logLevel);for(var c=0;c<this._viewPlates.length;c++){this.setPanelDisplay(this._viewPlates[c],this._viewPlates[c].lhDisplayStart)}this.setShadeState(true);setTimeout("window.logHound.show(true)",800);this.logInfo("Log Hound is online...")};LogHound.prototype._createTitlePanel=function(){this.domTitlePanelPlate=document.createElement("DIV");this.domTitlePanelPlate.setAttribute("id","lhTitlePanelPlate");var b='<div id="lhTitlePanel" class="lhPlateColor lhRndCorners">';b+='<div id="lhBtnShade" class="lhTitlePanelElmt lhFont lhCtrl lhBtn" title="Toggle Message Panel">v</div>';b+='<div id="lhTitle" class="lhTitlePanelElmt lhFont">Log Hound v'+LogHoundVer.getLongText()+"</div>";b+='<div id="lhBtnHelp" class="lhTitlePanelElmt lhFont lhCtrl lhBtn" title="Toggle Help Panel">?</div>';b+='<div id="lhBtnTags" class="lhTitlePanelElmt lhFont lhCtrl lhBtn" title="Toggle Tags Panel">T</div>';b+='<div id="lhBtnCtrls" class="lhTitlePanelElmt lhFont lhCtrl lhBtn" title="Toggle Control Panel">C</div>';b+="</div>";this.domTitlePanelPlate.innerHTML=b;this.logPlate.appendChild(this.domTitlePanelPlate);var c=this;document.getElementById("lhBtnShade").onclick=function(d){c.setShadeState()};this.addHelpEntry(["lhBtnShade","Shade Mode Toggle: Toggles the Log Hound interface between shade display mode and normal display mode."]);document.getElementById("lhBtnHelp").onclick=function(d){c.toggleHelp(c.setPanelDisplay(c.domHelpPanelPlate))};this.addHelpEntry(["lhBtnHelp","Help Panel Toggle: Opens and closes the help panel."]);document.getElementById("lhBtnTags").onclick=function(d){c.setPanelDisplay(c.domTagCtrlPanelPlate)};this.addHelpEntry(["lhBtnTags","Tag Panel Toggle: Opens and closes the tag control panel."]);var a=document.getElementById("lhBtnCtrls");a.onclick=function(d){c.setPanelDisplay(c.domCtrlPanelPlate)};this.addHelpEntry(["lhBtnCtrls","Control Panel Toggle: Opens and closes the control panel."])};LogHound.prototype._createHelpPanel=function(){this.domHelpPanelPlate=document.createElement("DIV");this.domHelpPanelPlate.setAttribute("id","lhHelpPanelPlate");var b="Mouse over any interface element to see help for that element here.";var a='<div id="lhHelpPanel" class="lhPlateColor lhRndCorners lhSmFont">';a+=b;a+="</div>";this.domHelpPanelPlate.innerHTML=a;this.domHelpPanelPlate.lhDfltTxt=b;this.addPanel(this.domHelpPanelPlate)};LogHound.prototype._createControlPanel=function(){this.domCtrlPanelPlate=document.createElement("DIV");this.domCtrlPanelPlate.setAttribute("id","lhCtrlPanelPlate");var b='<div id="lhCtrlPanel" class="lhPlateColor lhRndCorners">';b+='<div id="lhCtrlMore" class="lhCtrl lhBtn lhFont" title="Show More">v</div>';b+='<div id="lhCtrlLess" class="lhCtrl lhBtn lhFont" title="Show Less">^</div>';b+='<div id="lhCtrlLvlSelectPlate"><select id="lhLvlSelect" name="lhLvlSelect" class="lhSmFont"></select></div>';b+='<div id="lhCtrlLvlPlate">';b+='<div id="lhCtrlLvlFatal" class="lhFatalMsg lhCtrlLvl lhCtrl lhBtn lhFont" title="Fatal">+</div>';b+='<div id="lhCtrlLvlError" class="lhErrorMsg lhCtrlLvl lhCtrl lhBtn lhFont" title="Error">+</div>';b+='<div id="lhCtrlLvlWarn" class="lhWarnMsg lhCtrlLvl lhCtrl lhBtn lhFont" title="Warn">+</div>';b+='<div id="lhCtrlLvlInfo" class="lhInfoMsg lhCtrlLvl lhCtrl lhBtn lhFont" title="Info">+</div>';b+='<div id="lhCtrlLvlDebug" class="lhDebugMsg lhCtrlLvl lhCtrl lhBtn lhFont" title="Debug">+</div>';b+='<div id="lhCtrlLvlTrace" class="lhTraceMsg lhCtrlLvl lhCtrl lhBtn lhFont" title="Trace">+</div>';b+="</div>";b+='<div id="lhCtrlMsgDispModeBtn" class="lhDispModeLable lhCtrl lhBtn lhSmFont" title="Toggle message display mode">D</div>';
b+='<div id="lhCtrlSearchPlate">';b+='<label for="lhSearchField" class="lhSmFont lhSearchLabel lhCtrl">Search:</label>';b+='<input type="text" id="lhSearchField" name="lhSearchField" class="lhSearchField lhSmFont" onkeyup="window.logHound.search()"/>';b+="</div>";b+="</div>";this.domCtrlPanelPlate.innerHTML=b;this.addPanel(this.domCtrlPanelPlate);this.addHelpEntry(["lhCtrlMore","Show more messages: Lengthens the log message pane to show more messages."]);this.addHelpEntry(["lhCtrlLess","Show less messages: Shortens the log message pane to show fewer messages."]);this.addHelpEntry(["lhSearchField","Search text entry: Message text is matched as you type, with non-matching log messages being automatically hidden."]);this.addHelpEntry(["lhCtrlLvlPlate","Log level visibility controls: Controls which log level messages will be visible in the message pane."]);this.addHelpEntry(["lhCtrlMsgDispModeBtn","Message detail toggle: Toggles the message pane between normal message display and detailed message display."]);var c=this;var d=document.getElementById("lhLvlSelect");var e;for(var a=0;a<LogHoundLevels.length;a++){e=LogHoundLevels[a];d.options[d.length]=new Option(e.getName(),e.getId())}FctsTools.sortOptionsByValue(d,function(g,f){return parseInt(f,10)-parseInt(g,10)});document.getElementById("lhLvlSelect").onchange=function(f){c.setLogLevel(parseInt(this.value,10))};this.addHelpEntry(["lhLvlSelect","Level Select: Levels are in descending order. Only messages corresponding to the level shown and those above will be logged after change."]);this.searchField=document.getElementById("lhSearchField")};LogHound.prototype._createTagPanel=function(){this.domTagCtrlPanelPlate=document.createElement("DIV");this.domTagCtrlPanelPlate.setAttribute("id","lhTagCtrlPanelPlate");var a='<div id="lhTagCtrlPanel" class="lhPlateColor lhRndCorners">';a+='<div id="lhAvailTagsPlate">';a+='<span class="lhSmFont">Tags:</span>';a+='<div><select id="lhAvailTagsSelect" class="lhSmFont" multiple="multiple" size="4"></select></div>';a+="</div>";a+='<div id="lhCtrlTagsPlate">';a+='<span id="lhTagCtrlAddBtn" class="lhTagCtrl lhBtn lhFont" title="Add Selected">&gt;</span>';a+='<span id="lhTagCtrlAddAllBtn" class="lhTagCtrl lhBtn lhFont" title="Add All">&gt;&gt;</span>';a+='<span id="lhTagCtrlRemBtn" class="lhTagCtrl lhBtn lhFont" title="Remove Selected">&lt;</span>';a+='<span id="lhTagCtrlRemAllBtn" class="lhTagCtrl lhBtn lhFont" title="Remove All">&lt;&lt;</span>';a+="</div>";a+='<div id="lhViewTagsPlate">';a+='<span class="lhSmFont">Viewing:</span>';a+='<div><select id="lhViewTagsSelect" class="lhSmFont" multiple="multiple" size="4"></select></div>';a+="</div>";a+='<div id="lhModTagsPlate">';a+='<span id="lhTagCtrlAnyBtn" class="lhTagCtrl lhSmFont lhBtn" title="Any">A</span>';a+='<span id="lhTagCtrlIntBtn" class="lhTagCtrl lhSmFont lhBtn" title="Intersection">I</span>';a+='<span id="lhTagCtrlOnyBtn" class="lhTagCtrl lhSmFont lhBtn" title="Only">O</span>';a+='<span id="lhTagCtrlExcBtn" class="lhTagCtrl lhSmFont lhBtn" title="Exclusion">E</span>';a+="</div></div>";this.domTagCtrlPanelPlate.innerHTML=a;this.addPanel(this.domTagCtrlPanelPlate);this.addHelpEntry(["lhAvailTagsSelect","Available Tags Select: Lists all unique available tags assigned to any messages."]);this.addHelpEntry(["lhViewTagsSelect","View Tags Select: Tags listed here will affect what messages are visible, depending on the active tag modifier."]);this.addHelpEntry(["lhTagCtrlAddBtn","Add Selected Tags: Moves tags selected in the available tags box to the viewing box."]);this.addHelpEntry(["lhTagCtrlAddAllBtn","Add All Tags: Moves all tags in the available tags box to the viewing box."]);this.addHelpEntry(["lhTagCtrlRemBtn","Remove Selected Tags: Moves tags selected in the viewing tags box to the available tags box."]);this.addHelpEntry(["lhTagCtrlRemAllBtn","Remove All Tags: Moves all tags in the viewing tags box back to the available tags box."]);var b=this;this.tagModBtns=[];this.tagModBtnAny=document.getElementById("lhTagCtrlAnyBtn");
this.tagModBtns[this.tagModBtns.length]=this.tagModBtnAny;this.tagModBtnAny.lhTagMode="any";this.tagModBtnAny.onclick=function(c){b.activateTagMode("any")};this.addHelpEntry(["lhTagCtrlAnyBtn",'"Any" Tags Modifier: Messages with any of the viewing tags will be visible.']);this.tagModBtnInt=document.getElementById("lhTagCtrlIntBtn");this.tagModBtns[this.tagModBtns.length]=this.tagModBtnInt;this.tagModBtnInt.lhTagMode="int";this.tagModBtnInt.onclick=function(c){b.activateTagMode("int")};this.addHelpEntry(["lhTagCtrlIntBtn",'"Intersection" Tags Modifier: Only messages that have all of the viewing tags will be visible.']);this.tagModBtnOny=document.getElementById("lhTagCtrlOnyBtn");this.tagModBtns[this.tagModBtns.length]=this.tagModBtnOny;this.tagModBtnOny.lhTagMode="ony";this.tagModBtnOny.onclick=function(c){b.activateTagMode("ony")};this.addHelpEntry(["lhTagCtrlOnyBtn",'"Only" Tags Modifier: Only messages that have all of the viewing tags and no other tags will be visible.']);this.tagModBtnExc=document.getElementById("lhTagCtrlExcBtn");this.tagModBtns[this.tagModBtns.length]=this.tagModBtnExc;this.tagModBtnExc.lhTagMode="exc";this.tagModBtnExc.onclick=function(c){b.activateTagMode("exc")};this.addHelpEntry(["lhTagCtrlExcBtn",'"Exclusion" Tags Modifier: Only messages that have none of the viewing tags will be visible.'])};LogHound.prototype._createLogsPanel=function(){this.domLogsPanelPlate=document.createElement("DIV");this.domLogsPanelPlate.setAttribute("id","lhLogsPanelPlate");var a='<div id="lhLogsPanel" class="lhPlateColor lhRndCorners">';a+='<div id="lhLogsPanelBody"></div>';a+="</div>";this.domLogsPanelPlate.innerHTML=a;this.addPanel(this.domLogsPanelPlate,true)};LogHound.prototype.addPanel=function(b,a){if(typeof b=="string"){b=document.getElementById(b)}b.lhShadeState=false;b.lhDisplayStart=!!a;b.lhDisplayStyle="none";this.logPlate.appendChild(b);this._viewPlates.push(b)};LogHound.prototype.buttonMouseOver=function(a){FctsTools.removeStyleClass(this,"lhBtnOut");FctsTools.removeStyleClass(this,"lhBtnOn");FctsTools.addStyleClass(this,"lhBtnOver")};LogHound.prototype.buttonMouseOut=function(a){FctsTools.removeStyleClass(this,"lhBtnOver");if(this.lhBtnState=="on"){FctsTools.addStyleClass(this,"lhBtnOn")}else{FctsTools.replaceStyleClass(this,"lhBtnOn","lhBtnOut")}};LogHound.prototype.activateTagMode=function(b){for(var a=0;a<this.tagModBtns.length;a++){if(this.tagModBtns[a].lhTagMode==b){this.tagModBtns[a].lhBtnState="on";FctsTools.addStyleClass(this.tagModBtns[a],"lhBtnOn");this.setTagFilterMode(b)}else{this.tagModBtns[a].lhBtnState="off";FctsTools.removeStyleClass(this.tagModBtns[a],"lhBtnOn");FctsTools.replaceStyleClass(this.tagModBtns[a],"lhBtnOn","lhBtnOut")}}};LogHound.prototype.addHelpEntry=function(a){this.helpEntries[this.helpEntries.length]=a};LogHound.prototype.toggleHelp=function(a){if(!!a){if(this.helpEnabled){return}this.helpEnabled=true;var e=this;var c=document.getElementById("lhHelpPanel");for(var b=0;b<this.helpEntries.length;b++){var d=document.getElementById(this.helpEntries[b][0]);d.lhHelpTxt=this.helpEntries[b][1];d.lhOrigMouseOver=d.onmouseover;d.lhOrigMouseOut=d.onmouseout;d.onmouseover=function(){if((typeof(this.lhOrigMouseOver)!="undefined")&&this.lhOrigMouseOver!=null){this.lhOrigMouseOver()}c.innerHTML=this.lhHelpTxt};d.onmouseout=function(){if((typeof(this.lhOrigMouseOut)!="undefined")&&this.lhOrigMouseOut!=null){this.lhOrigMouseOut()}c.innerHTML=e.domHelpPanelPlate.lhDfltTxt}}}else{if(!this.helpEnabled){return}this.helpEnabled=false;var d=null;for(var b=0;b<this.helpEntries.length;b++){d=document.getElementById(this.helpEntries[b][0]);d.lhHelpTxt=this.helpEntries[b][1];d.onmouseover=d.lhOrigMouseOver;d.onmouseout=d.lhOrigMouseOut}}};LogHound.prototype.setMessageLayout=function(d){if(d==null){this.msgDispMode=(this.msgDispMode=="brief"?"detail":"brief")}else{if((d instanceof String)||((typeof d)=="string")){if(this.msgDispMode==d){return false}if("brief"==d||"detail"==d){this.msgDispMode=d}}else{return false
}}if(!this.initialised||!this.enabled){return false}var c=document.getElementsByClassName("lhMsgRecBrief");for(var a=0;a<c.length;a++){c[a].style.display=(this.msgDispMode=="brief"?"":"none")}var b=document.getElementsByClassName("lhMsgRecDetail");for(var a=0;a<b.length;a++){b[a].style.display=(this.msgDispMode=="brief"?"none":"")}return true};LogHound.prototype.getMessageLayout=function(){return this.msgDispMode};LogHound.prototype.setTagFilterMode=function(b){this.tagMode=((b!="any"&&b!="int"&&b!="exc"&&b!="ony")?"any":b);var a=document.getElementById("lhViewTagsSelect");this.addMsgFilter(new LogHoundMessageTagFilter(FctsTools.getOptionValues(a),this.tagMode));this.applyMsgFilters()};LogHound.prototype.setKillSwitch=function(a){if(a!=null&&a==false){this.killSwitch=false}else{this.killSwitch=true}};LogHound.prototype.enableLogging=function(a){if(!this.initialised){return false}if(a!=null&&a==false){this.enabled=false}else{this.enabled=true}};LogHound.prototype.isLoggingEnabled=function(){return this.enabled};LogHound.prototype.show=function(a){if(!this.initialised||!this.enabled){return}a=FctsTools.parseToBool(a,["show"]);if(a==null){a=!this.logPlate.lhIsShowing}if(a){this.logPlate.lhIsShowing=true;this.logPlate.style.display="table";this.interfaceMonitor("start")}else{this.logPlate.lhIsShowing=false;this.interfaceMonitor("stop");this.logPlate.style.display="none"}};LogHound.prototype.isShowing=function(){return this.logPlate.lhIsShowing};LogHound.prototype.getLogLevel=function(){return this.logLevel};LogHound.prototype.setLogLevel=function(c){c=LogHoundLevels.getLevel(c);if(c==null){return}this.logLevel=c;if(!this.initialised||!this.enabled){return false}var b=document.getElementById("lhLvlSelect");if(c.getId()!=b.options[b.selectedIndex].value){for(var a=0;a<b.options.length;a++){if(c.getId()==b.options[a].value){b.selectedIndex=a}}}};LogHound.prototype.interfaceMonitor=function(a){if(!this.initialised||!this.enabled){return}a=FctsTools.parseToBool(a,["start"]);if(a==null){a=(!this.debugWindowMonitorRef)}if(a){this.debugWindowMonitorRef=setInterval("window.logHound.stickLogPlateTopRight()",200)}else{clearInterval(this.debugWindowMonitorRef);this.debugWindowMonitorRef=null}};LogHound.prototype.showMessageLevel=function(d,a){var c=null;if((typeof d)=="number"||(d instanceof String)||((typeof d)=="string")){c=LogHoundLevels.getLevel(d)}else{if(d instanceof LogHoundLevel){c=d}else{return false}}a=FctsTools.parseToBool(a,["show"]);var b=document.getElementById("lhCtrlLvl"+FctsTools.capitaliseFirstLetter(c.getName()));a=(a==null?!(b.innerHTML=="+"):a);if(!a){b.innerHTML="&ndash;";c.setEnabled(false)}else{b.innerHTML="+";c.setEnabled(true)}this.applyMsgFilters()};LogHound.prototype.addMsgFilter=function(d){if(!d.getId||!(d instanceof LogHoundMessageFilter)){alert("Argumented object is not a LogHoundMessageFilter.");return}var b=[];var a=null;for(var c=0;c<this.msgFilters.length;c++){a=this.msgFilters[c];if(a.getId()!=d.getId()){b.push(a)}}this.msgFilters=b;this.msgFilters.push(d)};LogHound.prototype.applyMsgFilters=function(){for(var a=0;a<this.msgRecords.length;a++){this.msgRecords[a]["element"].style.display=(this.filterMsg(this.msgRecords[a])?"block":"none")}};LogHound.prototype.filterMsg=function(b){for(var a=0;a<this.msgFilters.length;a++){if(!this.msgFilters[a].showMessage(b)){return false}}return true};LogHound.prototype.setShadeState=function(a){if(!this.initialised||!this.enabled){return}this._shadeState=this.domLogsPanelPlate.style.display=="none";a=FctsTools.parseToBool(a);a=(a==null?!this._shadeState:a);if(this._shadeState==a){return}var c=document.getElementById("lhBtnShade");for(var b=0;b<this._viewPlates.length;b++){var d=this._viewPlates[b];if(a){d.lhShadeSave=(FctsTools.getStyleValue(d,"display")!="none");this.setPanelDisplay(d,false);d.lhShadeState=true}else{d.lhShadeState=false;this.setPanelDisplay(d,d.lhShadeSave)}}c.innerHTML=(a?"v":"^");this._shadeState=a};LogHound.prototype.isShaded=function(){this._shadeState
};LogHound.prototype.setPanelDisplay=function(a,d){if(a.lhShadeState||!this.initialised||!this.enabled){return}var b=FctsTools.getStyleValue(a,"display");if(a.lhDisplayStyle=="none"){a.lhDisplayStyle=b}var c=(b!="none");d=FctsTools.parseToBool(d);d=(d==null?!c:d);if(c==d){return}a.style.display=(d?a.lhDisplayStyle:"none");return d};LogHound.prototype.adjustMessagePaneSize=function(b){if(this._shadeState||!this.initialised||!this.enabled){return}if((typeof b)==="boolean"){b=(b?75:-75)}else{if((b instanceof String)||((typeof b)=="string")){b=FctsTools.parseToBool(b,["more"]);b=(b?75:-75)}else{if((typeof b)==="number"){}else{return false}}}var a=parseInt(FctsTools.getStyleValue(document.getElementById("lhLogsPanelBody"),"height"),10)+b;return this.setMessagePaneSize(this.domLogsPanelPlate.offsetHeight+b)};LogHound.prototype.setMessagePaneSize=function(b){if(this._shadeState||!this.initialised||!this.enabled){return}if((typeof b)!=="number"){return false}var c=document.getElementById("lhLogsPanelBody");var a=parseInt(FctsTools.getStyleValue(c,"height"),10);if(a==b||b>600||b<75){return false}c.style.height=b+"px"};LogHound.prototype.stickLogPlateTopLeft=function(){var a=$(window).scrollTop();this.logPlate.style.left=0;this.logPlate.style.top=(0+a);this.logPlate.style.zIndex=5000};LogHound.prototype.stickLogPlateTopRight=function(){var d=this.logPlate.offsetHeight;var a=this.logPlate.offsetWidth;var c=FctsTools.windowHeight();var b=FctsTools.windowWidth();var e=FctsTools.scrollTop();var f=FctsTools.scrollLeft();this.logPlate.style.left=((FctsTools.viewWidth()-a+f)+"px");this.logPlate.style.top=(e+"px");this.logPlate.style.zIndex=""+5000};LogHound.prototype.stickLogPlateBottomLeft=function(){var b=this.logPlate.offsetHeight;var a=FctsTools.windowHeight();var c=FctsTools.scrollTop();this.logPlate.style.left=0;this.logPlate.style.top=(a-b+c);this.logPlate.style.zIndex=5000};LogHound.prototype.search=function(b){if(FctsTools.isBlank(b)){b=this.searchField.value}else{this.searchField.value=b}if(FctsTools.isBlank(b)){b=""}b=FctsTools.escapeRegex(b);var a=new LogHoundTextSearchFilter(b);this.addMsgFilter(a);this.applyMsgFilters()};LogHound.prototype.addTags=function(d){if(d==null||!d.length||d.length<1){return true}for(var b=0;b<d.length;b++){if(!(this.tagNameRegex.test(d[b]))){return false}}var c=document.getElementById("lhAvailTagsSelect");foundMatch:for(var b=0;b<d.length;b++){for(var a=0;a<this.msgTags.length;a++){if(d[b].toLowerCase()==this.msgTags[a].toLowerCase()){continue foundMatch}}if(FctsTools.isBlank(d[b])){continue}this.msgTags.push(d[b]);c.options[c.length]=new Option(d[b],d[b])}FctsTools.sortOptionsByText(c);return true};LogHound.prototype.logTrace=function(){this.log(LogHoundLevels.TRACE,arguments)};LogHound.prototype.logDebug=function(){this.log(LogHoundLevels.DEBUG,arguments)};LogHound.prototype.logInfo=function(){this.log(LogHoundLevels.INFO,arguments)};LogHound.prototype.logWarn=function(){this.log(LogHoundLevels.WARN,arguments)};LogHound.prototype.logError=function(){this.log(LogHoundLevels.ERROR,arguments)};LogHound.prototype.logFatal=function(){this.log(LogHoundLevels.FATAL,arguments)};LogHound.prototype.parseLoggingArgs=function(){var c=[];for(var e=0;e<arguments.length;e++){c[e]=arguments[e]}var d=[];for(var e=0;e<c.length;e++){if(c[e]==null){continue}if((typeof c[e])=="object"&&!(c[e] instanceof Array)&&c[e].length){for(var b=0;b<c[e].length;b++){c[c.length]=c[e][b]}}else{if(c[e] instanceof Array){d.tags=c[e];var f=[];for(var a=0;a<d.tags.length;a++){if(!FctsTools.isBlank(d.tags[a])){f[f.length]=d.tags[a]}}d.tags=f}else{if(c[e] instanceof LogHoundLevel){d.level=c[e]}else{if(c[e] instanceof String||(typeof c[e])==="string"){d.text=c[e]}else{if(c[e] instanceof Error){d.error=c[e]}}}}}}return d};LogHound.prototype.log=function(){if(!this.initialised||!this.enabled){return false}var m=this.parseLoggingArgs(arguments);m.tags=(m.tags==null?{}:m.tags);m.timestamp=new Date();if(m.level==null||this.logLevel.getId()>m.level.getId()){return false
}if(FctsTools.isBlank(m.text)){return false}if(!this.addTags(m.tags)){return false}m.number=this.msgCount;this.msgRecords.push(m);this.msgCount++;var n=document.createElement("DIV");var j=FctsTools.capitaliseFirstLetter(m.level.getName());var d="logmsg"+m.number;n.setAttribute("id",d);n.setAttribute("class","lh"+j+"Msg logMsg");n.setAttribute("className","lh"+j+"Msg logMsg");n.setAttribute("lhLogLevel",m.level.getName());n.style.display=(m.level.isEnabled()==true?"block":"none");var l=m.text;if(m.error!=null){l+="<br/><hr/>";l+="Error: "+m.error.name+" at line "+m.error.lineNumber+"<br/>";l+="Message: "+m.error.message+"<br/>";if(m.error.stack!=null){l+="Stack:<br/>"+m.error.stack.replace("\n","<br/>")}}var e=((this.msgDispMode=="detail")?"":"none");var h='<table id="lhMsgDetail_'+m.number+'" class="lhMsgRecDetail" style="display:'+e+';"><tr>';h+='<td class="lhMsgNum2 lhMsgElmt lhSmFont"><div>'+m.number+"</div></td>";h+='<td class="lhMsgLvl lhMsgElmt lhSmFont"><div>'+m.level.getName()+"<div></td>";h+='<td class="lhMsgTime lhMsgElmt lhSmFont">'+this.getTimestampText(m.timestamp)+"</td>";h+='<td class="lhMsgTags lhMsgElmt lhSmFont"><table><tr><td class="lhSmFont">'+((m.tags instanceof Array)?m.tags:"")+"</td></tr></table></td>";h+="</tr><tr>";h+='<td colspan="4" class="lhMsgTxtDetail lhMsgElmt lhFont"><table><tr><td class="lhSmFont">'+l+"</td></tr></table></td>";h+="</tr></table>";var f=((this.msgDispMode=="brief")?"":"none");var a='<table id="lhMsgBrief_'+m.number+'" class="lhMsgRecBrief" style="display:'+f+'"><tr>';a+='<td class="lhMsgNum lhMsgElmt lhSmFont"><div>'+m.number+"</div></td>";a+='<td class="lhMsgTime lhMsgElmt lhSmFont">'+this.getTimestampText(m.timestamp)+"</td>";a+='<td class="lhMsgTxt lhMsgElmt lhSmFont"><table><tr><td class="lhSmFont">'+l+"</td></tr></table></td>";a+="</tr></table>";n.innerHTML=h+a;var c=document.getElementById("lhLogsPanelBody");var b=c.childNodes;if(b==null||b.length<1){c.appendChild(n)}else{c.insertBefore(n,b[0])}var g="lhMsg"+((this.msgDispMode=="detail")?"Detail":"Brief")+"_"+m.number;var k=document.getElementById(g);k.style.display="none";k.style.display="";m.element=document.getElementById(d);return true};LogHound.prototype.getMessageRecords=function(){return this.msgRecords};LogHound.prototype.getTimestampText=function(e){var a=e.getHours();var f=e.getMinutes();var b=e.getSeconds();var c=e.getMilliseconds();var d=((a<10)?"0"+a:a)+":";d+=((f<10)?"0"+f:f)+":";d+=((b<10)?"0"+b:b)+".";d+=((c<10)?"00"+c:((c<100)?"0"+c:c));return d};LogHound.prototype.moveTagAssignments=function(c){var a=document.getElementById("lhAvailTagsSelect");var b=document.getElementById("lhViewTagsSelect");if(c=="add"){if(a.options.length<1||a.selectedIndex<0){return}FctsTools.moveSelected(a,b)}else{if(c=="addAll"){if(a.options.length<1){return}FctsTools.moveAllOptions(a,b)}else{if(c=="rem"){if(b.options.length<1||b.selectedIndex<0){return}FctsTools.moveSelected(b,a)}else{if(c=="remAll"){if(b.options.length<1){return}FctsTools.moveAllOptions(b,a)}}}}FctsTools.sortOptionsByText(a);FctsTools.sortOptionsByText(b);this.addMsgFilter(new LogHoundMessageTagFilter(FctsTools.getOptionValues(b),this.tagMode));this.applyMsgFilters()};LogHound.prototype.getViewTags=function(){return FctsTools.getOptionValues(document.getElementById("lhViewTagsSelect"))};LogHound.prototype.getAvailTags=function(){return FctsTools.getOptionValues(document.getElementById("lhAvailTagsSelect"))};function LogHoundMessageFilter(a){if(FctsTools.isBlank(a)){throw new Error("Message filter ID cannot be blank.")}this.id=a}LogHoundMessageFilter.prototype.getId=function(){return this.id};LogHoundMessageFilter.prototype.showMessage=function(a){return true};function LogHoundMessageTagFilter(a,b){LogHoundMessageTagFilter.baseConstructor.call(this,"lhMsgTagFilter");this.tagz=a;this.tagMode=((b==null||b=="")?"any":b)}FctsTools.extend(LogHoundMessageTagFilter,LogHoundMessageFilter);LogHoundMessageTagFilter.prototype.showMessage=function(c){if(this.tagz==null||this.tagz.length<1){return true
}if(this.tagMode=="int"){if(!(c.tags instanceof Array)){return false}if(c.tags.length<this.tagz.length){return false}}if(this.tagMode=="ony"){if(c.tags.length!=this.tagz.length){return false}}var a=false;var e=false;for(var d=0;d<this.tagz.length;d++){e=false;for(var b=0;b<c.tags.length;b++){a=(c.tags[b].toLowerCase()==this.tagz[d].toLowerCase());if(this.tagMode=="int"||this.tagMode=="ony"){e=(e||a)}else{if(a&&this.tagMode=="any"){return true}else{if(a&&this.tagMode=="exc"){return false}}}}if((this.tagMode=="int"||this.tagMode=="ony")&&!e){return false}}return(this.tagMode=="exc"||this.tagMode=="int"||this.tagMode=="ony")};LogHoundMessageTagFilter.prototype.hasTag=function(a,c){for(var b=0;b<c.length;b++){if(c[tagIdx]==a){return true}}return false};function LogHoundTextSearchFilter(a){LogHoundTextSearchFilter.baseConstructor.call(this,"lhTxtSearchFilter");this.searchText=a;this.regex=new RegExp(a,"i")}FctsTools.extend(LogHoundTextSearchFilter,LogHoundMessageFilter);LogHoundTextSearchFilter.prototype.showMessage=function(a){if(this.searchText==""){return true}return a.text.search(this.regex)>=0};function LogHoundMessageLevelFilter(){LogHoundTextSearchFilter.baseConstructor.call(this,"lhMsgLvlFilter")}FctsTools.extend(LogHoundMessageLevelFilter,LogHoundMessageFilter);LogHoundMessageLevelFilter.prototype.showMessage=function(a){return a.level.isEnabled()};if(window.logHound==null){window.logHound=new LogHound()};