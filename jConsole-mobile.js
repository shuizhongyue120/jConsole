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
window.jConsole = (function() {
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

    var styleStr = "";
    var tpl = '<div id=j-con-nav class=t-con-nav><span class="nav-item nav-act" idx=console>console</span><span class=nav-item idx=cookie>cookie</span><span id=j-item-search class=nav-item style="display: none;"><input type=text id=j-ck-search class=u-ipt placeholder="查询cookie,回车提交"></span><span class=nav-close idx=close>x</span></div><div id=j-con-console class="body-item j-con-body"></div><div id=j-con-cookie class="body-item j-con-body" style="display: none;"></div>';

    var util = {
        log: function(msg) {
            console.log && console.log(msg);
        },
        extend: function(destination, source) {
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
        },
        loadCssCode: function(code) {
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
        },
        hideDoms: function(doms) {
            if (!doms) {
                this.log("hideDoms param invalid!");
                return;
            }
            for (var i = 0, len = doms.length; i < len; i++) {
                doms[i].style.display = "none";
            }
        },
        hideDom: function(dom) {
            if (!dom) {
                this.log("hideDom param invalid!");
                return;
            }
            dom.style.display = "none";
        },
        showDom: function(dom, type) {
            if (!dom) {
                this.log("showDom param invalid!");
                return;
            }
            dom.style.display = !type ? "block" : "inline-block";
        },
        hasCls: function(dom, cls) {
            if (!dom || !cls) {
                this.log("hasCls param invalid!");
                return;
            }
            var clsList = dom.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
            return !!clsList;
        },
        addCls: function(dom, cls) {
            if (!dom || !cls) {
                this.log("addCls param invalid!");
                return;
            }
            if (this.hasCls(dom, cls)) {
                return;
            }
            dom.className += " " + cls;
        },
        removeCls: function(dom, cls) {
            if (!dom || !cls) {
                this.log("removeCls param invalid!");
                return;
            }
            if (this.hasCls(dom, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                dom.className = dom.className.replace(reg, ' ');
            }
        },
        removeClsDoms: function(doms, cls) {
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
        },
        getCookie: function(name) {
            return decodeURIComponent((document.cookie.match(new RegExp("(^" + name + "| " + name + ")=([^;]*)")) == null) ? "" : RegExp.$2);
        },
        addEvent: function(dom, type, handler) {
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
    };

    function tConsole(cfg) {
        if (this instanceof tConsole) {
            this.cfg = {
                status: true,
                size: 0
            };
        } else {
            return new tConsole(cfg);
        }

    }

    tConsole.prototype = {
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
            util.hideDom(document.getElementById("j-thunder-con"));
        },
        open: function() {
            this.cfg.status = true;
            util.showDom(document.getElementById("j-thunder-con"));
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
            str += '<p class="msg-item"><span class="t-tim-item"><input type="text" id="j-stor-key" class="u-ipt" placeholder="key"></span><span class="t-tim-item"><input type="text" id="j-add-ipt" class="u-ipt" placeholder="value 回车提交"></span></p>';
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

            function setBdHeight(h) {
                var bdDoms = document.getElementsByClassName("j-con-body");
                for (var i = 0, len = bdDoms.length; i < len; i++) {
                    bdDoms[i].style.height = bdH + h + "px";
                }
            }
        },
        renderUI: function() {
            if (window.performance) {
                util.showDom(document.getElementById("j-nav-net"), 1);
                util.showDom(document.getElementById("j-nav-timing"), 1);
            }
            util.loadCssCode(styleStr);
            var consDom = document.createElement("div");
            consDom.id = "j-thunder-con";
            consDom.className = "t-con-pop";
            consDom.innerHTML = tpl;
            document.body.appendChild(consDom);
        }
    };

    var csl = new tConsole().init({});

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

    return {
        log: log,
        warn: warn,
        error: error,
        info: info
    }

})(window);
