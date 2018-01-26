var type = GetQueryString("type");
var func = GetQueryString("func");
var modelName = GetQueryString("modelName");
var ruleType = GetQueryString("ruleType");
var modelAuthRule;          //规则权限对象
$(function () {
    //初始化尺寸
    resizeForm();
    var stateJson;
    if (type == "xz") {
        $(".w_button_box").show();
        stateJson = xzStateJson;
    } else if (type == "xg") {
        $(".w_button_box").show();
        stateJson = xgStateJson;
    } else if (type == "ck") {
        stateJson = ckStateJson;

    }

    var ModelRule = DetailModel.extend({
        className: "ModelRule",
        initJson: ModelRuleJson,
        stateJson: stateJson
    });

    var ModelAuthRule = DetailModel.extend({
        className: "ModelAuthRule",
        initJson: ModelRuleJson,
        stateJson: stateJson,
        state: type,
        relations: [
            {
                type: Backbone.HasOne,
                key: 'sysBaseRule',
                relatedModel: ModelRule
            }
        ]
    });
    var id = GetQueryString("id");
    var authRule;
    if (id) {
        $.ajax({
            type: "post",
            url: "/rule/getAuthRuleById",
            data: {authRuleId: id},
            async: false,
            success: function (ar) {
                if (ar.success) {
                    authRule = eval(ar.data);
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    }
    modelAuthRule = new ModelAuthRule(authRule);

    if (authRule) {
        changeExplain(authRule.sysBaseRule.sxfs);
        // changeGzlx(null, authRule.gzlx);
    } else {
        changeExplain();
    }
    modelAuthRule.render();
    $("#save").click(function () {
        var variableJson;
        // var ruleTYpe = $.getEle("ModelAuthRule", "gzlx").val();
        // if (ruleTYpe == 1) {
        //     variableJson = {
        //         ModelAuthRule: ["gzlx", "qxlx", "pageNames", "objectName"],
        //         ModelRule: ["rule_detail", "rule_name", "sxfs"]
        //     };
        // } else {
        //     variableJson = {ModelAuthRule: ["gzlx"], ModelRule: ["rule_detail", "rule_name", "sxfs"]};
        // }
            variableJson = {ModelRule: ["rule_detail", "rule_name", "sxfs"]};
        if (modelAuthRule.ruleValidate(variableJson)) {
            $.ajax({
                type: "post",
                url: "/rule/saveAuthRule",
                data: {sysAuthRule: modelAuthRule.getJson()},
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        if (func) {
                            var callback = eval("getPrevWin()." + func);
                            callback(modelName, ar.data, modelAuthRule.get("sysBaseRule").get("rule_name"),
                                (new Date()).getTime(), modelAuthRule.get("sysBaseRule").get("description"));
                        }
                        rxMsg("保存成功");
                        reloadPrevWin();
                        closeWin();
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        }
    });
});

//选择关联对象回调函数
function objectSelectCallback(id, name) {
    $.getEle("ModelAuthRule", "objectId").val(id);
    $.getEle("ModelAuthRule", "objectName").val(name);
}

//  选择关联对象前置函数
function checkObjectSelect() {
    var objId = $.getEle("ModelAuthRule", "objectId").val();
    return "&disId=" + objId;
}

//选择页面回调函数
function pageSelectCallback(ids, names) {
    $.getEle("ModelAuthRule", "pageIds").val(ids);
    $.getEle("ModelAuthRule", "pageNames").val(names);
}

//选择页面前置函数
function checkPageSelect() {
    var pageIds = $.getEle("ModelAuthRule", "pageIds").val();
    return "&ids=" + pageIds;
}

//取消
function cancelCheck() {
    if (modelAuthRule.changeValidate()) {
        layer.confirm("页面已修改，确认关闭吗", function (index) {
            layer.close(index);
            closeWin();
        });
        return false;
    }
    return true;
}

function changeSxfs() {
    var sxfs = $.getEle("ModelRule", "sxfs").val();
    changeExplain(sxfs);
}

//实现方式不同说明不同
function changeExplain(sxfs) {
        if (sxfs == 1) {
            // if (gzlx == 1) {
            //     $("#xxsm").html("数据权限规则在sql加入:user_id占位符(代表角色中关联用户)，通过sql获取用户关联的业务对象主键。\n" +
            //         "如：\"select id from sys_object where user_id = :user_id\"，代表选择sys_object表中和占位符用户关联的对象主键。");
            // } else if (gzlx == 2) {
            //     $("#xxsm").html("动态规则在sql中加入:data_id占位符（代表传入业务参数），通过sql获取业务参数对应的用户id。\n" +
            //         "如：\"select id from sys_object where id = :data_id\"，代表选择sys_object表中和数据参数关联的用户id。");
            // }
            $("#xxsm").html("动态规则在sql中加入:data_id占位符（代表传入业务参数），通过sql获取业务参数对应的用户id。\n" +
                    "如：\"select id from sys_object where id = :data_id\"，代表选择sys_object表中和数据参数关联的用户id。");
        } else if (sxfs == 2) {
            // if (gzlx == 1) {
            //     $("#xxsm").html("数据权限规则在细节中录入使用的存储过程名，无需录入参数。");
            // } else if (gzlx == 2) {
            //     $("#xxsm").html("动态规则在细节中录入使用的存储过程名，无需录入参数，若动态规则被工作流使用，则存储过程传入流程实例id。");
            // }
            $("#xxsm").html("动态规则在细节中录入使用的存储过程名，无需录入参数，若动态规则被工作流使用，则存储过程传入流程实例id。");
        } else if (sxfs == 3) {
            $("#xxsm").html("JAVA方式暂不支持");
        } else if (sxfs == 4) {
            $("#xxsm").html("其他方式待开发");
        } else {
            $("#xxsm").html("请选择实现方式");
        }
}

// //规则类型不同显示的页面不同
// function changeGzlx(model, data) {
//     var gzlx;
//     if (data) {
//         gzlx = data;
//     } else {
//         gzlx = $.getEle("ModelAuthRule", "gzlx").val();
//         var sxfs = $.getEle("ModelRule", "sxfs").val();
//         changeExplain(sxfs, gzlx);
//     }
//     if (gzlx == 1) {
//         $(".dataRule").show();
//     } else {
//         $(".dataRule").hide();
//     }
// }


