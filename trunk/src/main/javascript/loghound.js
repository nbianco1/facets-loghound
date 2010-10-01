/**
 * LogHound is a Javascript logger you can use to gain insight into what is going on in your
 * Javascript code.
 *
 * ['message',LogHoundLevels['DEBUG'],{'tags','group1 group2'},errorObj]
 *
 */

var LogHoundVer = new Array();
LogHoundVer['major'] = '2';
LogHoundVer['minor'] = '0';
LogHoundVer['fix'] = '0';
LogHoundVer['release'] = 'alpha 1';
LogHoundVer.getLongText = function() {
    return this.major+'.'+this.minor+'.'+this.fix+' '+this.release;
};
LogHoundVer.getShortText = function() {
    return 'v'+this.major+'.'+this.minor+'.'+this.fix+' '+this.release;
};



var LogHoundHelp = new Array();
LogHoundHelp[LogHoundHelp.length] = ['lhCtrlShadeToggle','Shade Mode Toggle: Toggles the Log Hound interface between shade display mode and normal display mode.'];
LogHoundHelp[LogHoundHelp.length] = ['lhCtrlHelp','Help Panel Toggle: Opens and closes the help panel.'];
LogHoundHelp[LogHoundHelp.length] = ['lhCtrlTags','Tag Panel Toggle: Opens and closes the tag control panel.'];

LogHoundHelp.enableHelp = function() {
    var target = null;
    var curMouseOver
    for(i=0; i<this.length; i++) {
        target = document.getElementById(this[i][0]);
        //target.onmouseover()
    }
};




var LogHoundUtils = new Object();
LogHoundUtils.extractMessage = function(argz) {
    return LogHoundUtils.extract(argz, 'message');
};
LogHoundUtils.extractTags = function(argz) {
    return LogHoundUtils.extract(argz, 'tags');
};
LogHoundUtils.extract = function(argz, target) {
    for(var i=0; i<argz.length; i++) {
        if(target=='tags' && argz[i] instanceof Array) {
            return argz[i];
        } else if(target=='level' && argz[i] instanceof LogHoundLevel) {
            return argz[i];
        } else if(target=='message' && (argz[i] instanceof String || (typeof argz[i])==='string')) {
            return argz[i];
        }
    }
}
/**
 * Object array defining all the log level objects and their specific attributes.
 */
var LogHoundLevels = new Array();
LogHoundLevels.getByText = function(text) {
    for(idx=0; idx<this.length; idx++) {
        if(this[idx].getText() == text) {
            return this[idx];
        }
    }
};
LogHoundLevels.getById = function(id) {
    for(idx=0; idx<this.length; idx++) {
        if(this[idx].getId() == id) {
            return this[idx];
        }
    }
};
LogHoundLevels.getLevel = function(level) {
    if((typeof level)=="number") {
        return this.getById(level);
    } else if((typeof level)=="string") {
        return this.getByText(level);
    } else if(!(level instanceof LogHoundLevel)) {
        return null;
    }
    return level;
};
LogHoundLevels.addLevel = function(newLevelFn) {
    FctsTools.extend(newLevelFn, LogHoundLevel);
    var newLevel = new newLevelFn();
    LogHoundLevels[newLevel.getText().toUpperCase()] = newLevel;
    LogHoundLevels.push(newLevel);
};

function LogHoundLevel(id, text, enabled) {
    this.id = id;
    this.text = text;
    this.enabled = enabled;
}
LogHoundLevel.prototype.getId = function() {
    return this.id;
};
LogHoundLevel.prototype.getText = function() {
    return this.text;
};
LogHoundLevel.prototype.isEnabled = function() {
    return this.enabled;
};
LogHoundLevel.prototype.setEnabled = function(enable) {
    this.enabled = enable;
};
// Fatal Log Level
function FatalLogHoundLevel() {
    FatalLogHoundLevel.baseConstructor.call(this, 100, 'fatal', true);
}
LogHoundLevels.addLevel(FatalLogHoundLevel);
// Error Log Level
function ErrorLogHoundLevel() {
    ErrorLogHoundLevel.baseConstructor.call(this, 90, 'error', true);
}
LogHoundLevels.addLevel(ErrorLogHoundLevel);
// Warn Log Level
function WarnLogHoundLevel() {
    WarnLogHoundLevel.baseConstructor.call(this, 80, 'warn', true);
}
LogHoundLevels.addLevel(WarnLogHoundLevel);
// Info Log Level
function InfoLogHoundLevel() {
    InfoLogHoundLevel.baseConstructor.call(this, 70, 'info', true);
}
LogHoundLevels.addLevel(InfoLogHoundLevel);
// Debug Log Level
function DebugLogHoundLevel() {
    DebugLogHoundLevel.baseConstructor.call(this, 60, 'debug', true);
}
LogHoundLevels.addLevel(DebugLogHoundLevel);
// Trace Log Level
function TraceLogHoundLevel() {
    TraceLogHoundLevel.baseConstructor.call(this, 50, 'trace', true);
}
LogHoundLevels.addLevel(TraceLogHoundLevel);

