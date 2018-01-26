var messageList; //传index就行了
$(function () {
    $.ajax({
        url: "/message/getMessageList",
        async: false,
        success: function (ar) {
            if (ar.data.length > 0) {
                messageList = ar.data;
                $.each(messageList, function (i, t) {
                    $("#msg").append("<li><i class=\"iconfont\">&#xe612;</i><a href='javascript:void(0)' onclick='goMessage(" + i + ")'>" + "[" + t.TITLE + "]" + t.CONTENT + "</a><span>" + t.RECEIVE_TIME + "</span></li>");
                })
            } else {
                $("#msg").prepend(" <p>暂无最新消息</p>")
            }
        }
    });
//更多
    $("#more").click(function () {
        window.location.href = RX.handlePath("/message/messageList");
    })
});

//弹窗信息
function goMessage(i) {
    openStack(window, messageList[i].TYPE_NAME, "medium", "/message/messageView", messageList[i]);
    readMeg(i);
}


//阅读信息
function readMeg(t) {
    var msgId = messageList[t].MSG_ID;
    $.ajax({
        url: "/message/readMessage?messageId=" + msgId,
        success: function () {
            window.location.reload();
        }
    })
}