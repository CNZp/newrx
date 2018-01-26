var ModelMessage;
var modelMessage;          //消息类型
var type = GetQueryString("type");
$(function () {
    //异步提示注册
    pageAjax();
    //初始化尺寸
    resizeForm();
    var stateJson;
    if (type === "xz") {
        stateJson = xzStateJson;
    } else if (type === "xg") {
        stateJson = xgStateJson;

    } else if (type === "ck") {
        stateJson = ckStateJson;
        $(".w_button_box").hide();
    }
    ModelMessage = DetailModel.extend({
        className: "ModelMessage",
        initJson: ModelMessageJson,
        stateJson: stateJson
    });
    var id = GetQueryString("id");
    if (id) {
        $.ajax({
            type: "get",
            url: "/messageType/getMessageTypeById?id=" + id + "&r=" + Math.random(),
            success: function (ar) {
                if (ar.success) {
                    renderForm(ar.data);
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    } else {
        renderForm();
    }
//消息的发送
    $("#send").click(function () {
        if (modelMessage.ruleValidate()) {
            $.ajax({
                type: "post",
                url: "/message/generateMessage",
                data: {message: modelMessage.getJson()},
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        reloadPrevWin();
                        closeWin();
                        rxMsg("发送成功");
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        }
    });
});

function renderForm(data) {
    modelMessage = new ModelMessage(data);
    modelMessage.render();
}

function getMessageType() {
    var result = new Array();
    $.ajax({
        url: "/messageType/getMessageTypeList",
        type: "post",
        async: false,
        success: function (ar) {
            $.each(ar.data, function (i, t) {
                result.push({"value": t.NAME, "code": t.CODE})
            })
        }
    });
    return result;
}

function sendUserSelect(modelName, ids, names) {
    modelMessage.setValue('sendUser', names);
    modelMessage.setValue("sendUserIds",ids);
}