function PageLogHoundLevel() {
    TraceLogHoundLevel.baseConstructor.call(this, 40, 'page', true);
}
var LogHoundLevelPreload = new Array();
LogHoundLevelPreload[0] = PageLogHoundLevel;

// Load predefined extra log levels
if(LogHoundLevelPreload!=null && (LogHoundLevelPreload instanceof Array)) {
    for(i=0; i<LogHoundLevelPreload.length; i++) {
        LogHoundLevels.addLevel(LogHoundLevelPreload[i]);
    }
}


/**
 * Javascript logger.
 */
function LogHound() {
    this.me = this;
    this.msgCount = 0;
    this.logLevel = LogHoundLevels['DEBUG'];
    this.killSwitch = false;
    this.enabled = true;
    this.initialised = false;
}
LogHound.prototype.doSetup = function() {
    if(this.killSwitch) {
        return;
    }
    this.tagMode = 'A';
    this.msgDispMode = 'brief'; // detail, brief
    this.killSwitch = true;
    this.initialised = true;
    this.msgRecords = new Array();
    this.msgTags = new Array();
    this.msgFilters = new Array();
    this.msgFilters.push(new LogHoundMessageLevelFilter());
    var logPlate = document.createElement('DIV');
    logPlate.setAttribute('id', 'lhPlate');
    this.logPlate = document.body.appendChild(logPlate);

    this.logPlateHead = document.createElement('DIV');
    this.logPlateHead.setAttribute('id', 'lhPlateHead');
    var titlebar = '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr>';
    titlebar +=    '<td><span id="lhCtrlShadeToggle" class="lhTitleCtrl lhBtn" title="Hide">v</span></td>';
    titlebar +=    '<td class="lhTitle">Log Hound v'+LogHoundVer.getLongText()+'</td>'
    titlebar +=    '<td><span id="lhCtrlHelp" class="lhCtrlHelp lhBtn">?</span></td>';
    titlebar +=    '<td><span id="lhCtrlTags" class="lhCtrlTags lhBtn">T</span></td>';
    titlebar +=    '<td><span id="lhTitleToggleCtrl" class="lhTitleCtrl lhBtn" title="Toggle Control Panel">&#149;</span></td>'
    titlebar +=    '</tr></table>';
    this.logPlateHead.innerHTML = titlebar;
    this.logPlate.appendChild(this.logPlateHead);

    // Help panel creation code.
    this.logPlateHelpPanel = document.createElement('DIV');
    this.logPlateHelpPanel.setAttribute('id', 'lhPlateHelpPanel');
    this.logPlateHelpPanel.innerHTML = 'Help Bar';
    this.logPlate.appendChild(this.logPlateHelpPanel);

    // Control panel creation code.
    this.logPlateCtrlPanel = document.createElement('DIV');
    this.logPlateCtrlPanel.setAttribute('id', 'lhPlateCtrlPanel');
    var ctrlbar = '<div id="lhCtrlMore" class="lhCtrlSize lhCtrl lhBtn" title="Show More">v</div>';
    ctrlbar +=    '<div id="lhCtrlLess" class="lhCtrlSize lhCtrl lhBtn" title="Show Less">^</div>';
    ctrlbar +=    '<div id="lhCtrlLvlSelectPlate"><select id="lhLvlSelect" name="lhLvlSelect"></select></div>';
    ctrlbar +=    '<div id="lhCtrlLvlPlate">';
    ctrlbar +=    '<span id="lhCtrlLvlFatal" class="lhFatalMsg lhCtrlLvl lhCtrl lhBtn" title="Fatal">+</span>';
    ctrlbar +=    '<span id="lhCtrlLvlError" class="lhErrorMsg lhCtrlLvl lhCtrl lhBtn" title="Error">+</span>';
    ctrlbar +=    '<span id="lhCtrlLvlWarn" class="lhWarnMsg lhCtrlLvl lhCtrl lhBtn" title="Warn">+</span>';
    ctrlbar +=    '<span id="lhCtrlLvlInfo" class="lhInfoMsg lhCtrlLvl lhCtrl lhBtn" title="Info">+</span>';
    ctrlbar +=    '<span id="lhCtrlLvlDebug" class="lhDebugMsg lhCtrlLvl lhCtrl lhBtn" title="Debug">+</span>';
    ctrlbar +=    '<span id="lhCtrlLvlTrace" class="lhTraceMsg lhCtrlLvl lhCtrl lhBtn" title="Trace">+</span>';
    ctrlbar +=    '</div>';
    ctrlbar +=    '<div id="lhCtrlMsgDispModePlate">';
    ctrlbar +=    '<span id="lhCtrlMsgDispModeBtn" class="lhDispModeLable lhCtrl lhBtn" title="Toggle message display mode">D</span>';
    ctrlbar +=    '</div>';
    ctrlbar +=    '<div id="lhCtrlSearchPlate">';
    ctrlbar +=    '<label for="lhSearchField" class="lhSearchLabel lhCtrl">Search:</label>';
    ctrlbar +=    '<input type="text" id="lhSearchField" name="lhSearchField" class="lhSearchField" onkeyup="window.logHound.search()"/>';
    ctrlbar +=    '</div>';
    this.logPlateCtrlPanel.innerHTML = ctrlbar;
    this.logPlate.appendChild(this.logPlateCtrlPanel);

    // Tag panel creation code
    this.logPlateTagPanel = document.createElement('DIV');
    this.logPlateTagPanel.setAttribute('id', 'lhPlateTagPanel');
    var tagbar = '';
    tagbar +=    '<div class="lhShrinkWrap">';
    tagbar +=    '<div id="lhAvailTagsPlate">';
    tagbar +=    '<span>Tags:</span>';
    tagbar +=    '<div><select id="lhAvailTagsSelect" class="lhInput" multiple="multiple" size="4"></select></div>';
    tagbar +=    '</div>';

    tagbar +=    '<div id="lhCtrlTagsPlate">';
    tagbar +=    '<span id="lhTagCtrlAddBtn" class="lhTagCtrl lhBtn">&gt;</span>';
    tagbar +=    '<span id="lhTagCtrlAddAllBtn" class="lhTagCtrl lhBtn">&gt;&gt;</span>';
    tagbar +=    '<span id="lhTagCtrlRemBtn" class="lhTagCtrl lhBtn">&lt;</span>';
    tagbar +=    '<span id="lhTagCtrlRemAllBtn" class="lhTagCtrl lhBtn">&lt;&lt;</span>';
    tagbar +=    '</div>';

    // http://www.dhtmlgoodies.com/scripts/multiple_select/multiple_select.html
    tagbar +=    '<div id="lhViewTagsPlate">';
    tagbar +=    '<span>Viewing:</span>';
    tagbar +=    '<div><select id="lhViewTagsSelect" class="lhInput" multiple="multiple" size="4"></select></div>';
    tagbar +=    '</div>';

    tagbar +=    '<div id="lhModTagsPlate">';
    tagbar +=    '<span id="lhTagCtrlAnyBtn" class="lhTagCtrl lhBtn">A</span>';
    tagbar +=    '<span id="lhTagCtrlIntBtn" class="lhTagCtrl lhBtn">I</span>';
    tagbar +=    '<span id="lhTagCtrlExcBtn" class="lhTagCtrl lhBtn">E</span>';
    tagbar +=    '</div>';
    tagbar +=    '</div>';
    this.logPlateTagPanel.innerHTML = tagbar;
    this.logPlate.appendChild(this.logPlateTagPanel);

    this.logPlateBodyBox = document.createElement('DIV');
    this.logPlateBodyBox.setAttribute('id', 'lhPlateBodyBox');
    this.logPlateBodyBox.style.display = 'none';
    this.logPlate.appendChild(this.logPlateBodyBox);

    this.logPlateBody = document.createElement('DIV');
    this.logPlateBody.setAttribute('id', 'lhPlateBody');
    this.logPlateBodyBox.appendChild(this.logPlateBody);

    // Add levels to level select control.
    var lvlSelect = document.getElementById('lhLvlSelect');
	var level;
    for(idx = 0; idx<LogHoundLevels.length; idx++) {
	    level = LogHoundLevels[idx];
	    lvlSelect.options[lvlSelect.length] = new Option(level.getText(),level.getId());
	}

    var btns = document.getElementsByClassName('lhBtn');
    for(idxBtns in btns) {
        document.addStyleClass(btns[idxBtns],'lhBtnOut');
    }
    for(btnIdx in btns) {
        btns[btnIdx].onmouseover = function(event) {
            document.removeStyleClass(this, 'lhBtnOut');
            document.addStyleClass(this, 'lhBtnOver');
        }
        btns[btnIdx].onmouseout = function(event) {
            document.removeStyleClass(this, 'lhBtnOver');
            document.addStyleClass(this, 'lhBtnOut');
        }
    }
    document.getElementById('lhTagCtrlAddBtn').onclick = function(event) {
        window.logHound.moveTagAssignments('add');
    };
    document.getElementById('lhTagCtrlRemBtn').onclick = function(event) {
        window.logHound.moveTagAssignments('rem');
    };
    document.getElementById('lhTagCtrlRemAllBtn').onclick = function(event) {
        window.logHound.moveTagAssignments('remAll');
    };
    document.getElementById('lhTagCtrlAddAllBtn').onclick = function(event) {
        window.logHound.moveTagAssignments('addAll');
    };
    document.getElementById('lhCtrlMore').onclick = function(event) {
        window.logHound.showMoreMessages();
    };
    document.getElementById('lhCtrlLess').onclick = function(event) {
        window.logHound.showLessMessages();
    };
    var levelControls = document.getElementsByClassName('lhCtrlLvl');
    for(idx=0; idx<levelControls.length; idx++) {
        levelControls[idx].onclick = function(event) {
            window.logHound.toggleMsgLvl(this);
        }
    }
    document.getElementById('lhCtrlShadeToggle').onclick = function(event) {
        window.logHound.toggleDisplay();
    };
    // Help panel toggle
    var toggleHelp = document.getElementById('lhCtrlHelp');
    toggleHelp.onclick = function(event) {
        window.logHound.toggleHelpPanel();
    };
    var toggleCtrl = document.getElementById('lhTitleToggleCtrl');
    toggleCtrl.onmouseover = function(event) {
        this.innerHTML = '&curren;';
    };
    toggleCtrl.onmouseout = function(event) {
        this.innerHTML = '&#149;';
    };
    toggleCtrl.onclick = function(event) {
        window.logHound.toggleCtrlPanel();
    };
    document.getElementById('lhCtrlTags').onclick = function(event) {
        window.logHound.toggleTagCtrlPanel();
    };
    document.getElementById('lhCtrlTags').onclick = function(event) {
        window.logHound.toggleTagCtrlPanel();
    };

    document.getElementById('lhTagCtrlAnyBtn').onclick = function(event) {
        window.logHound.setTagFilterMode('A');
    };

    document.getElementById('lhTagCtrlIntBtn').onclick = function(event) {
        window.logHound.setTagFilterMode('I');
    };

    document.getElementById('lhTagCtrlExcBtn').onclick = function(event) {
        window.logHound.setTagFilterMode('E');
    };
    document.getElementById('lhCtrlMsgDispModeBtn').onclick = function(event) {
        window.logHound.toggleMsgLayout();
    };

    document.getElementById('lhLvlSelect').onchange = function(event) {
        var what = this;
        window.logHound.setLogLevel(parseInt(this.value));
    }

    this.searchField = document.getElementById('lhSearchField');

    this.adjustPlateSize();
    this.startDebugWindowMonitor();
    this.show(true);
    this.logInfo('Log Hound is online...');
    var msg = 'document.body.clientWidth='+document.body.clientWidth+'<br/>document.documentElement.clientWidth='+document.documentElement.clientWidth+'<br/>window.innerWidth='+window.innerWidth+'<br/>document.body.scrollWidth='+document.body.scrollWidth+'<br/>document.body.offsetWidth='+document.body.offsetWidth;
    //this.logInfo(msg);
};
LogHound.prototype.showHelp = function(helpNode) {
    this.logPlateHelpPanel.innerHTML = LogHoundHelp[helpNode];
};
LogHound.prototype.toggleMsgLayout = function() {
    this.msgDispMode= (this.msgDispMode=='brief' ? 'detail' : 'brief');
    document.getElementById('lhCtrlMsgDispModeBtn').style.fontWeight=(this.msgDispMode=='brief' ? 'normal' : 'bold');
    var briefMsgRecs = document.getElementsByClassName('lhMsgRecBrief');
    for(idx=0; idx<briefMsgRecs.length; idx++) {
        briefMsgRecs[idx].style.display = (this.msgDispMode=='brief' ? 'block' : 'none');
    }
    var detailMsgRecs = document.getElementsByClassName('lhMsgRecDetail');
    for(idx=0; idx<detailMsgRecs.length; idx++) {
        detailMsgRecs[idx].style.display = (this.msgDispMode=='brief' ? 'none' : 'block');
    }
};
LogHound.prototype.setTagFilterMode = function(mode) {
    this.tagMode = ((mode!='A' && mode!='I' && mode!='E') ? 'A' : mode);
    document.getElementById('lhTagCtrlAnyBtn').style.fontWeight = (this.tagMode=='A' ? 'bold' : 'normal');
    document.getElementById('lhTagCtrlIntBtn').style.fontWeight = (this.tagMode=='I' ? 'bold' : 'normal');
    document.getElementById('lhTagCtrlExcBtn').style.fontWeight = (this.tagMode=='E' ? 'bold' : 'normal');
    var viewSelect = document.getElementById('lhViewTagsSelect');
    this.addMsgFilter(new LogHoundMessageTagFilter(FctsTools.getOptionValues(viewSelect),this.tagMode));
    this.applyMsgFilters();
};
LogHound.prototype.setKillSwitch = function(killSwitch) {
    if(killSwitch!=null && killSwitch==false) {
        this.killSwitch = false;
    } else {
        this.killSwitch = true;
    }
};
LogHound.prototype.enableLogging = function(enable) {
    if(enable!=null && enable==false) {
        this.enabled = false;
    } else {
        this.enabled = true;
    }
};
LogHound.prototype.show = function(show) {
    // If the kill switch is enabled, do absolutely nothing.
    if(!this.initialised || !this.enabled) {
        return;
    }
    if(show!=null && show==true) {
        this.logPlate.style.display = 'block';
        this.adjustPlateSize();
    } else {
        this.logPlate.style.display = 'none';
    }
};
/**
 *
 * @return The loglevel object
 */
