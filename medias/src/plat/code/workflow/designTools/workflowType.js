//新增
var XzState = {
    ModelWfType: {
        state: {}
    }
};
var XgState = {
    ModelWfType: {
        state: {
            disable: ["parentName"]
        }
    }
};


//model渲染方案配置
var ModelWfTypeJson = {
    ModelWfType: {
        id: {display: false}, //主键
        name: {        //字典名称
            rules: {checkSave: ["notNull"]},
            maxLength: 20
        },
        parentName: {
            maxLength: 20
        },
        parentId: {
            maxLength: 20
        },
        description: {      //描述
            maxLength: 100
        },
        sfyx_st: {          //是否有效
            defaultValue: "VALID"
        }
    }
};

var modelWfType;
var type = GetQueryString("type");
var nodeId = GetQueryString("nodeId");
var nodeName = decode(GetQueryString("nodeName"));
$(function () {
    //异步提示注册
    pageAjax();
    //初始化表单尺寸
    resizeForm();
    var state;
    if (type === "xz") {
        $(".w_button_box").show();
        state = XzState;
    } else if (type === "xg") {
        $(".w_button_box").show();
        state = XgState;
    }
    ModelWfType = DetailModel.extend({
        className: "ModelWfType",   //model类名，是model类型的唯一标识
        initJson: ModelWfTypeJson,        //配置json
        stateJson: state,           //状态json
        state: type
    });

    //获取初值
    if (type === "xg" && nodeId) {
        $.ajax({
            type: "get",
            url: "/workflow/designTools/getWorkflowType?id=" + nodeId + "&random=" + Math.random(),
            async: false,
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
        if (modelWfType.ruleValidate()) {  //
            $.ajax({
                type: "post",
                url: "/workflow/designTools/saveWorkflowType",
                data: {workflowType: modelWfType.getJson()},
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        rxMsg("保存成功");
                        getPrevWin().reloadWfTree();
                        closeWin();
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        }
    });
});

function renderForm(data) {
    modelWfType = new ModelWfType(data);
    modelWfType.render();
    if (!data) {
        modelWfType.setValue("parentId", nodeId);
        modelWfType.setValue("parentName", nodeName);
        $.getEle("ModelWfType", "parentName").attr("disabled", true);
    }
}