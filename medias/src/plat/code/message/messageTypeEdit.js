var ModelMessageType;
var modelMessageType;          //消息类型
var type = GetQueryString("type");
$(function () {
    //异步提示注册
    pageAjax();
    //初始化尺寸
    resizeForm();
    var stateJson;
    if (type === "xz") {
        $(".w_button_box").show();
        stateJson = xzStateJson;
    } else if (type === "xg") {
        $(".w_button_box").show();
        stateJson = xgStateJson;

    } else if (type === "ck") {
        stateJson = ckStateJson;

    }
    ModelMessageType = DetailModel.extend({
        className: "ModelMessageType",
        initJson: ModelMessageTypeJson,
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

    $("#save").click(function () {
        if (modelMessageType.ruleValidate()) {
            $.ajax({
                type: "post",
                url: "/messageType/saveMessageType",
                data: {messageType: modelMessageType.getJson()},
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        reloadPrevWin();
                        closeWin();
                        rxMsg("保存成功");
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        }
    });
});

function renderForm(data) {
    var st = (data && data.skipType) || null;
    if (st == 1) {
        $(".skipPath").show();
        $(".win_size").show();
    } else if (st == 2) {
        $(".skipPath").show();
        $(".win_size").hide();
    } else {
        $(".skipPath").hide();
        $(".win_size").hide();
    }
    modelMessageType = new ModelMessageType(data);
    modelMessageType.render();
}

//关闭页面
// function cancelCheck() {
//     if (modelMessageType.changeValidate()) {
//         layer.confirm("页面已修改，确认关闭吗", function (index) {
//             layer.close(index);
//             closeWin();
//         });
//         return false;
//     }
//     return true;
// }

function SkipTypeChange(t) {
    var st = $.getEle(t.get("ModelName"), "skipType").val();
    if (st == 1) {
        $(".skipPath").show();
        $(".win_size").show();
    } else if (st == 2) {
        $(".skipPath").show();
        $(".win_size").hide();
    } else {
        $(".skipPath").hide();
        $(".win_size").hide();
    }
}