LogHound.prototype.getLogLevel = function() {
    return this.logLevel;
};
LogHound.prototype.setLogLevel = function(level) {
    level = LogHoundLevels.getLevel(level);
    if(level==null) { return; }
    this.logLevel = level;
    this.setLogLevelSelect();
};
LogHound.prototype.setLogLevelSelect = function() {
    var lvlSelect = document.getElementById('lhLvlSelect');
    for(i=0; i<lvlSelect.options.length; i++) {
        if(lvlSelect.options[i].value==this.logLevel.getId()) {
            lvlSelect.options[i].selected = true;
            break;
        }
    }
};
LogHound.prototype.startDebugWindowMonitor = function() {
    this.debugWindowMonitorRef = setInterval('window.logHound.stickLogPlateTopRight()', 500);
};
LogHound.prototype.getLogLevelObject = function(name) {
    if(name==null) {
        return null;
    }
    name = name.toLowerCase();
    for(idx=0; idx<LogHoundLevels.length; idx++) {
        if(LogHoundLevels[idx].getText()==name) {
            return LogHoundLevels[idx];
        }
    }
};
LogHound.prototype.toggleMsgLvl = function(btn) {
    var logLevelName = btn.id.slice(9);
    var logLevel = this.getLogLevelObject(logLevelName);
    if(btn.innerHTML=='+') {
        btn.innerHTML = '&ndash;';
        logLevel.setEnabled(false);
    } else {
        btn.innerHTML = '+';
        logLevel.setEnabled(true);
    }
    this.applyMsgFilters();
};
/**
 * Adds a filter to the message filter array.
 * Filter object must implement two methods:
 * filter.getId() - returns an ID for the filter.
 * filter.showMessage(messageRecord) - Takes the message row record object and returns either 'true'
 * if the message should be visible, or 'false' if the message should be hidden.
 * @param filter The message filter to add to the internal array.
 */
