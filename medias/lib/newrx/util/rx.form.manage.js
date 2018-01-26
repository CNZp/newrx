/*****************************************************************
 * RX.Form-0.1
 * 表单-基础结构
 * 最后更新时间：2018-01-24
 * 最后更新人：Zp
 * 更新内容：创建文件
 ******************************************************************/
(function () {
    var root = this;
    var formPool = {};
    var tRX = _top.RX;

    RX.getForm = function(name){
        return formPool[name];
    };
    RX.addForm = function(form){
        formPool[form.window.name] = form;
    };
    RX.addFrame = function(window){
        RX.addForm(new RX.Form(window));
    };

    //新版窗口管理打开弹出层
    // RX.openStack = function (win, title, areaType, url, param, callBacks, offset) {
    RX.openStack = function (options) {
        options = $.extend(true,{},options);
        var win = root, areaType = options.areaType,area;
        if (areaType === "small") {
            area = ['450px', '350px'];
        } else if (areaType === "medium") {
            area = ['700px', '500px'];
        } else if (areaType === "big") {
            area = ['900px', '600px'];
        } else if (areaType === "tree") {
            area = ['400px', '600px'];
        } else {
            area = areaType;
        }
        var openParam = {
            //zIndex:1,
            type: 2,
            title: options.title,
            area: area,
            maxmin: true,
            parentWin: win,
            param: options.param,
            content: RX.handlePath(options.url),
            // success: function (layero, index) {
            //     if (crossOriginTag) {
            //         if (win.successCallback) {
            //             win.successCallback();
            //         }
            //         if (callBacks && typeof(callBacks.success) === "function") {
            //             callBacks.success(layero, index);
            //         }
            //         return;
            //     }
            //     iframeWin = window[layero.find('iframe')[0]['name']];
            //     iframeWinName = iframeWin && iframeWin.name;
            //     _top.pushStackWin(iframeWin, win);
            //     if (win.successCallback) {
            //         win.successCallback();
            //     }
            //     if (callBacks && typeof(callBacks.success) === "function") {
            //         callBacks.success(layero, index);
            //     }
            // },
            // end: function () {
            //     if (crossOriginTag) {
            //         if (callBacks && typeof(callBacks.end) === "function") {
            //             callBacks.end();
            //         }
            //         return;
            //     }
            //     if (_top.ZENG)
            //         _top.ZENG.msgbox.hide();
            //     _top.closeLayerWin(iframeWinName);
            //     if (callBacks && typeof(callBacks.end) === "function") {
            //         callBacks.end();
            //     }
            // },
            // cancel: function () {
            //     if (crossOriginTag) {
            //         if (callBacks && typeof(callBacks.cancel) === "function") {
            //             callBacks.cancel();
            //         }
            //         return true;
            //     }
            //     var cwin = _top.getUpperestWin();
            //     if (cwin != null) {
            //         if (cwin.cancelCheck) {
            //             return cwin.cancelCheck();
            //         }
            //     }
            //     if (callBacks && typeof(callBacks.cancel) === "function") {
            //         callBacks.cancel();
            //     }
            //     return true;
            // }
        };
        if (options.offset) {
            openParam.offset = options.offset;
        }
        if (typeof(options.shade) != "undefined") {
            openParam.shade = options.shade;
        }
        if (typeof(options.id) != "undefined") {
            openParam.id = options.id;
        }
        _top.layer.open(openParam);
    };

    if(root === _top){
        var form = RX.form = new RX.Form(root);
        RX.addForm(form);
        //修改
        RX.loadCssBlocked([].concat(["layer", "/medias/plugin/loading/msgbox.css"]));
        RX.loadScriptBlocked(["layer", "layerExtend", "/medias/lib/plat/layerManager.js", "msgbox"]);
    }else{
        var form = _top.RX.getForm(root.name);
        form.window = root;
        RX.form = form;
    }




    // //layer注册(判断当前使用的layer版本是否和模型需要的layer版本相同，是则直接使用top层layer作为window的layer）
    // if (_top.layer && _top.layer.RXLayerVersion == 1) {
    //     window.layer = _top.layer;
    // }
    //
    // //窗口管理模块（如果top层已经注册过layerManager则将所有窗口管理接口赋予本window，否则在本窗口重新注册窗口管理，并将接口赋予top层）
    // if (_top.hasLayerManager) {
    //     //加入层次页面
    //     RX.pushStackForm = tRX.pushStackForm;
    //     //加入子iframe页面
    //     RX.pushStackForm = tRX.pushStackForm;
    //     //获取前一个层次的关联窗口（√）
    //     RX.getPrevWin = _top.getPrevWin;
    //
    //     //获取前一个有reloadTable的关联窗口 （√）
    //     window.getPrevReloadWin = _top.getPrevReloadWin;
    //     //获取父窗口window（zp add）
    //     window.getParentWin = _top.getParentWin;
    //     //刷新前一个有reloadTable的关联窗口 （√）
    //     window.reloadPrevWin = _top.reloadPrevWin;
    //     //向前关闭窗口（√）
    //     window.closeWin = _top.closeWin;
    //     //向前关闭所有窗口 （√）     待关闭页面加上全局变量notCloseTag = true，若非最上层页面，则停止关闭
    //     window.closeAllWin = _top.closeAllWin;
    //     //弹出层内部调用接口，处理关闭后置
    //     window.closeLayerWin = _top.closeLayerWin;
    //     //获取指定窗口的数据   （√）
    //     window.winData = _top.winData;
    //     //设置页面历史搜索记录
    //     window.setHistorySearchData = _top.setHistorySearchData;
    //     //获取页面历史搜索记录
    //     window.getHistorySearchData = _top.getHistorySearchData;
    //     //获取最上层窗口
    //     window.getUpperestWin = _top.getUpperestWin;
    //     //获取需要的子窗口的win的name
    //     window.getFrameName = _top.getFrameName;
    //     //获取窗口下子窗口的名称数组
    //     window.getFrameNameArray = _top.getFrameNameArray;
    //     //关闭窗口（需关闭window为参数）
    //     window.closeLayer = _top.closeLayer;
    //     //新版窗口管理打开弹出层
    //     window.openStack = _top.openStack;
    //     //获取回退跳转路径
    //     window.getToTagUrl = _top.getToTagUrl;
    //     window.handleSelect = _top.handleSelect;
    //     window.handleFrameSelect = _top.handleFrameSelect;
    //     //获取工作流平铺页面 页面设置为
    //     window.findWorkflowFrameWin = function (win) {
    //         return _top.findWorkflowFrameWin(win || window);
    //     };
    //
    //     //前往路径
    //     window.gotoLocation = function (url, name) {
    //         _top._gotoLocation(window, url, name);
    //     };
    //     //前往路径
    //     window.freshLocation = function (url, name) {
    //         _top._freshLocation(window, url, name);
    //     };
    //     //路径回退，index回退页数,url为可定制的新url，如不填写，则以历史url为准;name为可定制的新name，如不填写，则以历史name为准
    //     window.backLocation = function (index, url, name) {
    //         _top._backLocation(window, index, url, name);
    //     };
    //     //（暂时停用）回退历史，bindex为退回次数，默认为1
    //     window.backHistory = function (bindex) {
    //         _top._backHistory(window, bindex);
    //     };
    //     //iframe路径跳转，两个参数，第一个为iframe的jquery选择器元素，第二个为跳转的url
    //     window.frameGoto = _top.frameGoto;
    //     //主菜单点击跳转，两个参数，第一个为点击的菜单标签的jquery选择器元素，第二个为跳转的url（可缺省）
    //     window.clickMainMenu = _top.clickMainMenu;
    //     //子菜单点击跳转，两个参数，第一个为点击的菜单标签的jquery选择器元素，第二个为跳转的url（可缺省）
    //     window.clickSubMenu = _top.clickSubMenu;
    //     //根据top层权限数据显示菜单，传入参数obj，menu的li集合的上级元素
    //     window.showMenu = _top.showMenu;
    //     //获取用户相关信息
    //     window.getUserInfo = _top.getUserInfo;
    //     window.showDialog = _top.showDialog;
    // } else {
    //
    //     _top.hasLayerAlert = false;
    //
    //     //winType有三种：
    //     //stack（堆栈页面，有上下顺序）、
    //     //frame（子窗口页面，有父页面，父页面一般为stack页面）、
    //     //top（stack页面的最顶层，也是frame页面的始祖）
    //
    //     //窗口仓储
    //     var winStore = new Object();
    //
    //     var upperestName = "";
    //
    //     //从仓储中查找页面窗口对象(未传入win则查找top层页面窗口对象)
    //     function findWinPage(name) {
    //         name = name || _top.window.name;
    //         return winStore[name];
    //     }
    //
    //     function findChildWinByName(win, name) {
    //         if (win.name == name) {
    //             return win;
    //         } else {
    //             var frames = win.frames, length = frames.length;
    //             for (var i = 0; i < length; i++) {
    //                 var targetWin = findChildWinByName(frames[i], name);
    //                 if (targetWin) {
    //                     return targetWin;
    //                 }
    //             }
    //         }
    //     }
    //
    //     function findPageWin(page) {
    //         if (page && page.name) {
    //             // var frames = window.frames;
    //             // for()
    //             //  if(name == "MainIframeR"){
    //             //      return window["MainIframe"]["MainIframeR"];
    //             //  }else{
    //             //      var win = window[page.name];
    //             //      if(!win) {
    //             //          win = window["MainIframe"][page.name];
    //             //          if (!win) {
    //             //              win = window["MainIframe"]["MainIframeR"][page.name];
    //             //          }
    //             //      }
    //             //      return win;
    //             //  }
    //             return findChildWinByName(window, page.name);
    //         }
    //     }
    //
    //     function findWinByName(name) {
    //         if (name) {
    //             return findChildWinByName(window, name);
    //         }
    //     }
    //
    //     //往仓储中存入页面窗口对象
    //     function addWinPage(winPage) {
    //         if (winStore[winPage.name]) {
    //             winPage.data = winStore[winPage.name].data;
    //         }
    //         winStore[winPage.name] = winPage;
    //     }
    //
    //     //页面窗口类构造声明
    //     var WinPage = function (win, type, sWin, param) {
    //         var sPage = (sWin ? findWinPage(sWin.name) : null);
    //         var twin = win || _top.window;
    //         this.name = twin.name;
    //         this.type = type || "frame";
    //         this.dataPool = param || (findWinPage(this.name) && findWinPage(this.name).dataPool) || {};
    //         this.frameWinPool = (findWinPage(this.name) && findWinPage(this.name).frameWinPool) || [];
    //         this.history = [];
    //         if (type == "frame") {
    //             if (sPage) {
    //                 this.parentName = sPage.name;
    //                 if ($.inArray(this.name, sPage.frameWinPool) < 0) {
    //                     sPage.frameWinPool.push(this.name);
    //                 }
    //             }
    //         } else if (type == "stack") {
    //             if (sPage) {
    //                 this.prevName = sPage.name;
    //                 sPage.nextName = this.name;
    //             }
    //
    //             upperestName = this.name;
    //         }
    //
    //     }
    //
    //     //页面窗口属性声明
    //     WinPage.prototype = {
    //         type: "",
    //         name: "",
    //         dataPool: null,
    //         frameWinPool: null,
    //         prevName: "",
    //         nextName: "",
    //         parentName: "",
    //         history: null,
    //         // relateName:"",
    //         // workName:"",
    //         frameIndex: 0,
    //         data: function (key, value) {
    //             var p = this;
    //             if (arguments.length === 0) {
    //                 return p.dataPool;
    //             }
    //             if (!key && key !== 0) {
    //                 throw new Error("方法PageWin.data参数key赋值错误！");
    //             } else if (typeof(arguments[1]) === "undefined") {
    //                 return p.dataPool[key];
    //             } else {
    //                 p.dataPool[key] = value;
    //             }
    //             return p;
    //         },
    //         getFrameName: function () {
    //             return "son" + (this.frameIndex++) + "_" + this.name;
    //         }
    //     }
    //
    //     //对外接口
    //
    //     //加入层次页面（√）
    //     window.pushStackWin = function (win, relateWin, param) {
    //         if (!win) {
    //             win = {name: getFrameName(relateWin)};
    //         }
    //         var newPage = new WinPage(win, "stack", relateWin, param);
    //         addWinPage(newPage);
    //         return newPage.name;
    //     }
    //     //加入子iframe页面（√）
    //     window.addFrameWin = function (win, parentWin, param) {
    //         if (!win) {
    //             win = {name: getFrameName(parentWin)};
    //         }
    //         var newPage = new WinPage(win, "frame", parentWin, param);
    //         addWinPage(newPage);
    //         return newPage.name;
    //     }
    //     //获取前一个层次的关联窗口 （√）
    //     window.getPrevWin = function (index, win) {
    //         index = index || 1;
    //         var winPage = findWinPage(win ? win.name : upperestName);
    //         for (var i = 0; i < index; i++) {
    //             if (winPage.prevName) {
    //                 winPage = findWinPage(winPage.prevName);
    //             } else {
    //                 if (winPage.type == "frame") {
    //                     winPage = findWinPage(winPage.parentName);
    //                 }
    //                 winPage = findWinPage(winPage.prevName);
    //             }
    //         }
    //         var twin = findPageWin(winPage);
    //         return findPageWin(winPage);
    //     }
    //     //获取前一个有reloadTable的关联窗口 （√）
    //     window.getPrevReloadWin = function (index, win) {
    //         index = index || 1;
    //         var winPage = findWinPage(win ? win.name : upperestName);
    //         var reloadWin = null;
    //         for (var i = 0; i < index; i++) {
    //             reloadWin = null;
    //             while (winPage.prevName || winPage.parentName) {
    //                 if (winPage.type == "frame") {
    //                     winPage = findWinPage(winPage.parentName);
    //                 } else {
    //                     winPage = findWinPage(winPage.prevName);
    //                 }
    //                 var twin = findPageWin(winPage);
    //                 if (twin && twin.reloadTable) {
    //                     reloadWin = twin;
    //                     break;
    //                 } else {
    //                     twin = null;
    //                 }
    //             }
    //         }
    //         return reloadWin;
    //     }
    //     //刷新前一个有reloadTable的关联窗口 （√）
    //     window.reloadPrevWin = function (index, win) {
    //         var reloadWin = getPrevReloadWin(index, win);
    //         if (reloadWin && reloadWin.reloadTable) {
    //             reloadWin.reloadTable();
    //         }
    //     }
    //     //或取下一个窗口（×）
    //     window.getNextWin = function (index, win) {
    //
    //     }
    //     //获取父窗口window（zp add）
    //     window.getParentWin = function (win) {
    //         if (!win) {
    //             return;
    //         }
    //         var selfPage;
    //         var parentPage;
    //         if (typeof win == "string") {
    //             selfPage = findWinPage(win);
    //         } else {
    //             selfPage = findWinPage(win.name);
    //         }
    //         if (selfPage || selfPage.parentName) {
    //             parentPage = findWinPage(selfPage.parentName);
    //             if (parentPage) return findPageWin(parentPage);
    //         } else {
    //             return;
    //         }
    //     };
    //     //弹出层内部调用接口，处理关闭后置
    //     window.closeLayerWin = function (name) {
    //         if (!name) return;
    //         var upperestPage = findWinPage(name);
    //
    //         while (upperestPage.type == "frame") {
    //             upperestPage = findWinPage(upperestPage.parentName);
    //         }
    //         if (upperestPage.type !== "top") {
    //             if (name == upperestName) {
    //                 upperestName = upperestPage.prevName;
    //             }
    //             var prevPage = findWinPage(upperestPage.prevName);
    //             if (prevPage.nextName == name) {
    //                 prevPage.nextName = "";
    //             }
    //             delete winStore[upperestPage.name];
    //         }
    //     };
    //
    //     //找stack层
    //     function findStackWin(winPage) {
    //         if (winPage.type == "frame") {
    //             return findStackWin(findWinPage(winPage.parentName));
    //         } else {
    //             return winPage;
    //         }
    //     }
    //
    //     window.handleFrameSelect = function (win, isShow, notHandlePrev) {
    //         if (win) {
    //             if (!notHandlePrev) {
    //                 var handlePage = findWinPage(win.name);
    //                 while (handlePage.parentName && handlePage.parentName != "top") {
    //                     var frameWin = findPageWin(handlePage);
    //                     if (frameWin) {
    //                         $(frameWin.document).find("select").each(function (si, st) {
    //                             st = $(st);
    //                             if (isShow) {
    //                                 if (st.hasClass("_zbselect") && !st.hasClass("_zbtabselect")) {
    //                                     st.removeClass("_zbselect").show();
    //                                 }
    //                             } else {
    //                                 if (!st.is(":hidden") && !st.hasClass("_zbtabselect")) {
    //                                     st.addClass("_zbselect").hide();
    //                                 }
    //                             }
    //                         })
    //                     }
    //                     handlePage = findWinPage(handlePage.parentName);
    //                 }
    //             }
    //             $(win.document).find("select").each(function (si, st) {
    //                 st = $(st);
    //                 if (isShow) {
    //                     if (st.hasClass("_zbselect") && !st.hasClass("_zbtabselect")) {
    //                         st.removeClass("_zbselect").show();
    //                     }
    //                 } else {
    //                     if (!st.is(":hidden") && !st.hasClass("_zbtabselect")) {
    //                         st.addClass("_zbselect").hide();
    //                     }
    //                 }
    //             })
    //             var handlePage = findWinPage(win.name);
    //             if (handlePage.frameWinPool) {
    //                 for (var i = 0; i < handlePage.frameWinPool.length; i++) {
    //                     var frameWin = win[handlePage.frameWinPool[i]];
    //                     window.handleFrameSelect(frameWin, isShow, true);
    //                 }
    //             }
    //         }
    //     }
    //     window.handleSelect = function (win, isShow) {
    //         if (isIE6 && !_top.hasLayerAlert) {
    //             win = win ? win : findWinByName(window.upperestName);
    //             window.handleFrameSelect(win, isShow);
    //             if (!isShow) {
    //                 var startWinName = win.name ? win.name : _top.upperestName;
    //                 var handlePage = findWinPage(startWinName);
    //                 while (handlePage.type == "frame") {
    //                     handlePage = findWinPage(handlePage.parentName);
    //                 }
    //                 while (handlePage && handlePage.type !== "top") {
    //                     while (handlePage.type == "frame") {
    //                         handlePage = findWinPage(handlePage.parentName);
    //                     }
    //                     window.handleFrameSelect(findPageWin(handlePage), isShow);
    //                     if (handlePage.prevName) {
    //                         handlePage = findWinPage(handlePage.prevName);
    //                     } else {
    //                         break;
    //                     }
    //                 }
    //             } else {
    //                 var startWinName = win.name ? win.name : _top.upperestName;
    //                 var handlePage = findWinPage(startWinName);
    //                 while (handlePage.type == "frame") {
    //                     handlePage = findWinPage(handlePage.parentName);
    //                 }
    //                 if (handlePage.prevName) {
    //                     handlePage = findWinPage(handlePage.prevName);
    //                     window.handleFrameSelect(findPageWin(handlePage), isShow);
    //                 }
    //             }
    //         }
    //     }
    //     //向前关闭窗口（√）
    //     window.closeWin = function (index, win) {
    //         var tUpName = (win && win.name) ? win.name : upperestName;
    //         setTimeout(function () {
    //             index = index || 1;
    //             var upperestPage = findWinPage(tUpName);
    //             while (upperestPage.type == "frame") {
    //                 upperestPage = findWinPage(upperestPage.parentName);
    //             }
    //             for (var i = 0; i < index; i++) {
    //                 if (findPageWin(upperestPage) && findPageWin(upperestPage).closeFunc) {
    //                     findPageWin(upperestPage).closeFunc();
    //                 }
    //                 layer.close(layer.getFrameIndex(upperestPage.name));
    //                 upperestPage = findWinPage(upperestPage.prevName);
    //                 while (upperestPage.type == "frame") {
    //                     upperestPage = findWinPage(upperestPage.parentName);
    //                 }
    //             }
    //         }, 1);
    //     }
    //     //向前关闭所有窗口 （√）       待关闭页面加上全局变量notCloseTag = true，若非最上层页面，则停止关闭
    //     window.closeAllWin = function () {        //关闭全部窗口接口。待关闭页面加上全局变量notCloseTag = true，若非最上层页面，则停止关闭
    //         var tUpName = upperestName;
    //         setTimeout(function () {
    //             var upperestPage = findWinPage(tUpName);
    //             if (upperestPage.type == "frame") {
    //                 upperestPage = findWinPage(upperestPage.parentName);
    //             }
    //             var notCloseTag = false;
    //             var tempTopWin = false;
    //             while (upperestPage.type != "top" && !notCloseTag && !tempTopWin) {
    //                 if (findPageWin(upperestPage) && findPageWin(upperestPage).closeFunc) {
    //                     findPageWin(upperestPage).closeFunc();
    //                 }
    //                 layer.close(layer.getFrameIndex(upperestPage.name))
    //                 upperestPage = findWinPage(upperestPage.prevName);
    //                 var upperSetWin = findPageWin(upperestPage);
    //                 if (upperSetWin) {
    //                     if (upperSetWin.notCloseTag) {
    //                         notCloseTag = true;
    //                     }
    //                     if (upperSetWin.tempTop) {
    //                         tempTopWin = true;
    //                     }
    //                 }
    //
    //                 // if (findPageWin(upperestPage) && findPageWin(upperestPage).notCloseTag) {
    //                 //     notCloseTag = true;
    //                 // }
    //                 if (upperestPage.type == "frame") {
    //                     upperestPage = findWinPage(upperestPage.parentName);
    //                     if (findPageWin(upperestPage) && findPageWin(upperestPage).notCloseTag) {
    //                         notCloseTag = true;
    //                     }
    //                 }
    //             }
    //         }, 1);
    //     };
    //     //获取指定窗口的数据   （√）
    //     window.winData = function (win, key, value) {
    //         if (arguments.length == 0) {
    //             throw new Error("方法winData需包含参数！");
    //         }
    //         if (win && win.name) {
    //             win = win.name;
    //         }
    //         var dataPage = findWinPage(win);
    //         if (arguments.length == 1) {
    //             return dataPage.data();
    //         } else if (arguments.length == 2) {
    //             return dataPage.data(key);
    //         } else {
    //             return dataPage.data(key, value);
    //         }
    //     };
    //     //设置页面历史搜索记录
    //     window.setHistorySearchData = function (key, data) {
    //         winData(_top, "listSearchJson_" + key, data);
    //     };
    //     //获取页面历史搜索记录
    //     window.getHistorySearchData = function (key) {
    //         var data = winData(_top, "listSearchJson_" + key);
    //         winData(_top, "listSearchJson_" + key, null);
    //         return data;
    //     }
    //     //获取最上层窗口
    //     window.getUpperestWin = function () {
    //         return findWinByName(upperestName);
    //     }
    //     //获取需要的子窗口的win的name
    //     window.getFrameName = function (parentWin) {
    //         var parentPage = findWinPage(parentWin.name);
    //         return parentPage.getFrameName();
    //     }
    //     //获取窗口下子窗口的名称数组
    //     window.getFrameNameArray = function (win) {
    //         if (arguments.length == 0) {
    //             throw new Error("方法winData需包含参数！");
    //         }
    //         var dataPage = findWinPage(win.name);
    //         return dataPage ? dataPage.frameWinPool : new Array();
    //     }
    //     //关闭窗口（需关闭window为参数）
    //     window.closeLayer = function (win) {
    //         if (win.closeFunc) {
    //             win.closeFunc();
    //         }
    //         var index = layer.getFrameIndex(win.name); //获取窗口索引
    //         layer.close(index);
    //     }
    //     //新版窗口管理打开弹出层
    //     window.openStack = function (win, title, areaType, url, param, callBacks, offset) {
    //         var winOrigin = document.location.origin,
    //             crossOriginTag = url.startWith("http") && !url.startWith(winOrigin + "/" + RX.ctxPath),
    //             iframeWinName = "",
    //             area;
    //         if (areaType === "small") {
    //             area = ['450px', '350px'];
    //         } else if (areaType === "medium") {
    //             area = ['700px', '500px'];
    //         } else if (areaType === "big") {
    //             area = ['900px', '600px'];
    //         } else if (areaType === "tree") {
    //             area = ['400px', '600px'];
    //         } else {
    //             area = areaType;
    //         }
    //         var openParam = {
    //             //zIndex:1,
    //             type: 2,
    //             title: title,
    //             area: area,
    //             maxmin: true,
    //             parentWin: win,
    //             param: param,
    //             content: RX.handlePath(url),
    //             success: function (layero, index) {
    //                 if (crossOriginTag) {
    //                     if (win.successCallback) {
    //                         win.successCallback();
    //                     }
    //                     if (callBacks && typeof(callBacks.success) === "function") {
    //                         callBacks.success(layero, index);
    //                     }
    //                     return;
    //                 }
    //                 iframeWin = window[layero.find('iframe')[0]['name']];
    //                 iframeWinName = iframeWin && iframeWin.name;
    //                 _top.pushStackWin(iframeWin, win);
    //                 if (win.successCallback) {
    //                     win.successCallback();
    //                 }
    //                 if (callBacks && typeof(callBacks.success) === "function") {
    //                     callBacks.success(layero, index);
    //                 }
    //             },
    //             end: function () {
    //                 if (crossOriginTag) {
    //                     if (callBacks && typeof(callBacks.end) === "function") {
    //                         callBacks.end();
    //                     }
    //                     return;
    //                 }
    //                 if (_top.ZENG)
    //                     _top.ZENG.msgbox.hide();
    //                 _top.closeLayerWin(iframeWinName);
    //                 if (callBacks && typeof(callBacks.end) === "function") {
    //                     callBacks.end();
    //                 }
    //             },
    //             cancel: function () {
    //                 if (crossOriginTag) {
    //                     if (callBacks && typeof(callBacks.cancel) === "function") {
    //                         callBacks.cancel();
    //                     }
    //                     return true;
    //                 }
    //                 var cwin = _top.getUpperestWin();
    //                 if (cwin != null) {
    //                     if (cwin.cancelCheck) {
    //                         return cwin.cancelCheck();
    //                     }
    //                 }
    //                 if (callBacks && typeof(callBacks.cancel) === "function") {
    //                     callBacks.cancel();
    //                 }
    //                 return true;
    //             }
    //         };
    //         if (offset) {
    //             openParam.offset = offset;
    //         }
    //         _top.layer.open(openParam);
    //     };
    //
    //     //（暂时停用）回退历史，bindex为退回次数，默认为1
    //     window._backHistory = function (win, bindex) {
    //         var page = findWinPage(win.name);
    //         bindex = bindex ? bindex : 1;
    //         if (page) {
    //             var url;
    //             while (page.history.length > 0 && bindex > 0) {
    //                 url = page.history.pop();
    //                 bindex--;
    //             }
    //             if (url) {
    //                 page.frameWinPool = new Array();
    //                 win.location.href = url;
    //             }
    //         }
    //     }
    //
    //     //frame路径跳转
    //     window.frameGoto = function (obj, url) {
    //         url = RX.handlePath(url);
    //         var el = obj[0], iframe = el.contentWindow;
    //         if (iframe != null) {
    //             if (iframe.closeFunc) {
    //                 iframe.closeFunc();
    //             }
    //         }
    //         if (el) {
    //             if (isIE) {
    //                 el.src = 'about:blank';
    //                 try {
    //                     iframe.document.write('');
    //                     iframe.close();
    //                 } catch (e) {
    //                 }
    //             }
    //             el.src = url;
    //         }
    //     }
    //
    //     //主菜单点击跳转
    //     window.clickMainMenu = function (obj, url) {
    //         url = RX.handlePath(url);
    //         var mainIframe = $("#MainIframe");
    //         _top.pushStackWin(window["MainIframe"], window);
    //         frameGoto(mainIframe, url ? url : $(obj).find("a").attr("url"));
    //     }
    //
    //     //子菜单点击跳转
    //     window.clickSubMenu = function (obj, url) {
    //         url = RX.handlePath(url);
    //         var mainIframeWin = window["MainIframe"];
    //         var mainIframeR = $("#MainIframeR", mainIframeWin.document);
    //         _top.pushStackWin(mainIframeWin.window["MainIframeR"], mainIframeWin);
    //         frameGoto(mainIframeR, url ? url : $(obj).find("a").attr("url"));
    //     }
    //
    //     window.findWorkflowFrameWin = function (win) {
    //         if (win) {
    //             if (win.name == "MainIframeR" || win.workflowFrame) {
    //                 return win;
    //             } else {
    //                 var winPage = findWinPage(win.name);
    //                 if (winPage.type == "frame") {
    //                     if (winPage.parentName == _top.name) {
    //                         return findPageWin(winPage);
    //                     } else {
    //                         return findWorkflowFrameWin(findPageWin(winStore[winPage.parentName]));
    //                     }
    //                 } else {
    //                     if (winPage.prevName == _top.name) {
    //                         return findPageWin(winPage);
    //                     } else {
    //                         return findWorkflowFrameWin(findPageWin(winStore[winPage.prevName]));
    //                     }
    //                 }
    //             }
    //         } else {
    //             return null;
    //         }
    //     };
    //
    //     if (!window.name) {
    //         window.name = "top";
    //     }
    //
    //     //top页初始化
    //     var topPage = new WinPage(window, "top");
    //     addWinPage(topPage);
    //     upperestName = topPage.name;
    //
    //     // window.pushStackWin({name: "MainIframe"}, window);
    //     // window.pushStackWin({name: "MainIframeR"}, {name: "MainIframe"});
    //
    //     var menuData = null;
    //     window.getMenuData = function (obj) {
    //         $.ajax({
    //             type: "post",
    //             url: "/jwbzxt/getMenuData",
    //             dataType: "json",
    //             success: function (ar) {
    //                 if (ar.success) {
    //                     menuData = ar.data;
    //                     showMenu(obj);
    //                 } else {
    //                     layer.alert(ar.msg);
    //                 }
    //             }
    //         })
    //     }
    //     window.showMenu = function (obj) {
    //         $(obj).find("li").each(function () {
    //             var code = $(this).attr("code");
    //             if (code) {
    //                 if ($.inArray(code, menuData) > -1) {
    //                     $(this).removeClass("hideElement");
    //                 }
    //             }
    //         })
    //     }
    //
    //     var historyArray = [];
    //     //绘制历史路径区
    //     window.drawHistory = function () {
    //         //清除区域
    //         $("#breadcrumb").find("a").each(function (i, t) {
    //             if (!$(t).hasClass("tip-bottom")) {
    //                 $(t).remove();
    //             }
    //         });
    //         //重新插入历史项
    //         for (var i = 0; i < historyArray.length; i++) {
    //             $("#breadcrumb").append("<a href='javascript:void(0);' historyIndex='" + i +
    //                 "' class='" + (historyArray.length == i + 1 ? "current " : " ") +
    //                 (historyArray[i].url ? "" : "noCursor") + "'>" + historyArray[i].name + "</a>");
    //         }
    //         //绑定点击事件
    //         $("#breadcrumb").find("a").each(function (i, t) {
    //             if (!$(t).hasClass("tip-bottom") && !$(t).hasClass("noCursor")) {
    //                 $(t).bind("click", function () {
    //                     clickHistory($(this).attr("historyIndex"));
    //                 });
    //             }
    //         });
    //     }
    //
    //     //点击路径历史区某历史后置
    //     var iframeR = $("#MainIframeR");
    //
    //     function clickHistory(index) {
    //         //循环推出历史页，维护点击截取后历史array
    //         var tempHistory = historyArray.pop(), tlength = historyArray.length;
    //         for (var i = 0; i < tlength - index; i++) {
    //             tempHistory = historyArray.pop();
    //         }
    //         historyArray.push(tempHistory);
    //         //重新绘制路径历史区
    //         drawHistory();
    //         //跳转点击项url
    //         if (tempHistory.url) {
    //             if (tempHistory.url.indexOf("?") > -1) {
    //                 tempHistory.url += "&_freshTag=1";
    //             } else {
    //                 tempHistory.url += "?_freshTag=1";
    //             }
    //             gotoUrl(iframeR, tempHistory.url);
    //         }
    //     }
    //
    //     //页面跳转，维护页面历史记录
    //     //handleTpe-'pMenu'点击主菜单跳转,'sMenu'点击子菜单跳转,'page'页面操作跳转
    //     window.showHistory = function (handleType, url, name, pName) {
    //         var lastOne = historyArray.length > 0 ? historyArray[historyArray.length - 1] : null;
    //         if (name == "我的项目") {     //工作台特殊处理，只保留工作台
    //             historyArray = [];
    //             historyArray.push({name: name, url: url, type: "sMenu"});
    //         } else if (handleType == "pMenu") {      //若点击父菜单，（暂）清空array，插入父菜单历史
    //             historyArray = [];
    //             historyArray.push({name: name, url: url, type: "pMenu"});
    //         } else if (handleType == "sMenu") {         //若点击子菜单，如上一历史为父菜单，直接推入子菜单，否则清空array，推入父子菜单
    //             if (lastOne && lastOne.type != "pMenu") {
    //                 historyArray = [];
    //                 historyArray.push({name: pName, url: null, type: "pMenu"});
    //             }
    //             historyArray.push({name: name, url: url, type: "sMenu"});
    //         } else {       //若为页面操作跳转，直接加入新页面历史
    //             historyArray.push({name: name, url: url, type: "page"});
    //         }
    //         //重新绘制路径历史区
    //         drawHistory();
    //     }
    //
    //     //刷新当前页历史
    //     window.freshHistory = function (handleType, url, name) {
    //         var oldH = historyArray.pop();
    //         handleType = handleType || oldH.type;
    //         url = url || oldH.url;
    //         name = name || oldH.name;
    //         historyArray.push({name: name, url: url, type: handleType});
    //         //重新绘制路径历史区
    //         drawHistory();
    //         return url;
    //     }
    //
    //     //页面后退，维护页面历史记录，返回退回url
    //     window.showHistoryBack = function (index, url, name) {
    //         //处理退回页数参数
    //         index = (index > historyArray.length - 1 ? historyArray.length - 1 : index) || 1;
    //         var tempHistory = historyArray.pop(); //将当前页作为初始temp页
    //         //循环推出最后一页
    //         for (var i = 0; i < index; i++) {
    //             tempHistory = historyArray.pop();
    //         }
    //         //填入定制的url和name，若为空，则以原来的为准
    //         tempHistory.url = url || tempHistory.url;
    //         tempHistory.name = name || tempHistory.name;
    //         //将最后推出页（目标页）重新推出历史array中，绘制历史路径区
    //         historyArray.push(tempHistory);
    //         drawHistory();
    //         //若该页有url，则返回url
    //         if (tempHistory && tempHistory.url) {
    //             return tempHistory.url;
    //         }
    //     }
    //
    //     //前往
    //     window._freshLocation = function (win, url, name) {
    //         url = RX.handlePath(url);
    //         var page = findWinPage(win.name);
    //         if (page) {
    //             page.history.pop();
    //             page.history.push(url);
    //             page.frameWinPool = new Array();
    //             win.location.href = freshHistory(null, url, name);
    //         }
    //     };
    //
    //     //前往
    //     window._gotoLocation = function (win, url, name) {
    //         url = RX.handlePath(url);
    //         var page = findWinPage(win.name);
    //         if (page) {
    //             page.history.push(url);
    //             page.frameWinPool = new Array();
    //             win.location.href = url;
    //             showHistory("page", url, name);
    //         }
    //     };
    //
    //     //回退
    //     window._backLocation = function (win, index, url, name) {
    //         url = RX.handlePath(url);
    //         var page = findWinPage(win.name);
    //         if (page) {
    //             url = showHistoryBack(index, url, name);
    //             if (url) {
    //                 page.history.push(url);
    //                 page.frameWinPool = new Array();
    //                 win.location.href = url;
    //             }
    //         }
    //     };
    //
    //     //前往路径,url为跳转路径，name为历史区显示的历史项名称
    //     window.gotoLocation = function (url, name) {
    //         _top._gotoLocation(window, url, name);
    //     };
    //     //路径回退，index回退页数,url为可定制的新url，如不填写，则以历史url为准，name为可定制的新历史项名称，如不填写，则以历史名称为准
    //     window.backLocation = function (index, url, name) {
    //         _top._backLocation(window, index, url, name);
    //     };
    //
    //     window.hasLayerManager = true;
    //
    //
    //     window.getFeatureList = function () {
    //         var featureData = [];
    //         $.ajax({
    //             async: false,
    //             type: "GET",
    //             url: "/medias/cache/rx_features.js?r=" + Math.random(),
    //             dataType: "JSON",
    //             success: function (jsondata, textStatus) {
    //                 //判断是否过期 如果过期 则删除过期文件 并使用服务器发回的最新数据
    //                 if (jsondata) {
    //                     featureData = jsondata.data;
    //                 }
    //             }, error: function (XMLHttpRequest, textStatus, errorThrown) {
    //                 if (XMLHttpRequest.status = 404) {//文件不存在，择请求服务器生成文件
    //                     $.ajax({
    //                         async: false,
    //                         type: "POST",
    //                         url: "/feature/featureFileCreate",
    //                         dataType: "JSON",
    //                         success: function (response) {
    //                             featureData = response;
    //                         }
    //                     });
    //                 }
    //             }
    //         });
    //         return featureData;
    //     };
    //     window.getToTagUrl = function (win) {
    //         var windPage = winStore[win.name];
    //         //查看MainIframeR那一层
    //         if (windPage.type == "frame" && windPage.parentName != _top.name && windPage.name != "MainIframeR") {
    //             return getParentWin(win).location.href;
    //         } else {
    //             return win.location.href;
    //         }
    //     };
    //     window.showDialog = function (name, option, url, property, isReload, win) {
    //         if (property != null || property != undefined) {
    //             window.property = property;
    //         } else {
    //             window.property = null;
    //         }
    //         if (name == "" || name == null || name == undefined) {
    //             name = "d" + new Date().getTime();
    //         }
    //         var option = option || {};
    //         option.width = option.width || 600;
    //         option.height = option.height || 400;
    //         option.title = option.title || '弹出窗口';
    //         openStack((win || window), option.title, [option.width + "px", option.height + "px"], url);
    //     }
    //
    //     /**
    //      * 获取初始配置信息，缓存至窗口data中
    //      */
    //     function initConfigData() {
    //         $.ajax({
    //             url: "/config/getBaseConfig",
    //             async: false,
    //             success: function (ar) {
    //                 if (ar.success) {
    //                     _top.winData(_top, "CONFIG", ar.data);
    //                 }
    //             }
    //         })
    //     }
    //
    //     /**
    //      * 获取初始用户信息，缓存至窗口data中
    //      */
    //     function initShiroUserInfo() {
    //         $.ajax({
    //             url: "/main/getShiroUserInfo",
    //             async: false,
    //             success: function (ar) {
    //                 if (ar.success) {
    //                     _top.winData(_top, "USER", ar.data);
    //                 }
    //             }
    //         })
    //     }
    //
    //     //如果为临时top层，提供缓存配置与用户信息
    //     if (!checkLastUrl("login")) {
    //         initConfigData();
    //         initShiroUserInfo();
    //     }
    // }
}).call(this);