/*******************************************
 *
 * Plug-in:友好的页面加载效果
 * Author:sqinyang (sqinyang@sina.com)
 * Time:2015/04/20
 * Explanation:随着HTML5的流行，页面效果越来越炫，同时也需要加载大量的插件及素材，万恶的网速，特别对于挂在国外服务器的网站，一打开一堆素材缓缓加载，位置错乱不齐，故编写此方法，方便大家使用
 *
 *********************************************/

jQuery.MyCommon = {
    PageLoading: function (options) {
        var defaults = {
            opacity: 1,
            //loading页面透明度
            backgroundColor: "#fff",
            //loading页面背景色
            borderColor: "#bbb",
            //提示边框颜色
            borderWidth: 1,
            //提示边框宽度
            borderStyle: "solid",
            //提示边框样式
            loadingTips: "页面加载中，请稍候&nbsp;&nbsp;&nbsp;&nbsp;",
            //提示文本
            TipsColor: "#666",
            //提示颜色
            delayTime: 300,
            //页面加载完成后，加载页面渐出速度
            zindex: 1000,
            //loading页面层次
            sleep: 0,
            //设置挂起,等于0时则无需挂起
            isAutoClose: true
            //是否自动关闭,
        };
        //防止触发两次
        if($("#loadingPage").length > 0){
            return;
        }
        //页面是已近完成状态
        var options = $.extend(defaults, options);
        //获取页面宽高
        var _PageHeight = document.documentElement.clientHeight,
            _PageWidth = document.documentElement.clientWidth;
        //在页面未加载完毕之前显示的loading Html自定义内容
        var _LoadingHtml = '<div id="loadingPage" style="position:fixed;left:0;top:0;_position: absolute;width:100%;height:' + _PageHeight + 'px;background:' + options.backgroundColor + ';opacity:' + options.opacity + ';filter:alpha(opacity=' + options.opacity * 100 + ');z-index:' + options.zindex + ';">' +
            '<div id="loadingTips" style="z-index:100;position: absolute; cursor1: wait; width: auto;border-color:' + options.borderColor + ';border-style:' + options.borderStyle + ';border-width:' + options.borderWidth + 'px; height:80px; line-height:80px; padding-left:80px; padding-right: 5px;border-radius:10px;  background: ' + options.backgroundColor + ' url(/' + RX.ctxPath + '/medias/plugin/perfectLoad/loading.gif) no-repeat 5px center; color:' + options.TipsColor + ';font-size:20px;">' + options.loadingTips + '</div></div>';
        //呈现loading效果
        $("body").append(_LoadingHtml);
        $("#loadingPage").bgiframe({opacity:false});
        //获取loading提示框宽高
        var _LoadingTipsH = document.getElementById("loadingTips").clientHeight,
            _LoadingTipsW = document.getElementById("loadingTips").clientWidth;

        //计算距离，让loading提示框保持在屏幕上下左右居中
        var _LoadingTop = _PageHeight > _LoadingTipsH ? (_PageHeight - _LoadingTipsH) / 2 : 0,
            _LoadingLeft = _PageWidth > _LoadingTipsW ? (_PageWidth - _LoadingTipsW) / 2 : 0;
        $("#loadingTips").css({
            "left": _LoadingLeft + "px",
            "top": _LoadingTop + "px"
        });
        if (document.readyState === "complete"){
                setTimeout(function(){
                    $.MyCommon.hideLoading(options);
                },2);
        }
        if(options.isAutoClose){
            //监听页面加载状态
            document.onreadystatechange = PageLoaded;
        }

        //当页面加载完成后执行
        function PageLoaded() {
            if (document.readyState == "complete") {
                $.MyCommon.hideLoading(options);
            }
        }
    },
    hideLoading: function (option) {
        var options = $.extend(true, {delayTime: 100, sleep: 0}, option);
        var loadingMask = $('#loadingPage');
        setTimeout(function () {
                loadingMask.animate(isIE6 ? {"filter": "Alpha(opacity=0)"} : {"opacity": 0},
                    options.delayTime,
                    function () {
                        isIE6 && removeIframe($(this).find(".bgiframe")[0]);
                        $(this).remove();
                    });
            },
            options.sleep);
    }
};