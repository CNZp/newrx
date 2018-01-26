var modelRuleList;
var func = GetQueryString("func");
var modelName = GetQueryString("modelName");
var ids = GetQueryString("ids");
$(function () {
    //初始化尺寸
    resizeForm();
    //设置默认值
    //列表模型
    modelRuleList = new BaseGridModel(ModelRuleList_Propertys);
    //设置过滤项
    modelRuleList.set("dischose", true);
    modelRuleList.set("disObject", {id: eval("[" + ids + "]")});
    modelRuleList.buildSearchView();
    //设置双击事件
    modelRuleList.set("onRowDblClick", onRowDblClick);
    //渲染列表
    modelRuleList.render();
    $("#confirm").click(function () {
        selectItem();
    });
});

function selectItem() {
    var sel = modelRuleList.getSelect();
    if (sel.length > 0) {
        var evalFunc = eval("getPrevWin()." + func);
        result = evalFunc(modelName, sel[0].ID, sel[0].RULE_NAME, sel[0].XGSJ, sel[0].DESCRIPTION);
        if (result || typeof(result) == "undefined") {
            closeWin();
        }
    } else {
        rxMsg(RxMsgType.WARNNING,"请选择一条数据");
    }
}

function onRowDblClick(rowIndex, rowData, isSelected, event) {
    selectItem();
}

