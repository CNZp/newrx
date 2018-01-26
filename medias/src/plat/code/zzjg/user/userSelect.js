var func = GetQueryString("func");            //回调函数
var modelName = GetQueryString("modelName");
var tcUserList;                         //用户列表对象
$(function () {
    //初始化尺寸
    resizeForm();
    //管理人员列表模型，继承BaseGridModel
    tcUserList = new BaseGridModel(TcUserList_Propertys);
    //用户列表对象搜索面板生成
    tcUserList.buildSearchView();
    //设置双击事件
    tcUserList.set("onRowDblClick", function () {
        selectItem()
    });
    //渲染列表
    tcUserList.render();
    //确认
    $("#confirm").click(function () {
        selectItem();
    });
});

//刷新全局接口
function reloadTable(param) {
    tcUserList.reloadGrid(param);
}

function selectItem() {
    var obj = tcUserList.getSelect();//获取选中行的数据
    if (obj == null || obj == undefined || obj[0] == null) {
        rxMsg(RxMsgType.WARNNING,"请选择一条数据");
    } else {
        var evalFunc = eval("_top.getPrevWin()." + func);
        result = evalFunc(obj[0].ID, obj[0].USER_NAME, modelName);
        if (result || typeof(result) == "undefined") {
            _top.closeLayer(window);
        }
    }
}

