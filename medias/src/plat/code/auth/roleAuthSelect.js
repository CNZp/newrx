var func = GetQueryString("func");
var roleId = GetQueryString("roleId");
var modelRoleList;
$(function () {
    //初始化尺寸
    resizeForm();
    //注册请求中msg
    pageAjax();
    //实例列表对象
    modelRoleList = new BaseGridModel(ModelRoleList_Propertys);
    //设置双击事件
    modelRoleList.set("onRowDblClick", onRowDblClick);
    //设置过滤项
    modelRoleList.set("dischose", true);
    modelRoleList.set("disObject", {id: eval("[" + roleId + "]")});
    //渲染搜索区
    modelRoleList.buildSearchView();
    //渲染列表
    modelRoleList.render();
    //保存按钮事件
    $("#confirm").click(function () {
        selectItem();
    });

});

//双击事件
function onRowDblClick(rowIndex, rowData, isSelected, event) {
    selectItem();
}

//列表刷新全局接口
function reloadTable(param) {
    if (param) {
        modelRoleList.set("postData", param);
    }
    modelRoleList.reloadGrid(param);
}

function selectItem() {
    var sel = modelRoleList.getSelect();
    if (sel.length > 0) {
        var evalFunc = eval("getPrevWin()." + func);
        result = evalFunc(sel[0].ID);
        if (result || typeof(result) == "undefined") {
            closeWin();
        }
    } else {
        layer.alert("请选择一条数据");
    }
}