LogHound.prototype.addMsgFilter = function(newFilter) {
    if(!newFilter.getId || !(newFilter instanceof LogHoundMessageFilter)) {
        alert('Argumented object is not a LogHoundMessageFilter.');
        return;
    }
    if(!newFilter.showMessage || typeof newFilter.showMessage !='function') {
        alert('Filter.showMessage is not a function.');
        return;
    }
    var newFilterArray = new Array();
    var msgFilter = null;
    for(idx in this.msgFilters) {
        msgFilter = this.msgFilters[idx];
        if(msgFilter.getId()!=newFilter.getId()) {
            newFilterArray.push(msgFilter);
        }
    }
    this.msgFilters = newFilterArray;
    this.msgFilters.push(newFilter);
}
/**
 * Applies all the currently active message filters to the displayed message rows.
 */
LogHound.prototype.applyMsgFilters = function() {
    var ts = (new Date()).getTime();
    var index = 0;
    var targetMsgRow = null;
    var showMsg = true;
    for(recIdx=0; recIdx<this.msgRecords.length; recIdx++) {
        this.msgRecords[recIdx]['element'].style.display = (this.filterMsg(this.msgRecords[recIdx]) ? 'block' : 'none');
    }
    //this.logTrace('Message filters applied in '+((new Date()).getTime()-ts)+'ms',['LogHound','applyMsgFilters()']);
};
/**
 *
 */
