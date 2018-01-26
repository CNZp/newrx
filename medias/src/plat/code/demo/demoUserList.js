var modelDemoList;
$(function () {
    //打开加载中标志
    pageAjax();
    //初始化尺寸
    resizeTable();
    //初始化按钮
    buttons = RX.button.init($("#operate"), buttonsJson);
    //实例化用户列表
    modelDemoList = new BaseGridModel(ModelDemoList_Propertys);
    //搜索面板收缩
    toggleSearchView($(".query_box"), $(".downSearch"));
    // 用户列表对象搜索面板生成
    modelDemoList.buildSearchView();
    //设置单击事件
    modelDemoList.set("onRowClick", onRowClick);
    //设置双击事件
    modelDemoList.set("onRowDblClick", onRowDblClick);

    //渲染列表
    modelDemoList.render();

});

/***********************************************************
 * ****************新增事件**********************************
 * *********************************************************/
function add() {
    openStack(window, "新增示例用户", "medium", "/demo/demoUserEdit?type=xz&city=" + encode('上海'));

}

/***********************************************************
 * ****************编辑事件**********************************
 * *********************************************************/
function edit() {
    var rowData = modelDemoList.getSelect();
    if (rowData.length == 1) {
        openStack(window, "修改示例用户", "medium", "/demo/demoUserEdit?id=" + rowData[0].ID + "&type=xg");
    } else {
        layer.alert("请选择一条数据进行修改");
    }
}

/************************************************************
 *******************删除事件(多行)****************************
 *************************************************************/
function del() {
    var rowData = modelDemoList.getSelect();
    if (rowData == null || rowData == undefined || rowData[0] == null) {
        layer.alert("请选择一条待删除的数据");
    } else {
        var ids = '';
        $.each(rowData, function (i, item) {
            ids += item.ID + ",";
        })
        layer.confirm("确定要删除所选记录吗？", function (index) {
            $.ajax({
                type: "get",
                url: "/demoUser/deleteBatch?ids=" + ids,
                async: false,
                success: function (ar) {
                    if (ar.success) {
                         rxMsg("删除成功");
                        layer.close(index);
                        reloadTable();
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        });
    }
}

//双击事件
function onRowDblClick(rowIndex, rowData, isSelected, event) {
    modelDemoList.showSearchView();
    openStack(window, "查看用户", "medium", "/demo/demoUserEdit?type=ck&id=" + rowData.ID);
}

//单击事件
function onRowClick(rowIndex, rowData, isSelected, event) {

}

//刷新全局接口
function reloadTable(param) {
    if (param) {
        modelDemoList.set("postData", param);
    }
    modelDemoList.reloadGrid();
}
