/**
 * console for xunlei client
 * you can print log  and look the cookies.
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

var styleStr =".f-t-idn{text-indent:20px}.f-t-idn2{text-indent:40px}.t-con-pop{position:fixed;width:100%;bottom:0;left:0;background:#f8f8f8;font-size:14px;color:#3a4149;z-index:10000}.t-con-pop div,span,p,a{margin:0;padding:0}.t-con-nav{overflow:hidden}.nav-item{height:30px;line-height:30px;display:inline-block;width:60px;text-align:center}.nav-item:hover{cursor:pointer;background:#d1d2d1}.nav-act{border-bottom:solid 2px #2196F3}.nav-close{font-size:20px;float:right;margin-right:10px;cursor:pointer}.body-item{height:160px;overflow-y:scroll}.t-con-top{border-top:solid 1px #b6b6b6;height:4px;cursor:n-resize;background:#e0e2e7}.t-con-nav{background:#e0e2e7}.t-net-nav{display:inline-block;width:80px;padding:0 5px;text-align:cnter;border-left:1px solid #d5d3d3}.j-stor-ipt{width:60px}.j-stor-del{color:red;float:right;cursor:pointer}.t-net-item,.t-tim-item{display:inline-block;width:20%;padding:0 5px;border-left:1px solid #d5d3d3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left}.msg-item{border-bottom:solid 1px #d5d3d3;height:26px;line-height:26px;padding-left:10px}.u-ipt{width:100px}.u-ipt:focus{outline:none}.msg-info{background:#7bf77b}.msg-warn{background:#ffe400}.msg-err{background:#ED6666}#j-ck-search{position:absolute;top:34px;right:20px}@keyframes tclose{from{transform:translateY(0%);-webkit-transform:translateY(0%);-o-transform:translateY(0%)}to{transform:translateY(100%);-webkit-transform:translateY(100%);-o-transform:translateY(100%)}}@-webkit-keyframes tclose{from{transform:translateY(0%);-webkit-transform:translateY(0%);-o-transform:translateY(0%)}to{transform:translateY(100%);-webkit-transform:translateY(100%);-o-transform:translateY(100%)}}@-o-keyframes tclose{from{transform:translateY(0%);-webkit-transform:translateY(0%);-o-transform:translateY(0%)}to{transform:translateY(100%);-webkit-transform:translateY(100%);-o-transform:translateY(100%)}}@keyframes topen{from{transform:translateY(100%);-webkit-transform:translateY(100%);-o-transform:translateY(100%)}to{transform:translateY(0%);-webkit-transform:translateY(0%);-o-transform:translateY(0%)}}@-webkit-keyframes topen{from{transform:translateY(100%);-webkit-transform:translateY(100%);-o-transform:translateY(100%)}to{transform:translateY(0%);-webkit-transform:translateY(0%);-o-transform:translateY(0%)}}@-o-keyframes topen{from{transform:translateY(100%);-webkit-transform:translateY(100%);-o-transform:translateY(100%)}to{transform:translateY(0%);-webkit-transform:translateY(0%);-o-transform:translateY(0%)}}.cont_close{transform:translateY(100%);-webkit-transform:translateY(100%);-o-transform:translateY(100%);animation:tclose 1s;-webkit-animation:tclose 1s;-o-animation:tclose 1s}.cont_open{transform:translateY(0%);-webkit-transform:translateY(0%);-o-transform:translateY(0%);animation:topen 1s;-webkit-animation:topen 1s;-o-animation:topen 1s}.show-btn{display:none;position:fixed;bottom:50px;right:20px;width:60px;height:30px;line-height:30px;text-align:center;background:#7bf77b}";
//var tpl = '<div id=j-con-nav class=t-con-nav><span class="nav-item nav-act" idx=console>console</span><span class=nav-item idx=cookie>cookie</span><span id=j-item-search class=nav-item style="display: none;"><input type=text id=j-ck-search class=u-ipt placeholder="查询cookie,回车提交"></span><span class=nav-close idx=close>x</span></div><div id=j-con-console class="body-item j-con-body"></div><div id=j-con-cookie class="body-item j-con-body" style="display: none;"></div>';

var tpl = '<div id=j-thunder-con class=t-con-pop><span id=j-thunder-btn class=show-btn>show</span><div id=j-thunder-main><div id=j-con-nav class=t-con-nav><span class="nav-item nav-act" idx=console>console</span><span class=nav-item idx=cookie>cookie</span><span class=nav-close idx=close>x</span><span class=nav-item id=j-nav-net idx=network style="display: none;">network</span><span class=nav-item id=j-nav-timing idx=timing style="display: none;">timing</span><span class=nav-item id=j-nav-storage idx=storage>storage</span><span id=j-item-search style="display: none;"><input type=text id=j-ck-search class=u-ipt placeholder="查询cookie"></span></div><div id=j-con-console class="body-item j-con-body"></div><div id=j-con-cookie class="body-item j-con-body" style="display: none;"></div><div id=j-con-network class="body-item j-con-body" style="display: none;"></div><div id=j-con-timing class="body-item j-con-body" style="display: none;"></div><div id=j-con-storage class="body-item j-con-body" style="display: none;"></div></div></div>';
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
        if (!msg) {
            util.log("showMsg param invalid!");
            return;
        }

        var str = document.getElementById("j-con-console").innerHTML;
        var def = '<p class="msg-item">' + msg + '</p>';
        if ("warn" === type) {
            def = '<p class="msg-item msg-warn">' + msg + '</p>';
        } else if ("error" === type) {
            def = '<p class="msg-item msg-err">' + msg + '</p>';
        } else if ("info" === type) {
            def = '<p class="msg-item msg-info">' + msg + '</p>';
        }
        document.getElementById("j-con-console").innerHTML = str + def;
    },
    close: function() {
        this.cfg.status = false;
        util.removeCls(document.getElementById("j-thunder-main"), "cont_open");
        util.addCls(document.getElementById("j-thunder-main"), "cont_close");
        util.showDom(document.getElementById("j-thunder-btn"), 1);
        //alert("className2:" + document.getElementById("j-thunder-main").className);
    },
    open: function() {
        this.cfg.status = true;
        util.removeCls(document.getElementById("j-thunder-main"), "cont_close");
        util.addCls(document.getElementById("j-thunder-main"), "cont_open");
        util.hideDom(document.getElementById("j-thunder-btn"));
        //alert("className3:" + document.getElementById("j-thunder-main").className);
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
        document.getElementById("j-con-cookie").innerHTML = this.getCookies() || "no cookie";
        util.showDom(document.getElementById("j-con-cookie"));
        util.showDom(document.getElementById("j-item-search"), 1);
        document.getElementById("j-ck-search").value = "";
    },
    hideDoms: function() {
        util.hideDoms(document.getElementsByClassName("j-con-body"));
        util.hideDom(document.getElementById("j-item-search"));
    },
    showConsPage: function() {
        this.hideDoms();
        util.showDom(document.getElementById("j-con-console"));
    },
    showStorPage: function() {
        this.hideDoms();
        util.showDom(document.getElementById("j-con-storage"));
        var str = '<p class="msg-item"><span class="t-tim-item">key</span><span class="t-tim-item">value（点击修改）</span></p>';
        for (var prop in window.localStorage) {
            str += '<p class="msg-item"><span class="t-tim-item">' + prop + '<i class="j-stor-del" key=' + prop + '>delete</i></span><span class="t-tim-item j-stor-val">' + localStorage.getItem(prop) + '</span><span class="t-tim-item j-stor-iptwrap" style="display: none;"><input type="text" class="u-ipt j-stor-ipt" class="u-ipt" placeholder="回车提交" key=' + prop + '></span></p>';
        }
        str += '<p class="msg-item"><span class="t-tim-item"><input type="text" id="j-stor-key" class="u-ipt" placeholder="key"></span><span class="t-tim-item"><input type="text" id="j-add-ipt" class="u-ipt" placeholder="value"></span></p>';
        document.getElementById("j-con-storage").innerHTML = str;
    },
    showTimingPage: function() {
        this.hideDoms();
        util.showDom(document.getElementById("j-con-timing"));
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
        document.getElementById("j-con-timing").innerHTML = str;
    },
    showNetPage: function() {
        this.hideDoms();
        util.showDom(document.getElementById("j-con-network"));
        var arr = performance.getEntries();
        var str = '<p class="msg-item">' +
            '<span class="t-net-nav">name</span>' +
            '<span class="t-net-nav">dns</span>' +
            '<span class="t-net-nav">tcp connect</span>' +
            '<span class="t-net-nav">waiting</span>' +
            '</p>';
        for (var i = 0, len = arr.length; i < len; i++) {
            var t = arr[i];
            var name = t.name;
            var type = "navigation" === t.initiatorType ? "document" : t.initiatorType;
            var tm = (t.responseEnd - t.requestStart).toFixed(0);
            var tcptm = (t.connectEnd - t.connectStart).toFixed(0);
            var dnstm = (t.domainLookupStart - t.domainLookupEnd).toFixed(0);
            //var domEventTm = t.domContentLoadedEventEnd - t.domContentLoadedEventStart;
            str += '<p class="msg-item"><span class="t-net-item">' + name.split("/").slice(-1) +
                '</span><span class="t-net-item">' + dnstm +
                '</span><span class="t-net-item">' + tcptm +
                '</span><span class="t-net-item">' + tm + '</span></p>';
        }
        document.getElementById("j-con-network").innerHTML = str;
    },
    updateCookPage: function(val) {
        document.getElementById("j-con-cookie").innerHTML = util.getCookie(val) || CONS.EMPTY;
    },
    bindUI: function() {
        var that = this;
        var navDom = document.getElementById("j-con-nav");
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

        document.getElementById("j-thunder-btn").onclick = function(e) {
                that.open();
            }
            //search cookie
        document.getElementById("j-ck-search").onkeydown = function(e) {
            var e = e || window.event;
            if (13 === e.keyCode) {
                var key = document.getElementById("j-ck-search").value;
                if ("" === key) {
                    that.showCookPage();
                    return;
                }
                that.updateCookPage(key);
            }
        }

        document.getElementById("j-con-storage").onclick = function(e) {
            var e = e || window.event,
                tar = e.target || e.srcElement;
            var pDom = tar.parentNode.parentNode;
            if (tar.className.indexOf("j-stor-del") > -1) {
                pDom.parentNode.removeChild(pDom);
                window.localStorage.removeItem(tar.getAttribute("key"));
            } else if (tar.className.indexOf("j-stor-val") > -1) {
                util.hideDoms(document.getElementsByClassName("j-stor-iptwrap"));
                util.showDom(tar.nextSibling, 1);
            }
        }

        document.getElementById("j-con-storage").onkeydown = function(e) {
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
                    var key = document.getElementById("j-stor-key").value;
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

    },
    renderUI: function() {

        util.loadCssCode(styleStr);
        var consDom = document.createElement("div");
        consDom.id = "j-thunder-con";
        consDom.className = "t-con-pop";
        consDom.innerHTML = tpl;
        document.body.appendChild(consDom);
        if (window.performance) {
            util.showDom(document.getElementById("j-nav-net"), 1);
            util.showDom(document.getElementById("j-nav-timing"), 1);
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