LogHound.prototype.filterMsg = function(msgRec) {
    for(idx=0; idx<this.msgFilters.length; idx++) {
        if(!this.msgFilters[idx].showMessage(msgRec)) {
            return false;
        }
    }
    return true;
};
LogHound.prototype.toggleDisplay = function(show) {
    var toggleBtn = document.getElementById('lhCtrlShadeToggle');
    show = (show==null ? this.logPlateBodyBox.style.display == 'none' : show);
    if(show) {
        this.logPlateBodyBox.style.display = 'block';
        this.adjustPlateSize();
        toggleBtn.innerHTML = '^';
    } else {
        this.logPlateBodyBox.style.display = 'none';
        this.logPlateTagPanel.style.display = 'none';
        this.logPlateCtrlPanel.style.display = 'none';
        this.logPlate.style.height = this.logPlateHead.offsetHeight;
        toggleBtn.innerHTML = 'v';
    }
};
LogHound.prototype.toggleHelpPanel = function() {
    var displayVal = this.logPlateHelpPanel.style.display;
    if(displayVal==null || displayVal=='' || displayVal=='none') {
        displayVal = 'block';
    } else {
        displayVal = 'none';
    }
    this.logPlateHelpPanel.style.display = displayVal;
    this.adjustPlateSize();
};
LogHound.prototype.toggleCtrlPanel = function() {
    var displayVal = this.logPlateCtrlPanel.style.display;
    if(displayVal==null || displayVal=='' || displayVal=='none') {
        displayVal = 'block';
    } else {
        displayVal = 'none';
    }
    this.logPlateCtrlPanel.style.display = displayVal;
    this.adjustPlateSize();
};
LogHound.prototype.toggleTagCtrlPanel = function() {
    var displayVal = this.logPlateTagPanel.style.display;
    if(displayVal==null || displayVal=='' || displayVal=='none') {
        displayVal = 'block';
    } else {
        displayVal = 'none';
    }
    this.logPlateTagPanel.style.display = displayVal;
    this.adjustPlateSize();
};
LogHound.prototype.showMoreMessages = function() {
    var boxHeight = this.logPlateBodyBox.offsetHeight;
    if(boxHeight>600) {
        return;
    }
    this.logPlateBodyBox.style.height = boxHeight+50;
    this.adjustPlateSize();
};
LogHound.prototype.showLessMessages = function() {
    var boxHeight = this.logPlateBodyBox.offsetHeight;
    if(boxHeight<50) {
        return;
    }
    this.logPlateBodyBox.style.height = boxHeight-50;
    this.adjustPlateSize();
};
LogHound.prototype.adjustPlateSize = function() {
    this.logPlate.offsetHeight
    var totalHeight = this.logPlateHead.offsetHeight;
    totalHeight += this.logPlateHelpPanel.offsetHeight;
    totalHeight += this.logPlateCtrlPanel.offsetHeight;
    totalHeight += this.logPlateTagPanel.offsetHeight;
    totalHeight += this.logPlateBodyBox.offsetHeight;
    this.logPlate.style.height = totalHeight;
};
LogHound.prototype.stickLogPlateTopLeft = function() {
    var scrollHeight = $(window).scrollTop();
    this.logPlate.style.left=0;
    this.logPlate.style.top=(0+scrollHeight);
    this.logPlate.style.zIndex=500;
};
LogHound.prototype.stickLogPlateTopRight = function() {
    var plateHeight = this.logPlate.offsetHeight;
    var plateWidth = this.logPlate.offsetWidth;
    var winHeight = FctsTools.windowHeight();
    var winWidth = FctsTools.windowWidth();
    var scrollTop = FctsTools.scrollTop();
    var scrollLeft = FctsTools.scrollLeft();
    /*
    var winHeight = $(window).height();
    var winWidth = $(window).width();
    var scrollTop = $(window).scrollTop();
    var scrollLeft = $(window).scrollLeft();
    */
    this.logPlate.style.left=(FctsTools.viewWidth()-plateWidth+scrollLeft);
    this.logPlate.style.top=(scrollTop);
    this.logPlate.style.zIndex=500;
};
LogHound.prototype.stickLogPlateBottomLeft = function() {
    var plateHeight = this.logPlate.offsetHeight;
    var winHeight = FctsTools.windowHeight();
    var scrollTop = FctsTools.scrollTop();
    this.logPlate.style.left=0;
    this.logPlate.style.top=(winHeight-plateHeight+scrollTop);
    this.logPlate.style.zIndex=500;
};
LogHound.prototype.search = function(textToMatch) {
    if(!textToMatch || textToMatch==null || textToMatch=='') {
        textToMatch = this.searchField.value;
    }
    if(!textToMatch || textToMatch==null) {
        textToMatch = '';
    }
    textToMatch = this.escapeRegex(textToMatch);

    var searchFilter = new LogHoundTextSearchFilter(textToMatch);
    this.addMsgFilter(searchFilter);
    this.applyMsgFilters();
};
LogHound.prototype.escapeRegex = function(targetText) {
    if(!arguments.callee.sRE) {
        var specials = [
            '/', '.', '*', '+', '?', '|',
            '(', ')', '[', ']', '{', '}', '\\'
        ];
        arguments.callee.sRE = new RegExp(
            '(\\' + specials.join('|\\') + ')', 'g'
        );
    }
    return targetText.replace(arguments.callee.sRE, '\\$1');
};
LogHound.prototype.addTags = function(tagz) {
    if(tagz==null || !tagz.length || tagz.length<1) {
        return;
    }
    var tagsSelect = document.getElementById('lhAvailTagsSelect');
    foundMatch:
    for(tagIdx in tagz) {
        for(allIdx in this.msgTags) {
            if(tagz[tagIdx]==this.msgTags[allIdx]) {
               continue foundMatch;
            }
        }
        if(tagz[tagIdx]==null || tagz[tagIdx]=='') { continue; }
        this.msgTags.push(tagz[tagIdx]);
        tagsSelect.options[tagsSelect.length] = new Option(tagz[tagIdx], tagz[tagIdx]);
    }
};
/**
 * Main logging function - this is where all log messages go to die... or be displayed.
 * @param level The log level of the message.
 * @param message The log message.
 */
