var messageList; //传index就行了
$(function () {
    $.ajax({
        url: "/messageType/getMessageTypeList",
        success: function (ar) {
            if (ar.success) {
                var $homePage = $(".homepage");
                $.each(ar.data, function (i, t) {
                    $homePage.append(RX.tpl("messageBox",t));
                })
                $.ajax({
                    url: "/message/getMessageList",
                    async: false,
                    success: function (ar) {
                        if (ar.success) {
                            messageList = ar.data;
                            $.each(messageList, function (i, t) {
                                $("#"+t.TYPE_CODE+"MsgUl").append(RX.tpl("messageLi",{index:i,t:t}));
                            })
                            $(".coat").each(function(i,ul){
                                if($(ul).find("li").length == 0){
                                    $(ul).prepend(" <p>暂无最新消息</p>");
                                }
                            })
                        }else {
                            layer.alert(ar.msg);
                        }
                    }
                });
            } else {
                layer.alert(ar.msg);
            }
        }
    });

    //更多
    $(".readmore").click(function () {
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