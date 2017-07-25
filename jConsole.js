/**
 * a console tools for brower cannot console 
 * you can print log and look the cookies ,request .localstorge etc.
 * 
 * the pop z-index is 10000 please be careful;
 * use guide:
 *     1. script src this file  
 *     2. write jConsole.log("xxxx") in your code,just like console.log("xxxx");
 *     3. support 4 interface api
 *         jConsole.log    is same to console.log
 *         jConsole.info   is same to console.info                        
 *         jConsole.warn   is same to console.warn
 *         jConsole.error  is same to console.error
 */
var CONS = {
    CONSOLE: "console",
    COOKIE: "cookie",
    NETWORK: "network",
    TIMING: "timing",
    STORAGE: "storage",
    CLOSE: "close",
    NAV_ACT: "nav-act",
    NAV_ITEM: "nav-item",
    EMPTY: "result empty"
};

var styleStr = ".f-t-idn{text-indent:20px}.f-t-idn2{text-indent:40px}.t-con-pop{position:fixed;width:100%;bottom:0;left:0;background:#f8f8f8;font-size:14px;color:#3a4149;z-index:10000}.t-con-pop div,span,p,a{margin:0;padding:0}.nav-item{height:28px;line-height:28px;display:inline-block;width:120px;text-align:center}.nav-item:hover{cursor:pointer;background:#d1d2d1}.nav-act{border-bottom:solid 2px #2196F3}.nav-close{font-size:20px;float:right;margin-right:10px;cursor:pointer}.body-item{height:300px;overflow-y:scroll}.t-con-top{border-top:solid 1px #b6b6b6;height:4px;cursor:n-resize;background:#e0e2e7}.t-con-nav{background:#e0e2e7}.t-net-nav{display:inline-block;width:160px;padding:0 5px;text-align:cnter;border-left:1px solid #d5d3d3}.j-stor-ipt{width:120px}.j-stor-del{color:red;float:right;cursor:pointer}.t-net-item,.t-tim-item{display:inline-block;width:160px;max-width:960px;padding:0 5px;border-left:1px solid #d5d3d3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left}.msg-item{border-bottom:solid 1px #d5d3d3;min-height:20px;line-height:20px;padding-left:10px}.u-ipt{width:120px}.u-ipt:focus{outline:none}.msg-info{background:#7bf77b}.msg-warn{background:#ffe400}.msg-err{background:#ED6666}";
//var tpl = '<div id=j-con-nav class=t-con-nav><span class="nav-item nav-act" idx=console>console</span><span class=nav-item idx=cookie>cookie</span><span id=j-item-search class=nav-item style="display: none;"><input type=text id=j-ck-search class=u-ipt placeholder="查询cookie,回车提交"></span><span class=nav-close idx=close>x</span></div><div id=j-con-console class="body-item j-con-body"></div><div id=j-con-cookie class="body-item j-con-body" style="display: none;"></div>';
var tpl = '<div id=j-con-top class=t-con-top></div><div id=j-con-nav class=t-con-nav><span class="nav-item nav-act" idx=console>console</span><span class=nav-item idx=cookie>cookie</span><span class=nav-close idx=close>x</span><span class=nav-item id=j-nav-net idx=network style="display: none;">network</span><span class=nav-item id=j-nav-timing idx=timing style="display: none;">timing</span><span class=nav-item id=j-nav-storage idx=storage>localStorage</span><span id=j-item-search style="display: none;"><input type=text id=j-ck-search class=u-ipt placeholder="查询cookie,回车提交"></span></div><div id=j-con-console class="body-item j-con-body"></div><div id=j-con-cookie class="body-item j-con-body" style="display: none;"></div><div id=j-con-network class="body-item j-con-body" style="display: none;"></div><div id=j-con-timing class="body-item j-con-body" style="display: none;"></div><div id=j-con-storage class="body-item j-con-body" style="display: none;"></div>';
var util = require("../lib/util.js");

function jConsole(cfg) {
    if (this instanceof jConsole) {
        this.cfg = {
            status: true,
            size: 0
        };
    } else {
        return new jConsole(cfg);
    }

}