LogHound.prototype.log = function() {
    // If the kill switch is enabled, throw away messages and do absolutely nothing.
    if(!this.initialised || !this.enabled) {
        return;
    }
    var level = null;
    var message = null;
    var tags = null;
    for(var i=0; i<arguments.length; i++) {
        if(arguments[i] instanceof Array) {
            tags = arguments[i];
        } else if(arguments[i] instanceof LogHoundLevel) {
            level = arguments[i];
        } else if(arguments[i] instanceof String || (typeof arguments[i])==='string') {
            message = arguments[i];
        } else {
            //alert('typeof: '+(FctsTools.typeOf(arguments[i])));
        }
    }
    // Since the ESP code is not finished, we cannot do anything without a log level.
    if(level==null || this.logLevel.getId()>level.getId()) {
        return;
    }
    if(message==null || message=='') {
        return;
    }
    // add all unique tags to master active tag list
    this.addTags(tags);

    // Create message record
    var msgRec = new Array();
    msgRec['level'] = level;
    msgRec['message'] = message;
    msgRec['tags'] = (tags==null ? {} : tags);
    msgRec['number'] = this.msgCount;
    msgRec['timestamp'] = new Date();
    this.msgRecords.push(msgRec);
    this.msgCount++;

    // Add message to display
    var msgElmt = document.createElement('DIV');
    var levelText = msgRec['level'].getText().charAt(0).toUpperCase() + msgRec['level'].getText().slice(1);
    var msgId = 'logmsg'+msgRec['number'];
    msgElmt.setAttribute('id', msgId);
    msgElmt.setAttribute('class','lh'+levelText+'Msg logMsg');
    msgElmt.setAttribute('className','lh'+levelText+'Msg logMsg');
    msgElmt.setAttribute('lhLogLevel', msgRec['level'].getText());
    msgElmt.style.display = (msgRec['level'].isEnabled()==true ? 'block' : 'none');

    var msgFullEntryDisp = ((this.msgDispMode=='detail') ? 'block' : 'none');
    var msgFullEntry = '<table cellspacing="0" class="lhMsgRecDetail" style="display:'+msgFullEntryDisp+'"><tr>';
    msgFullEntry +=    '<td class="lhMsgNum lhMsgElmt">'+msgRec['number']+'</td>';
    msgFullEntry +=    '<td class="lhMsgTime lhMsgElmt">'+this.getTimestampText(msgRec['timestamp'])+'</td>';
    msgFullEntry +=    '<td class="lhMsgTxt lhMsgElmt">'+((msgRec['tags'] instanceof Array) ? msgRec['tags'] : '')+'</td>';
    msgFullEntry +=    '</tr><tr>';
    msgFullEntry +=    '<td colspan="3" class="lhMsgTxtFull lhMsgElmt">'+msgRec['message']+'</td>';
    msgFullEntry +=    '</tr></table>';

    var msgEntryDisp = ((this.msgDispMode=='brief') ? 'block' : 'none');
    var msgEntry = '<table cellspacing="0" class="lhMsgRecBrief" style="display:'+msgEntryDisp+'"><tr>';
    msgEntry +=    '<td class="lhMsgNum lhMsgElmt">'+msgRec['number']+'</td>';
    msgEntry +=    '<td class="lhMsgTime lhMsgElmt">'+this.getTimestampText(msgRec['timestamp'])+'</td>';
    msgEntry +=    '<td class="lhMsgTxt lhMsgElmt">'+msgRec['message']+'</td>';
    msgEntry +=    '</tr></table>';

    msgElmt.innerHTML=msgFullEntry+msgEntry;
    var children = this.logPlateBody.childNodes;
    if(children==null || children.length<1) {
        this.logPlateBody.appendChild(msgElmt);
    } else {
        this.logPlateBody.insertBefore(msgElmt,children[0]);
    }
    //msgElmt.setAttribute('innerHTML',msgEntry);

    // Add message DOM element to record.
    msgRec['element'] = document.getElementById(msgId);
};
LogHound.prototype.getTimestampText = function(ts) {
    var hour = ts.getHours();
    var minute = ts.getMinutes();
    var second = ts.getSeconds();
    var millis = ts.getMilliseconds();
    var tsTxt = ((hour<10) ? '0'+hour : hour)+':';
    tsTxt += ((minute<10) ? '0'+minute : minute)+':';
    tsTxt += ((second<10) ? '0'+second : second)+'.';
    tsTxt += ((millis<10) ? '00'+millis : ((millis<100) ? '0'+millis : millis));
    return tsTxt;
};
LogHound.prototype.logTrace = function() {
    this.log(LogHoundLevels['TRACE'],LogHoundUtils.extractMessage(arguments),LogHoundUtils.extractTags(arguments));
};
LogHound.prototype.logDebug = function() {
    this.log(LogHoundLevels['DEBUG'],LogHoundUtils.extractMessage(arguments),LogHoundUtils.extractTags(arguments));
};
LogHound.prototype.logInfo = function() {
    this.log(LogHoundLevels['INFO'],LogHoundUtils.extractMessage(arguments),LogHoundUtils.extractTags(arguments));
};
LogHound.prototype.logWarn = function() {
    this.log(LogHoundLevels['WARN'],LogHoundUtils.extractMessage(arguments),LogHoundUtils.extractTags(arguments));
};
LogHound.prototype.logError = function() {
    this.log(LogHoundLevels['ERROR'],LogHoundUtils.extractMessage(arguments),LogHoundUtils.extractTags(arguments));
};
LogHound.prototype.logFatal = function() {
    this.log(LogHoundLevels['FATAL'],LogHoundUtils.extractMessage(arguments),LogHoundUtils.extractTags(arguments));
};
/**
 * @param action Can be one of four values:
 * <ul>
 *     <li>'add' adds any selected tags from the available list to the "view" list.</li>
 *     <li>'addAll' adds all tags from the available list to the "view" list.</li>
 *     <li>'rem' removes any selected tags from the view list.</li>
 *     <li>'remAll' removes all tags from the view list.</li>
 * </ul>
 */
