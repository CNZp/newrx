var ModelConfig; //声明配置model类
var modelConfig; //声明配置model实例
var type = GetQueryString("type");
$(function () {
    //异步提示注册
    pageAjax();
    //初始化尺寸
    resizeForm();
    //获取页面状态
    var stateJson;
    if (type === "xz") {
        $("#save").show();
        stateJson = xzStateJson;
    } else if (type === "xg") {
        $("#save").show();
        stateJson = xgStateJson;

    } else if (type === "ck") {
        stateJson = ckStateJson;
    }
    //赋值 配置model类
    ModelConfig = DetailModel.extend({
        className: "ModelConfig",
        initJson: ModelConfigJson,
        stateJson: stateJson
    });
    //配置ID
    var id = GetQueryString("id");
    if (id) {
        $.ajax({
            type: "get",
            url: "/config/getConfigById?id=" + id + "&r=" + Math.random(),
            success: function (ar) {
                if (ar.success) {
                    renderForm(ar.data);
                } else {
                    layer.msg(ar.msg);
                }
            }
        });
    } else {
        renderForm();
    }
    //新增、修改配置
    $("#save").click(function () {
        if (modelConfig.ruleValidate()) {
            $.ajax({
                type: "post",
                url: "/config/saveConfig",
                data: {config: modelConfig.getJson()},
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        reloadPrevWin();
                        closeWin();
                        layer.msg("保存成功");
                    } else {
                        layer.msg(ar.msg);
                    }
                }
            });
        }
    });
});
//渲染表单
function renderForm(data) {
    if (data && data.levels == "2") {
        $("#appTr").show();
    }
    modelConfig = new ModelConfig(data);
    modelConfig.render();
}
//配置级别change事件
function levelChange(model) {
    var level = $.getEle("ModelConfig", "levels").val();
    if (level == "2") {
        $("#appTr").show();
    } else {
        $("#appTr").hide();
    }
}
//设置所属应用回调
function selectAppCallback(id, name, code) {
    modelConfig.setValue("appId", id);
    modelConfig.setValue("appName", name);
}

//关闭页面
function cancelCheck() {
    if (modelConfig.changeValidate()) {
        layer.confirm("页面已修改，确认关闭吗", function (index) {
            layer.close(index);
            closeWin();
        });
        return false;
    }
    return true;
}


