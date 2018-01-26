var modelTeacher;
//param中包括前后端所有参数
//param.buildParam是从工作流接口（confirmWorkflowStart、handleWorkflowByWiId）传递来的参数
//param中其他参数是从后端返回的参数
var param = _top.winData(window);   //工作流相关参数
//从url获取业务数据ID
// var id = GetQueryString("id");
//从param中获取业务数据ID
var id = param.ywDataId;
$(function () {
    pageAjax();
    resizeForm();
    //从url获取参数个性参数
    var type = GetQueryString("type");
    //从param.buildParam获取参数个性参数
    var type = param.buildParam.type;
    var stateJson = ckStateJson;
    if (type === "xz") {
        stateJson = xzStateJson;
    }
    //前端模型
    var ModelTeacher = DetailModel.extend({
        className: "ModelTeacher",
        initJson: ModelTeacherJson,
        stateJson: stateJson
    });
    //渲染数据
    var teacher = {};
    //如果保存了草稿，以草稿数据渲染
    if (param.tmpData) {
        teacher = JSON.parse(param.tmpData);
        //如果有业务数据，则以业务数据渲染
    } else if (id) {
        $.ajax({
            type: "get",
            url: "/teacher/getTeacher?id=" + id + "&random=" + Math.random(),
            async: false,
            success: function (ar) {
                if (ar.success) {
                    teacher = ar.data;
                } else {
                    _top.layer.alert(ar.msg);
                }
            }
        });
    }
    modelTeacher = new ModelTeacher(teacher);
    modelTeacher.render();
});

//供工作流调用：提交前验证 函数名称固定
function checkSheetSubmit() {
    return modelTeacher.ruleValidate();
}

//供工作流调用：提交 函数名称固定
function sheetSubmit() {
    //返回结果为固定对象格式
    //可以包括：msg-异常提示 flg-成功标识 ywDataId-业务数据ID wfVars-流程变量名及值 wfTitle-流程实例标题
    var result = {msg: "", flg: false};
    $.ajax({
        type: "post",
        url: "/teacher/saveTeacher",
        async: false,
        data: {teacher: modelTeacher.getJson(), param: JSON.stringify(param)},
        dataType: "json",
        success: function (ar) {
            if (ar.success) {
                //成功标识
                result.flg = true;
                //业务数据ID
                result.ywDataId = ar.data.ywDataId;
                //流程变量
                result.wfVars = ar.data.wfVars;
                //流程实例标题
                result.wfTitle = ar.data.wfTitle;
                //办理之后的个性提示语
                result.msg = "办理成功，请稍等";
            } else {
                result.msg = ar.msg;
            }
        }
    });
    return result;
}

//供工作流调用：保存草稿 函数名称固定
function saveDraft() {
    return modelTeacher.getAllJson();
}

//供工作流调用：删除业务数据 函数名称固定
function sheetDelete() {
    //返回结果为固定对象格式
    //可以包括：msg-异常提示 flg-成功标识
    var result = {msg: "", flg: false};
    if (id) {
        $.ajax({
            type: "post",
            url: "/teacher/delTeacher",
            async: false,
            data: {id: id},
            dataType: "json",
            success: function (ar) {
                if (ar.success) {
                    result.flg = true;
                } else {
                    result.msg = ar.msg;
                }
            }
        });
    } else {
        result.flag = true;
    }
    return result;
}