LogHound.prototype.moveTagAssignments = function(action) {
    var availSelect = document.getElementById('lhAvailTagsSelect');
    var viewSelect = document.getElementById('lhViewTagsSelect');
    if(action == 'add') {
        FctsTools.moveSelected(availSelect, viewSelect);
    } else if(action == 'addAll') {
        FctsTools.moveAllOptions(availSelect, viewSelect);
    } else if(action == 'rem') {
        FctsTools.moveSelected(viewSelect, availSelect);
    } else if(action == 'remAll') {
        FctsTools.moveAllOptions(viewSelect, availSelect);
    }
    FctsTools.sortOptionsByText(availSelect);
    FctsTools.sortOptionsByText(viewSelect);
    this.addMsgFilter(new LogHoundMessageTagFilter(FctsTools.getOptionValues(viewSelect),this.tagMode));
    this.applyMsgFilters();
};
LogHound.prototype.getViewTags = function() {
    var viewSelect = document.getElementById('lhViewTagsSelect');
    return FctsTools.getOptionValues(viewSelect);
};
LogHound.prototype.getAvailTags = function() {
    var availSelect = document.getElementById('lhAvailTagsSelect');
    return FctsTools.getOptionValues(viewSelect);
};
function LogHoundMessageFilter(id) {
    this.id = id;
}
LogHoundMessageFilter.prototype.getId = function() {
    return this.id;
};
LogHoundMessageFilter.prototype.showMessage = function(msgRec) {
    return true;
};
/**
 *
 */
