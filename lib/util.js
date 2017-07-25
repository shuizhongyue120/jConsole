function log(msg) {
    console.log && console.log(msg);
}

function extend(destination, source) {
    if (!destination || !source) {
        this.log("extend param invalid!");
        return {};
    }
    for (property in source) {
        if (source.hasOwnProperty(property)) {
            destination[property] = source[property];
        }
    }

    return destination;
}

function loadCssCode(code) {
    if (!code) {
        this.log("loadCssCode param invalid!");
        return;
    }
    var style = document.createElement('style');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    try {
        //for Chrome Firefox Opera Safari
        style.appendChild(document.createTextNode(code));
    } catch (ex) {
        //for IE
        style.styleSheet.cssText = code;
    }
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
}

function hideDoms(doms) {
    if (!doms) {
        this.log("hideDoms param invalid!");
        return;
    }
    for (var i = 0, len = doms.length; i < len; i++) {
        doms[i].style.display = "none";
    }
}

function hideDom(dom) {
    if (!dom) {
        this.log("hideDom param invalid!");
        return;
    }
    dom.style.display = "none";
}

function showDom(dom, type) {
    if (!dom) {
        this.log("showDom param invalid!");
        return;
    }
    dom.style.display = !type ? "block" : "inline-block";
}

function hasCls(dom, cls) {
    if (!dom || !cls) {
        this.log("hasCls param invalid!");
        return;
    }
    var clsList = dom.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    return !!clsList;
}

function addCls(dom, cls) {
    if (!dom || !cls) {
        this.log("addCls param invalid!");
        return;
    }
    if (this.hasCls(dom, cls)) {
        return;
    }
    dom.className += " " + cls;
}

function removeCls(dom, cls) {
    if (!dom || !cls) {
        this.log("removeCls param invalid!");
        return;
    }
    if (this.hasCls(dom, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        dom.className = dom.className.replace(reg, ' ');
    }
}

function removeClsDoms(doms, cls) {
    if (!doms || !cls) {
        this.log("removeClsDoms param invalid!");
        return;
    }
    for (var i = 0, len = doms.length; i < len; i++) {
        var dom = doms[i];
        if (this.hasCls(dom, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            dom.className = dom.className.replace(reg, ' ');
        }
    }
}

function getCookie(name) {
    return decodeURIComponent((document.cookie.match(new RegExp("(^" + name + "| " + name + ")=([^;]*)")) == null) ? "" : RegExp.$2);
}

function addEvent(dom, type, handler) {
    if (!dom || !type || !handler) {
        util.log("Event add param invalid!");
        return;
    }
    if (window.addEventListener) {
        dom.addEventListener(type, handler);
        return;
    }
    dom.attachEvent("on" + type, handler);
}

function getElById(par, idStr) {
    par = par || document;
    return par.getElementById(idStr);
}


module.exports = {
    extend: extend,
    loadCssCode: loadCssCode,
    hideDoms: hideDoms,
    hideDom: hideDom,
    showDom: showDom,
    hasCls: hasCls,
    addCls: addCls,
    removeCls: removeCls,
    removeClsDoms: removeClsDoms,
    getCookie: getCookie,
    addEvent: addEvent,
    getElById: getElById
};
