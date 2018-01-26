var modelResourceList;         //资源列表对象
var func = GetQueryString("func");
$(function () {
    //异步提示注册
    pageAjax();
    //初始化尺寸
    resizeTable();
    //列表模型
    modelResourceList = new BaseGridModel(ModelResourceList_Propertys);
    //设置列表搜索区
    modelResourceList.buildSearchView();
    //设置双击事件
    if (!modelResourceList.get("mulchose")) {
        modelResourceList.set("onRowDblClick", function onRowDblClick(rowIndex, rowData, isSelected, event) {
            selectItem();
        });
    }
    //渲染列表
    modelResourceList.render();
    //确认
    $("#save").click(function () {
        selectItem();
    });
});


function selectItem() {
    var obj = modelResourceList.getSelect();//获取选中行的数据
    if (obj == null || obj.length != 1) {
        layer.alert("请选一条数据");
    } else {
        var evalFunc = eval("getPrevWin()." + func);
        result = evalFunc(obj[0].ID, obj[0].NAME, obj[0].CODE);
        if (result || typeof(result) == "undefined") {
            closeWin();
        }
    }
}