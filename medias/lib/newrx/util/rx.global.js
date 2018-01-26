/**
 * 基于rx.load.js/jquery.js运行
 *
 */
(function (global) {

    return;
    //重写jquery的ajax方法（主要解决项目路径问题）
    //noinspection UnreachableCodeJS
    var _ajax = $.ajax;
    $.ajax = function (opt) {
        var turl = opt.url;
        //备份opt中error和success方法
        opt.url = RX.handlePath(opt.url);
        var fn = {
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            },
            success: function (data, textStatus) {
            }
        };
        if (opt.error) {
            fn.error = opt.error;
        }
        if (opt.success) {
            fn.success = opt.success;
        }

        //扩展增强处理
        var _opt = $.extend(opt, {
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //错误回调方法增强处理
                fn.error(XMLHttpRequest, textStatus, errorThrown);
            },
            success: function (data, textStatus) {
                //成功回调方法增强处理
                if (data === "session timeout") {
                    _top.location.href = document.location.origin + "/" + RX.ctxPath + "/login";
                    return;
                } else if (data === "ajax notfound") {
                    RX.rxLog(data + " :" + turl);
                    return;
                }
                fn.success(data, textStatus);
            }
        });
        _ajax(_opt);
    };

    //重写jquery的post方法（主要解决项目路径问题）
    var _post = $.post;
    $.post = function (url, data, success, error) {
        //备份opt中error和success方法
        url = RX.handlePath(url);
        var _success = function (data, textStatus, jqXHR) {
            //成功回调方法增强处理
            if (data === "session timeout") {
                _top.location.href = document.location.origin + "/" + RX.ctxPath + "/login";
                return;
            } else if (data === "ajax notfound") {
                RX.rxLog(data + " :" + turl);
                return;
            }
            if (success) {
                success(data, textStatus, jqXHR);
            }
        };
        _post(url, data, _success, error);
    };

    //重写jquery的post方法（主要解决项目路径问题）
    var _get = $.get;
    $.get = function (url, data, success, error) {
        //备份opt中error和success方法
        url = RX.handlePath(url);
        var _success = function (data, textStatus, jqXHR) {
            //成功回调方法增强处理
            if (data === "session timeout") {
                _top.location.href = document.location.origin + "/" + RX.ctxPath + "/login";
                return;
            } else if (data === "ajax notfound") {
                RX.rxLog(data + " :" + turl);
                return;
            }
            if (success) {
                success(data, textStatus, jqXHR);
            }
        };
        _get(url, data, _success, error);
    };

    //全局统一页面关闭接口(元素id固化为close)
    $(function () {
        $("#close").click(function () {
            closeWin();
        })
    });

    //列表表单自适应大小
    RX.resizeTable = function () {
        setTimeout(function () {
            $(".list_box").innerHeight($(window).height() - $(".operation_box").outerHeight() - ($(".query_box").is(":hidden") ? 0 : $(".query_box").outerHeight()));
        }, 0);
        $(window).resize(function () {
            $(".list_box").innerHeight($(window).height() - $(".operation_box").outerHeight() - ($(".query_box").is(":hidden") ? 0 : $(".query_box").outerHeight()));
        })
    };

    //form表单自适应大小
    RX.resizeForm = function () {
        setTimeout(function () {
            $(".form_box").innerHeight($(window).height() - $(".w_button_box").outerHeight());
        }, 0);
        $(window).resize(function () {
            $(".form_box").innerHeight($(window).height() - $(".w_button_box").outerHeight());
        })
    };

    /**
     * 获取地址栏参数
     * @param name 参数名
     * @returns {null}
     */
    RX.getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    };

    //供rxMsg函数使用的常量配置，项目可根据需要自行增加修改，或者使用平台设置的默认值
    RX.RxMsgType = {
        WARNNING: {icon: 0, msg: "警告"},
        SUCCESS: {icon: 1, msg: "成功"},
        ERROR: {icon: 2, msg: "失败"},
        DOUBT: {icon: 3, msg: "疑问"},
        LOCK: {icon: 4, msg: "锁定"}
    };

    /**
     * 统一弹出层信息提示
     * @param type 提示类型
     * @param msg 提示信息
     * @param fn 回调函数
     */
    RX.rxMsg = function (type, msg, fn) {
        if (typeof(type) === "string") {
            if (msg) {
                fn = msg;
            }
            msg = type;
            type = RxMsgType.SUCCESS;
        }
        var icon;
        if (typeof type === "object") {
            icon = type.icon;
            msg = msg || type.msg;
        } else {
            msg = type;
        }
        layer.msg(msg, {
            icon: icon,
            time: 2000
        }, function () {
            fn && typeof fn === "function" && fn();
        });
    };

    /**
     * 控制台输出信息
     * @param content 输出内容
     */
    RX.rxLog = function (content) {
        if (window.console && window.console.log) {
            console.log(content);
        }
    };

    /**
     * 当页面有ajax请求时，添加遮罩提示
     * @param text 提示内容
     * @param inWin 显示窗口
     */
    RX.pageAjax = function (text, inWin) {
        setTimeout(function () {
            if (text) {
                if (typeof text === "boolean") {
                    inWin = true;
                    text = "数据处理中，请稍候...";
                }
            } else {
                text = "数据处理中，请稍候...";
            }
            if (_top.ZENG) {
                $("body").ajaxStart(function () {
                    _top.ZENG.msgbox.show(text, 6, 0, null, inWin ? window : null);
                }).ajaxStop(function () {
                    _top.ZENG.msgbox.hide(100, inWin ? window : null);
                });
            }
        }, 0);
    };

    /**
     * 列表表单搜索区显隐控制
     * @param $div 搜索区div元素(jQuery对象)
     * @param $item 控制元素(jQuery对象)
     * @param showTag true：默认展开 false：默认隐藏
     */
    RX.toggleSearchView = function ($div, $item, showTag) {
        /**
         * 展开搜索区
         * @param noSpeed 移动速度
         * @private
         */
        function _showView(noSpeed) {
            if (typeof (noSpeed) === "boolean" && noSpeed) {
                $div.show(function () {
                    $(".list_box").innerHeight($(window).height() - $(".operation_box").outerHeight() - $(".query_box").outerHeight());
                });
            } else {
                $div.show("normal", function () {
                    $(".list_box").innerHeight($(window).height() - $(".operation_box").outerHeight() - $(".query_box").outerHeight());
                });
            }
            $item.attr("title", "展开搜索区");
            $item.addClass("rotate");
        }

        /**
         * 收起搜索区
         * @param noSpeed 移动速度
         * @private
         */
        function _hideView(noSpeed) {
            if (typeof (noSpeed) === "boolean" && noSpeed) {
                $div.hide(function () {
                    $(".list_box").innerHeight($(window).height() - $(".operation_box").outerHeight());
                });
            } else {
                $div.hide("normal", function () {
                    $(".list_box").innerHeight($(window).height() - $(".operation_box").outerHeight());
                });
            }
            $item.attr("title", "收起搜索区");
            $item.removeClass("rotate");
        }

        if (showTag) {
            _showView(true);
            $item.toggle(_hideView, _showView);
        } else {
            _hideView(true);
            $item.toggle(_showView, _hideView);
        }
    };

    /**
     * 加载页面时出现遮罩层
     * @param options 可选参数，设置sleep、delayTime
     */
    this.startLoadingTime = 0;
    RX.loadingPages = function (options) {
        var now = new Date().getTime();
        if (options || !_top.startLoadingTime || 300 < now - _top.startLoadingTime) {
            _top.startLoadingTime = now;
            $.MyCommon.PageLoading(options);
        }
    };

    /**
     * 隐藏页面加载时遮罩层
     * @param options 可选参数，设置sleep、delayTime
     */
    RX.hideLoadingPages = function (options) {
        $.MyCommon.hideLoading(options);
    };

    /**
     * 设置cookie
     * @param name cookie名称
     * @param value cookie值
     * @param expiredays 过期时间
     */
    RX.setCookie = function (name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = name + "=" + escape(value) +
            ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
    };

    /**
     * 根据cookie名称获取cookie值
     * @param name cookie名称
     * @returns {*}
     */
    RX.getCookie = function (name) {
        var cookie = document.cookie;
        if (cookie.length > 0) {
            var start = cookie.indexOf(name + "=");
            if (start !== -1) {
                start = start + name.length + 1;
                var end = cookie.indexOf(";", start);
                if (end === -1) end = cookie.length;
                return unescape(cookie.substring(start, end));
            }
        }
        return "";
    };

    /**
     * 异步树初始加载第一个子节点数据（注意ztree位置设置id）
     * @param func 传入回调函数
     * @returns {Function}
     */
    RX.expandFirstTreeNode = function (func) {
        var firstAsyncSuccessFlag = 0;
        return function (event, treeId, msg) {
            var tree = this.getZTreeObj(treeId);
            if (firstAsyncSuccessFlag === 0)
                try {
                    //调用默认展开第一个结点
                    var nodes = tree.getNodes();
                    tree.expandNode(nodes[0], true);
                    firstAsyncSuccessFlag = 1;
                    if (func && typeof func === "function") {
                        func(treeId, nodes[0]);
                    }
                } catch (e) {
                    RX.rxLog("获取不到ztree，检查设置id");
                }
        }
    };

    /**
     * 同步树搜索对象
     * @param $el：搜索区渲染的位置
     * @param ztreeId 需要关联搜索的树对象
     * @param ztree ztree
     * @constructor
     */
    RX.ZTreeSearch = function ($el, ztreeId, ztree) {
        var ztreeSearch = this,
            searchDataArr = [],
            searchLength = 0,
            index = 0;
        ztreeSearch.$el = $el;
        ztreeSearch.ztreeId = ztreeId;
        ztreeSearch.ztree = ztree;
        //如果存在不添加
        var $soBox = $el.prev();
        if ($soBox.hasClass("so_box")) {
            $soBox.remove();
        }
        //长度计算el的宽度，进行计算
        //搜索区div
        var $searchBox = $("<div class=\"so_box\"></div>");
        var $earchDiv = $("<div class=\"so_k\"></div>");
        $searchBox.append($earchDiv);
        //搜索input框
        var $searchInput = $("<input type=\"text\" placeholder=\"请输入搜索内容\"/>");
        $earchDiv.append($searchInput);
        //分页区
        var $prev = $("<a class=\"prev aidShow\" href=\"javascript:void(0)\" title='上一条' style='color: black;'>\n" +
            "                                        <i class=\"iconfont \">&#xe72b;</i></a>");
        var $next = $("<a class=\"next aidShow\" href=\"javascript:void(0)\" title='下一条' style='color: black;'>\n" +
            "                                       <i class='iconfont'>&#xe72c;</i></a>");
        //显示页数
        var $showDiv = $("<span class=\"aidShow aidArea\"> 第<span class=\"current\">0</span>条 共<span\n" +
            "                                            class=\"countNum\">0</span>条</span>");
        $earchDiv.append($showDiv);
        $earchDiv.append($prev);
        $earchDiv.append($next);
        var currentSpan = $showDiv.find(".current"),    //显示目前位置
            countSpan = $showDiv.find(".countNum");            //总数
        $el.before($searchBox);
        var $ztreeParent = $("#" + ztreeId).parent(),
            _top,         //父节点偏移量
            _height = $ztreeParent.height(),  //父节点高度
            //构建搜索区
            timeoutid;
        $searchInput.bind("keyup", function () {
            clearTimeout(timeoutid);
            var text = this.value;
            if (text) {
                timeoutid = setTimeout(function () {
                    if (!_top) {
                        //由于树构建时布局可能会变化
                        _top = $ztreeParent.offset().top;
                    }
                    if (!ztreeSearch.ztree) {
                        ztreeSearch.ztree = $.fn.zTree.getZTreeObj(ztreeId);
                    }
                    var ztreeObj = ztreeSearch.ztree;
                    if (ztreeObj) {
                        //取消选中节点
                        searchDataArr = ztreeObj.getNodesByParamFuzzy("name", text);
                        searchLength = searchDataArr.length;
                        if (searchLength > 0) {
                            // selectedNode(searchDataArr[0]);
                            ztreeObj.selectNode(searchDataArr[0], false, _selectedNode);
                            index = 1;
                            currentSpan.text("1");
                            countSpan.text(searchLength);
                        } else {
                            currentSpan.text("0");
                            countSpan.text(0);
                        }
                        _showPageFast();
                    }
                }, 1000);
            } else {
                _hidePageFast();
            }
        });
        $prev.bind("click", function () {
            if (searchLength > 0) {
                if ((index - 1) === 0) {
                    index = searchLength;
                } else {
                    index--;
                }
                currentSpan.text(index);
                ztreeSearch.ztree.selectNode(searchDataArr[index - 1], false, _selectedNode);
            }
        });
        $next.on("click", function () {
            if (searchLength > 0) {
                var next = ++index;
                if (next > searchLength) {
                    index = 1;
                }
                currentSpan.text(index);
                ztreeSearch.ztree.selectNode(searchDataArr[index - 1], false, _selectedNode);
            }
        });

        function _selectedNode(node) {
            //重写ztree的移动位置的方法
            var _scrollTop = $("#" + node.tId).offset().top - _top + $ztreeParent.scrollTop();
            var _addScrollTop = parseInt(_scrollTop / _height) * _height;
            if ((_scrollTop - _addScrollTop) >= _height - 25) {
                _addScrollTop = _addScrollTop + 25;
            }
            $ztreeParent.scrollTop(_addScrollTop);
            $("#" + node.tId + "_a").addClass("curSelectedNode");
        }

        //隐藏分页项
        function _hidePageFast() {
            $prev.hide();
            $next.hide();
            $showDiv.hide();
        }

        //显示分页项
        function _showPageFast() {
            $prev.show();
            $next.show();
            $showDiv.show();
        }
    };

    /*****自定义_top层实现*****/

        //父级window
    var _parent,
        //跨域标志位
        _crossOrigin = false,
        //临时top标志位
        _tempTop = false;

    try {
        _parent = window.parent;
        //为顶层页，则parent依然为当前window
        if (window == _parent) {
            _tempTop = true;
        }
        if (_parent.location.origin !== window.location.origin) {
            //域地址（origin）不同的项目
            _tempTop = true;
            _crossOrigin = true;
        } else if (_parent.RX) {
            //平台开发的系统
            //IE可跨域读取，故需判断项目路径是否相同
            if (_parent.RX.ctxPath != window.RX.ctxPath) {
                _tempTop = true;
                _crossOrigin = true;
            }
        } else {
            //外部系统
            _tempTop = true;
            //未命名RX空间的parentWin,默认为外部系统且跨域
            _crossOrigin = true;
        }
    } catch (e) {
        //异常，确定跨域
        _crossOrigin = true;
        _tempTop = true;
    }
    this._tempTop = _tempTop;
    this._crossOrigin = _crossOrigin;
    this._top = (function () {
        if (_tempTop) {
            return window;
        } else {
            var twin = window.parent;
            var i = 0;
            while (!twin._tempTop) {
                twin = twin.parent;
                i++;
                if (i > 10) {
                    twin = window;
                    _tempTop = true;
                }
            }
            return twin;
        }
    })();
}).call(this);
