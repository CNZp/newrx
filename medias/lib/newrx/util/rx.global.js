//注册RX空间
window.RX = window.RX || {};
RX.isIE = !!window.ActiveXObject,
    isIE6 = isIE && !window.XMLHttpRequest,
    isIE8 = isIE && !!document.documentMode,
    isIE7 = isIE && !isIE6 && !isIE8;

RX.rx_gc = function () {
    if (isIE) {
        setTimeout(CollectGarbage, 1);
    }
};
/*************设置cookie的方法***********
 * @param c_name cookie的名字
 * @param value cookie的值
 * @param expiredays
 **************************************/
RX.setCookie = function (c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
};

/*************获取cookie的方法****************
 * @param c_name
 * @returns {string}
 *******************************************/
RX.getCookie = function (c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return "";
};
/**************采用正则表达式获取地址栏参数**********
 * @param name
 * @returns {null}
 * @constructor
 ***********************************************/
RX.GetQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};

/********采用正则表达式获取父页面地址栏参数******
 *
 * @param name
 * @returns {null}
 * @constructor
 *********************************/
function GetParentQueryString(name) {
    if (name) {
        var query = window.location.search;
        if (query.indexOf("&") > -1) {
            query = query.substr(query.indexOf('&') + 1, query.length);
            if (query != null) return unescape(query);
        }
        return null;
    } else {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = document.referrer.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
}

/******************控制台打印********************
 *
 * @param content
 * @constructor
 */
RX.RXLog = function (content) {
    if (window.console && window.console.log) {
        console.log(content);
    }
};
/*************停止冒泡事件****************
 *
 * @param e
 ****************************************/
RX.stopBubble = function (e) {
    // 如果传入了事件对象，那么就是非ie浏览器
    if (e && e.stopPropagation) {
        //因此它支持W3C的stopPropagation()方法
        e.stopPropagation();
    } else {
        //否则我们使用ie的方法来取消事件冒泡
        window.event.cancelBubble = true;
    }
};
/***载入中提示关闭**********
 ***********************/
RX.closeLoading = function () {
    $("#loadingGif").remove();
};
/**************获取文件的大小***************
 * @param byteNum
 * @returns {string}
 *****************************************/
RX.getFileSize = function (byteNum) {
    var byteFloat = parseFloat(byteNum);
    if (byteFloat / 1024 <= 1) {
        return byteFloat + "B";
    } else {
        byteFloat = (byteFloat / 1024).toFixed(2);
    }
    if (byteFloat / 1024 <= 1) {
        return byteFloat + "K";
    } else {
        byteFloat = (byteFloat / 1024).toFixed(2);
    }
    if (byteFloat / 1024 <= 1) {
        return byteFloat + "M";
    } else {
        byteFloat = (byteFloat / 1024).toFixed(2);
    }
    return byteFloat + "G";
};
(function (global) {
    /**************************************
     *   重写jQuery的 ajax、get、post方法
     **************************************/
    /**重写jquery的ajax方法*/
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
                //错误方法增强处理
                fn.error(XMLHttpRequest, textStatus, errorThrown);
            },
            success: function (data, textStatus) {
                //成功回调方法增强处理
                if (data === "session timeout") {
                    _top.location.href = document.location.origin + "/" + RX.ctxPath + "/login";
                    return;
                } else if (data === "ajax notfound") {
                    RXLog(data + " :" + turl);
                    return;
                }
                fn.success(data, textStatus);
            }
        });
        _ajax(_opt);
    };

    /**重写jquery的post方法*/
    var _post = $.post;
    $.post = function (url, data, success, error) {
        //备份opt中error和success方法
        url = RX.handlePath(url);
        var tSuccess = function (data, textStatus, jqXHR) {
            //成功回调方法增强处理
            if (data === "session timeout") {
                _top.location.href = document.location.origin + "/" + RX.ctxPath + "/login";
                return;
            } else if (data === "ajax notfound") {
                RXLog(data + " :" + turl);
                return;
            }
            if (success) {
                success(data, textStatus, jqXHR);
            }
        };
        _post(url, data, tSuccess, error);
    };

    /**重写jquery的get方法*/
    var _get = $.get;
    $.get = function (url, data, success, error) {
        //备份opt中error和success方法
        url = RX.handlePath(url);
        var tSuccess = function (data, textStatus, jqXHR) {
            //成功回调方法增强处理
            if (data === "session timeout") {
                _top.location.href = document.location.origin + "/" + RX.ctxPath + "/login";
                return;
            } else if (data === "ajax notfound") {
                RXLog(data + " :" + turl);
                return;
            }
            if (success) {
                success(data, textStatus, jqXHR);
            }
        };
        _get(url, data, tSuccess, error);
    };
    /**全局的关闭事件*/
    $("#close").click(function () {
        closeWin();
    })
}(this));