function LogHoundMessageTagFilter(tagArray, tagMode) {
    LogHoundMessageTagFilter.baseConstructor.call(this, 'lhMsgTagFilter');
    this.tagz = tagArray;
    this.tagMode = ((tagMode==null || tagMode=='') ? 'A' : tagMode);
}
FctsTools.extend(LogHoundMessageTagFilter, LogHoundMessageFilter);
LogHoundMessageTagFilter.prototype.showMessage = function(msgRec) {
    if(this.tagz==null || this.tagz.length<1) {
        return true;
    }
    if(this.tagMode=='I') {
        if(!(msgRec['tags'] instanceof Array)) { return false; }
        if(msgRec['tags'].length<this.tagz.length) { return false; }
    }
    var matched = false;
    var intMatched = false;
    for(targetIdx=0; targetIdx<this.tagz.length; targetIdx++) {
        intMatched = false;
        for(tagIdx=0; tagIdx<msgRec['tags'].length; tagIdx++) {
            matched = (msgRec['tags'][tagIdx] == this.tagz[targetIdx]);
            if(this.tagMode=='I') {
                intMatched = (intMatched || matched);
            } else if(matched && this.tagMode=='A') {
                return true;
            } else if(matched && this.tagMode=='E') {
                return false;
            }
        }
        if(this.tagMode=='I' && !intMatched) { return false; }
    }
    return (this.tagMode=='E' || this.tagMode=='I');
}
/**
 * Message text search filter.
 */
function LogHoundTextSearchFilter(searchText) {
    LogHoundTextSearchFilter.baseConstructor.call(this, 'lhTxtSearchFilter');
    this.searchText = searchText;
    this.regex = new RegExp(searchText, "i");
}
FctsTools.extend(LogHoundTextSearchFilter, LogHoundMessageFilter);
LogHoundTextSearchFilter.prototype.showMessage = function(msgRec) {
    if(this.searchText=='') {
        return true;
    }
    var message = msgRec['message'];
    var result = msgRec['message'].search(this.regex);
    return msgRec['message'].search(this.regex)>=0;
}
/**
 * Message level filter.
 */
function LogHoundMessageLevelFilter() {
    LogHoundTextSearchFilter.baseConstructor.call(this, 'lhMsgLvlFilter');
}
FctsTools.extend(LogHoundMessageLevelFilter, LogHoundMessageFilter);
LogHoundMessageLevelFilter.prototype.showMessage = function(msgRec) {
    return msgRec['level'].isEnabled();
}
if(window['logHound']==null) {
    window['logHound'] = new LogHound();
}


