(function (window) {
    /**
     *  获取表单jqery元素
     * @param modelName
     * @param property
     * @param type
     */
    RX.getEle = function (modelName, property, type) {
        if (type === "layer") {
            return $("*[layer-model=" + modelName + "][link-property=" + property + "]");
        } else {
            return $("*[data-model=" + modelName + "][data-property=" + property + "]");
        }
    };

    /**
     * 隐藏表单元素
     */
    RX.hideEle = jQuery.fn.hideEle = function ($el) {
        if (!$el) {
            $el = $(this);
        }
        $el.addClass("hideElement");
        return $el;
    };
    /**
     * 隐藏表单元素与其标志td
     */
    RX.hideEleAndTag = jQuery.fn.hideEleAndTag = function ($el) {
        if (!$el) {
            $el = $(this);
        }
        $el.parent().parent().addClass("hideElement");
        $el.parent().parent().prev().addClass("hideElement");
        return $el;
    };
    /**
     * 展示禁用样式，而非span的形式
     */
    RX.showDisabledEle = jQuery.fn.showDisabledEle = function ($el) {
        if (!$el) {
            $el = $(this);
        }
        if ($el.next().hasClass("spanshow")) {
            $el.next().remove();
        }
        $el.show();
        return $el;
    };
    /**
     * 改变表单的Tag
     */
    jQuery.fn.changeTag = function (value) {
        $(this).parent().parent().prev().html(value);
        return $(this);
    };
    /**
     * 在页面上设置select选中的值
     * @param t
     * @param value
     */
    RX.setSelectVal = jQuery.fn.setSelectVal = function (value) {
        if (isIE6) {
            setTimeout(function () {
                $(t).val(value);
            }, 0);
        } else {
            $(t).val(value);
        }
    };

    /**
     * iframe跳转接口（兼容ie6性能优化）
     * @param obj
     * @param url
     */
    RX.gotoUrl = function (obj, url) {
        var el = obj[0], iframe = el.contentWindow;
        if (iframe) {
            if (iframe.closeFunc) {
                iframe.closeFunc();
            }
        }
        if (el) {
            if (isIE) {
                el.src = 'about:blank';
                try {
                    iframe.document.write('');
                    iframe.close();
                } catch (e) {
                }
            }
            el.src = RX.handlePath(url);
        }
    };
    /**
     *  展示图片
     * @param src 图片地址
     * @param title 图片标题
     * @param description 图片描述
     */
    RX.prettyPhotoShow = function (src, title, description) {
        // $.prettyPhoto.open(src);
        if ($("#_rx_pretty_frame").length == 0) {
            $("body").append("<iframe frameborder='0' id='_rx_pretty_frame' name='_rx_pretty_frame' style='position:absolute;top:0;left:0;width:100%;z-index:19999999;'></iframe>");
            $("#_rx_pretty_frame").height($(window).height());
            $(window).resize(function () {
                $("#_rx_pretty_div").height($(window).height());
            })
            var iframeElement = window.document.getElementById("_rx_pretty_frame");
            iframeElement.setAttribute('allowTransparency', 'true');
            var iframeDoc = iframeElement.contentDocument || iframeElement.contentWindow.document;
            var baseUrl = "";
            if (RX && RX.config && RX.config.defaultPath) {
                baseUrl = RX.config.defaultPath;
            }
            baseUrl = baseUrl ? "/" + baseUrl : "";
            iframeDoc.open();
            iframeDoc.write('<!DOCTYPE html><html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" /><link rel="stylesheet" type="text/css" href="' + baseUrl + '/medias/utils/prettyPhoto/prettyPhoto.css"/>' +
                '<script type="text/javascript" src="' + baseUrl + '/medias/lib/jquery-1.8.3.js"></script>' +
                '<script type="text/javascript" src="' + baseUrl + '/medias/utils/prettyPhoto/jquery.prettyPhoto.js"></script>' +
                '<script type="text/javascript" src="' + baseUrl + '/medias/utils/prettyPhoto/photoShow.js"></script>' +
                '</head><body style="background-color:transparent"><script>' +
                'window.onload = function(){$("area[rel^=\'prettyPhoto\']").prettyPhoto();' +
                'window.showPhoto = function(src){$.prettyPhoto.open(src);};' +
                'showPhoto(' + JSON.stringify(src) + ');' +
                '} </script></body></html>');
            iframeDoc.close();
        } else {
            $("#_rx_pretty_frame").show();
            window.frames["_rx_pretty_frame"].showPhoto(src);
        }
    };
    /**
     * 清除iframe
     * @param _iframe
     */
    RX.removeIframe = function (_iframe) {
        _iframe && (_iframe.contentWindow.document.write(""), _iframe.contentWindow.close(), _iframe.parentNode.removeChild(_iframe));
    };
    /**
     * 页面滚动到第一个错误位置
     */
    RX.scrollToError = function () {
        var scrollTo = $(".TextBoxErr").eq(0), container = scrollTo.find(".form_box").eq(0);
        if (container.length) {
            container.scrollTop(
                scrollTo.offset().top - container.offset().top + container.scrollTop()
            );
        }
    };
    /**
     *滚动到底
     * @param type
     */
    RX.scrollToEnd = function (type) {
        var scrollTo = $(".Boxcentont").scrollLeft();
        if (type === "next") {
            scrollTo = scrollTo + 200;
        } else {
            scrollTo = scrollTo - 200;
        }
        $(".Boxcentont").animate({scrollLeft: scrollTo}, "slow");
    };
    /**
     * 滚动到指定元素
     */
    RX.mScroll = jQuery.fn.mScroll = function ($el) {
        if (!$el) {
            $el = $(this);
        }
        $("html,body").stop(true);
        $("html,body").animate({scrollTop: $el.offset().top}, 1000);
    }
}).call(this);