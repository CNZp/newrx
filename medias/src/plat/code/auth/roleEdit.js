var modelRole;                 //角色对象
var wfTag = GetQueryString("wfTag");    //工作流跳转标志
var type = GetQueryString("type");    //标志位
var id = GetQueryString("id");    //角色id
var func = GetQueryString("func");
var roleType;
$(function () {
    //初始化尺寸
    resizeForm();
    pageAjax();
    //依据参数确定选择的状态配置
    var stateJson;
    if (type == "xz") {
        $("#save").show();
        stateJson = XzState;
    } else if (type == "xg") {
        $("#chooseOrgan").show();
        $("#save").show();
        stateJson = XzState;
        ModelRoleJson.ModelRole.roleType.disabled = true;
        ModelRoleJson.ModelRole.roleCode.disabled = true;
    } else if (type == "ck") {
        $("#chooseOrgan").show();
        stateJson = CkState;
    }
    //从工作流进入的页面，角色类型只为流程角色。
    if (wfTag == "1") {
        ModelRoleJson.ModelRole.roleType.dictConfig.pcode = 2;
        roleType = 2;
    }else {
        if(!isPlatAdmin){
            ModelRoleJson.ModelRole.roleType.dictConfig.pcode = 1;
        }
        roleType = 1;
    }

    //角色类声明
    var ModelRole = DetailModel.extend({
        className: "ModelRole",
        initJson: ModelRoleJson,
        stateJson: stateJson,
        state: type
    });

    //获取初值
    var role = {roleType:roleType};   //供初始化的角色数据对象
    if (id) {
        $.ajax({
            type: "get",
            url: "/role/getRoleById?id=" + id + "&random=" + Math.random(),
            async: false,
            success: function (ar) {
                if (ar.success) {
                    role = ar.data;
                    roleType = role.roleType;
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    }

    //依据初值创建主model实例
    modelRole = new ModelRole(role);

    changeRule(roleType);

    //角色渲染
    modelRole.render();

    //保存
    $("#save").click(function () {
        if (modelRole.ruleValidate()) {
            $.ajax({
                type: "post",
                url: "/role/saveRole",
                data: {sysRole: modelRole.getJson()},
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        id = ar.data;
                        modelRole.setValue("id", id);
                        if (wfTag == "1") { //工作流进入保存角色
                            // var func = GetQueryString("func");
                            if (func) {
                                var callback = eval("getPrevWin()." + func);
                                callback(ar.data, modelRole.get("roleName"), modelRole.get("roleCode"), modelRole.get("roleType"), null, modelRole.get("roleMade"), $("#roleMade  option:selected").text());
                            }
                        }
                        $("#chooseOrgan").show();
                        layer.confirm("保存成功，是否进行"+$("#chooseOrgan").val()+"？",
                            function (index) {
                                reloadPrevWin();
                                gotoChooseOrgan($("#chooseOrgan").val());
                                layer.close(index);
                            },
                            function (index) {
                                layer.close(index);
                                reloadPrevWin();
                                closeWin();
                            }
                        );
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        }
    });

    //关联设置
    $("#chooseOrgan").click(function () {
        gotoChooseOrgan($(this).val());
    });

});

function gotoChooseOrgan(title) {
    var roleMade = $.getEle("ModelRole", "roleMade").val();
    if (roleMade == 1) { //固定用户
        openStack(window, title, ['650px', '600px'], "/role/chooseOrgan?&type=" + type + "&roleId=" + id + "&func=chooseCallBack");
    } else if (roleMade == 2) {// 动态规则
        openStack(window, title, "medium", "/role/chooseRule?&type=" + type + "&roleId=" + id);
    } else {
        layer.alert("请先选择角色类型");
        return;
    }
}

//关联设置回调
function chooseCallBack() {
    if (func) {
        var callback = eval("getPrevWin(2)." + func);
        callback(modelRole.get("id"), modelRole.get("roleName"), modelRole.get("roleCode"), modelRole.get("roleType"), null, modelRole.get("roleMade"), $("#roleMade  option:selected").text());
    }
}

//取消
function cancelCheck() {
    // if (modelRole.changeValidate()) {
    //     layer.confirm("页面已修改，确认关闭吗", function (index) {
    //         layer.close(index);
    //         closeWin();
    //     });
    //     return false;
    // }
    return true;
}

//根据角色类型显示规则,并清空相关数据
function changeRule(roleType) {
    roleType = roleType || $.getEle("ModelRole", "roleType").val();
    if (roleType == 1 && (isPlatAdmin || type == "ck")) { //业务角色
        $("._sysrole").show();
        $("._roleMade").hide();
        modelRole.setValue("roleMade", "1");
        $("#chooseOrgan").val("角色授权");
    } else if(roleType == 2) {
        $("._sysrole").hide();
        $("._roleMade").show();
        $("#chooseOrgan").val("角色组成");
    } else {
        $("._sysrole").hide();
        $("._roleMade").hide();
        modelRole.setValue("roleMade", "1");
        $("#chooseOrgan").val("角色授权");
    }
    if(type == "ck"){
        $("#chooseOrgan").val("查看"+$("#chooseOrgan").val());
    }
}