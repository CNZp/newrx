var modelRoleList;       //角色列表对象
$(function () {
    pageAjax();
    //初始化尺寸
    resizeTable();
    //角色列表对象创建
    modelRoleList = new BaseGridModel(ModelRoleList_Propertys);
    //用户列表对象搜索面板生成
    modelRoleList.buildSearchView();
    //设置双击事件
    modelRoleList.set("onRowDblClick", onRowDblClick);
    //渲染列表
    modelRoleList.render();

    RX.button.init($("#operBtns"),buttonsJson);
    toggleSearchView($(".query_box"), $(".downSearch"));
});

//双击事件函数
function onRowDblClick(rowIndex, rowData, isSelected, event) {
    openStack(window, "查看角色", "medium", "/role/roleEdit?type=ck&id=" + rowData.ID);
}

//列表刷新全局接口
function reloadTable(param) {
    if (param == null) {
        modelRoleList.set("postData", null);
    }
    modelRoleList.reloadGrid(param);
}

//关联要素回调函数
function glysSelectCallback(modelName, glys, gl_id, glType) {
    var gl_type;
    if (glType == "jg") {
        gl_type = 2;
    } else if (glType == "gw") {
        gl_type = 1;
    } else {
        gl_type = 3;
    }
    modelRoleList.getSearchModel().setValue("glys", glys);             //为搜索项赋值
    modelRoleList.getSearchModel().setValue("gl_id", gl_id);
    modelRoleList.getSearchModel().setValue("glType", gl_type);
}

function add(){
    var url = "/role/roleEdit?type=xz";
    openStack(window, "新增角色", "medium", url);
}

function editRow(id){
    var url = "/role/roleEdit?type=xg&id=" + id;
    openStack(window, "修改角色", "medium", url);
    stopBubble();
}

function delRow(id){
    layer.confirm("确定要删除所选记录吗？", function (index) {
        $.ajax({
            type: "post",
            url: "/role/deleteRole?id=" + id,
            async: false,
            success: function (ar) {
                if (ar.success) {
                    reloadTable();
                    rxMsg(RxMsgType.SUCCESS,"删除成功");
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
        layer.close(index);
    });
    stopBubble();
}

function resourceRow(id){
    openStack(window, "设置角色资源", "tree",  "/resource/roleResourceTreeSelect?roleId=" + id);
    stopBubble();
}