jConsole.prototype = {
    init: function(cfg) {
        this.cfg = util.extend(this.cfg, cfg);
        this.renderUI();
        this.bindUI();
        return this;
    },
    showMsg: function(msg, type) {
        if ("undefined" === typeof msg || "" === msg) {
            util.log("showMsg param invalid!");
            return;
        }

        var str = util.getElById(null, "j-con-console").innerHTML;
        var def = '<p class="msg-item">' + msg + '</p>';
        if ("warn" === type) {
            def = '<p class="msg-item msg-warn">' + msg + '</p>';
        } else if ("error" === type) {
            def = '<p class="msg-item msg-err">' + msg + '</p>';
        } else if ("info" === type) {
            def = '<p class="msg-item msg-info">' + msg + '</p>';
        }
        util.getElById(null, "j-con-console").innerHTML = str + def;
    },
    close: function() {
        this.cfg.status = false;
        util.hideDom(util.getElById(null, "j-thunder-con"));
    },
    open: function() {
        this.cfg.status = true;
        util.showDom(util.getElById(null, "j-thunder-con"));
    },
    getCookies: function() {
        var ck = document.cookie || "";
        var arr = ck ? ck.split(";") : [];
        var str = '<p class="msg-item"><span class="t-tim-item">key</span><span class="t-tim-item">value</span></p>';
        for (var i = 0, len = arr.length; i < len; i++) {
            var tarr = arr[i].split("=");
            str += '<p class="msg-item"><span class="t-tim-item">' + tarr[0] + '</span><span class="t-tim-item">' + tarr[1] + '</span></p>';
        }
        return str;
    },
    showCookPage: function() {
        util.hideDoms(document.getElementsByClassName("j-con-body"));
        util.getElById(null, "j-con-cookie").innerHTML = this.getCookies() || "no cookie";
        util.showDom(util.getElById(null, "j-con-cookie"));
        util.showDom(util.getElById(null, "j-item-search"), 1);
        util.getElById(null, "j-ck-search").value = "";
    },
    hideDoms: function() {
        util.hideDoms(document.getElementsByClassName("j-con-body"));
        util.hideDom(util.getElById(null, "j-item-search"));
    },
    showConsPage: function() {
        this.hideDoms();
        util.showDom(util.getElById(null, "j-con-console"));
    },
    showStorPage: function() {
        this.hideDoms();
        util.showDom(util.getElById(null, "j-con-storage"));
        var str = '<p class="msg-item"><span class="t-tim-item">key</span><span class="t-tim-item">value（双击修改）</span></p>';
        for (var prop in window.localStorage) {
            str += '<p class="msg-item"><span class="t-tim-item">' + prop + '<i class="j-stor-del" key=' + prop + '>delete</i></span><span class="t-tim-item j-stor-val">' + localStorage.getItem(prop) + '</span><span class="t-tim-item j-stor-iptwrap" style="display: none;"><input type="text" class="u-ipt j-stor-ipt" class="u-ipt" placeholder="回车提交" key=' + prop + '></span></p>';
        }
        str += '<p class="msg-item"><span class="t-tim-item"><input type="text" id="j-stor-key" class="u-ipt" placeholder="key"></span><span class="t-tim-item"><input type="text" id="j-add-ipt" class="u-ipt" placeholder="value 回车提交"></span></p>';
        util.getElById(null, "j-con-storage").innerHTML = str;
    },
    showTimingPage: function() {
        this.hideDoms();
        util.showDom(util.getElById(null, "j-con-timing"));
        var t = performance.timing;
        var arr = [{
            name: "loadPage",
            val: t.loadEventEnd - t.navigationStart,
            desc: "页面加载完成"
        }, {
            name: "domReady",
            val: t.domComplete - t.responseEnd,
            desc: "解析DOM"
        }, {
            name: "dns",
            val: t.domainLookupEnd - t.domainLookupStart,
            desc: "DNS查询"
        }, {
            name: "connect",
            val: t.connectEnd - t.connectStart,
            desc: "TCP建立连接"
        }, {
            name: "request",
            val: t.responseEnd - t.requestStart,
            desc: "内容加载完成"
        }];
        var str = "";
        for (var i = 0, len = arr.length; i < len; i++) {
            var t = arr[i];
            str += '<p class="msg-item"><span title=' + t.desc + ' class="t-net-item">' + t.name +
                '</span><span title=' + t.val + ' class="t-net-item">' + t.val +
                '</p>';
        }
        util.getElById(null, "j-con-timing").innerHTML = str;
    },
    showNetPage: function() {
        this.hideDoms();
        util.showDom(util.getElById(null, "j-con-network"));
        var arr = performance.getEntries();
        var str = '<p class="msg-item">' +
            '<span class="t-net-nav">name</span>' +
            '<span class="t-net-nav">type</span>' +
            '<span class="t-net-nav">dns time</span>' +
            '<span class="t-net-nav">tcp connect time</span>' +
            '<span class="t-net-nav">waiting time</span>' +
            '</p>';
        for (var i = 0, len = arr.length; i < len; i++) {
            var t = arr[i];
            var name = t.name;
            var type = "navigation" === t.initiatorType ? "document" : t.initiatorType;
            var tm = (t.responseEnd - t.requestStart).toFixed(0);
            var tcptm = (t.connectEnd - t.connectStart).toFixed(0);
            var dnstm = (t.domainLookupStart - t.domainLookupEnd).toFixed(0);
            //var domEventTm = t.domContentLoadedEventEnd - t.domContentLoadedEventStart;
            str += '<p class="msg-item"><span title=' + name + ' class="t-net-item">' + name.split("/").slice(-1) +
                '</span><span title=' + type + ' class="t-net-item">' + type +
                '</span><span title=' + dnstm + ' class="t-net-item">' + dnstm +
                '</span><span title=' + tcptm + ' class="t-net-item">' + tcptm +
                '</span><span title=' + tm + ' class="t-net-item">' + tm + '</span></p>';
        }
        util.getElById(null, "j-con-network").innerHTML = str;
    },
    updateCookPage: function(val) {
        util.getElById(null, "j-con-cookie").innerHTML = util.getCookie(val) || CONS.EMPTY;
    },
    bindUI: function() {
        var that = this;
        var navDom = util.getElById(null, "j-con-nav");
        var bdDoms = document.getElementsByClassName("j-con-body");
        var bdH = bdDoms[0].offsetHeight;
        util.addEvent(navDom, "click", function(e) {
            var e = e || window.event,
                target = e.target || e.srcElement;
            var t = target.getAttribute("idx");
            if (CONS.CLOSE === t) {
                that.close();
                return;
            }

            if (t) {
                util.removeClsDoms(document.getElementsByClassName("nav-item"), CONS.NAV_ACT);
                util.addCls(target, CONS.NAV_ACT);
            }

            if (CONS.CONSOLE === t) {
                that.showConsPage();
                bdH = bdDoms[0].offsetHeight;
                return;
            } else if (CONS.COOKIE === t) {
                that.showCookPage();
                bdH = bdDoms[1].offsetHeight;
                return;
            } else if (CONS.NETWORK === t) {
                that.showNetPage();
                bdH = bdDoms[2].offsetHeight;
                return;
            } else if (CONS.TIMING === t) {
                that.showTimingPage();
                bdH = bdDoms[3].offsetHeight;
                return;
            } else if (CONS.STORAGE === t) {
                that.showStorPage();
                bdH = bdDoms[4].offsetHeight;
                return;
            } else {
                return;
            }
        });
        var tDom = util.getElById(null, "j-con-top");
        tDom.onmousedown = function(e) {
            var e = e || window.event,
                tag = e.target || e.srcElement;
            var pY = e.pageY || e.y;
            console.log("pY:" + pY);
            bdH = bdDoms[0].offsetHeight;
            document.onmousemove = function(e) {
                var e = e || window.event;
                var pY2 = e.pageY || e.y;
                console.log("移动距离:" + (pY2 - pY));
                setBdHeight(pY - pY2);
            }
            document.onmouseup = function() {
                console.log("onmouseup:");
                document.onmousemove = null;
            }

        }

        //F12 to controll console's open and close 
        document.onkeydown = function(e) {
                var e = e || window.event;
                if (123 === e.keyCode) {
                    if (that.cfg.status) {
                        that.close();
                        return;
                    }
                    that.open();
                }
            }
            //search cookie
        util.getElById(null, "j-ck-search").onkeydown = function(e) {
                var e = e || window.event;
                if (13 === e.keyCode) {
                    var key = util.getElById(null, "j-ck-search").value;
                    if ("" === key) {
                        that.showCookPage();
                        return;
                    }
                    that.updateCookPage(key);
                }
            }
            //localstorage 
        util.getElById(null, "j-con-storage").ondblclick = function(e) {
            var e = e || window.event,
                tar = e.target || e.srcElement;
            if (tar.className.indexOf("j-stor-val") > -1) {
                util.hideDoms(document.getElementsByClassName("j-stor-iptwrap"));
                util.showDom(tar.nextSibling, 1);
            }
        }
        util.getElById(null, "j-con-storage").onclick = function(e) {
            var e = e || window.event,
                tar = e.target || e.srcElement;
            var pDom = tar.parentNode.parentNode;
            if (tar.className.indexOf("j-stor-del") > -1) {
                pDom.parentNode.removeChild(pDom);
                window.localStorage.removeItem(tar.getAttribute("key"));
            } else if (tar.className.indexOf("j-add-sub") > -1) {

            }
        }

        util.getElById(null, "j-con-storage").onkeydown = function(e) {
            var e = e || window.event,
                tar = e.target || e.srcElement;
            if (13 === e.keyCode && tar.className.indexOf("j-stor-ipt") > -1) {
                setTimeout(function() {
                    var val = tar.value;
                    window.localStorage.setItem(tar.getAttribute("key"), val);
                    tar.parentNode.previousSibling.innerHTML = val;
                    util.hideDom(tar.parentNode);
                    tar.value = "";
                }, 0);
            } else if (13 === e.keyCode && tar.id.indexOf("j-add-ipt") > -1) {
                setTimeout(function() {
                    var key = util.getElById(null, "j-stor-key").value;
                    var val = tar.value;
                    window.localStorage.setItem(key, val);
                    var pDom = tar.parentNode.parentNode;
                    var nDom = document.createElement("p");
                    nDom.className = "msg-item";
                    nDom.innerHTML = '<span class="t-tim-item">' + key + '<i class="j-stor-del" key=' + key + '>delete</i></span><span class="t-tim-item j-stor-val">' + val + '</span><span class="t-tim-item j-stor-iptwrap" style="display: none;"><input type="text" class="u-ipt j-stor-ipt" class="u-ipt" placeholder="回车提交" key=' + key + '></span>';
                    pDom.parentNode.insertBefore(nDom, pDom);
                    document.getElementById("j-stor-key").value = "";
                    tar.value = "";
                }, 0);
            }
        }

        function setBdHeight(h) {
            var bdDoms = document.getElementsByClassName("j-con-body");
            for (var i = 0, len = bdDoms.length; i < len; i++) {
                bdDoms[i].style.height = bdH + h + "px";
            }
        }
    },
    renderUI: function() {
        util.loadCssCode(styleStr);
        var consDom = document.createElement("div");
        consDom.id = "j-thunder-con";
        consDom.className = "t-con-pop";
        consDom.innerHTML = tpl;
        document.body.appendChild(consDom);
        if (window.performance) {
            util.showDom(util.getElById(null, "j-nav-net"), 1);
            util.showDom(util.getElById(null, "j-nav-timing"), 1);
        }
    }
};

var csl = new jConsole().init({});

function warn(msg) {
    csl.showMsg(msg, "warn");
}

function log(msg) {
    csl.showMsg(msg);
}

function error(msg) {
    csl.showMsg(msg, "error");
}

function info(msg) {
    csl.showMsg(msg, "info");
}


module.exports = {
    log: log,
    warn: warn,
    error: error,
    info: info
};
