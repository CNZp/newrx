var msgId = GetQueryString("msgId"); //消息ID
var message = winData(window, "param"); //消息列表传来的消息信息
$(function () {
    //异步提示注册
    pageAjax();
    renderForm(message);
    //办理
    $(".p_button_box").bind("click", "#handle", function () {
        if (message.SKIP_TYPE == "1") {
            closeWin();
            openStack(window, "消息查看", eval(message.WIN_SIZE), message.SKIP_PATH);
        } else if (message.SKIP_TYPE == "2") {
            getPrevWin().gotoLocation(message.SKIP_PATH, "top");
            closeWin();
        } else {
        }
    });
});

function renderForm(data) {
    $("#msgTitle").html(data.TITLE);
    $("#msgTitle").after("<div class=\"time\"><span>紧急程度:" + data.URGENT_LEVEL + "</span> <span>发送人:默默</span><span>消息类型:" + (data.TYPE_NAME?data.TYPE_NAEM:"无") + "</span> <span>" + data.RECEIVE_TIME + "</span></div>")
    $(".new-content").html(data.CONTENT);
    if (data.SKIP_PATH) {
        if (data.OPERATE_TYPE == '1') {
            $(".p_button_box").append("<input type=\"button\" id=\"handle\" value=\"前去办理\" class=\"n_button\"/>");
        } else if (data.OPERATE_TYPE == '2') {
            $(".p_button_box").append("<input type=\"button\" id=\"handle\" value=\"前去查看\" class=\"n_button\"/>");
        }
    }
}








