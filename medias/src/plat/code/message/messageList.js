var modelMessageList;         //消息类型列表对象
$(function () {
    //异步提示注册
    pageAjax();
    //初始化尺寸
    resizeTable();
    //列表模型
    modelMessageList = new BaseGridModel(ModelMessageList_Propertys);
    //设置列表搜索区
    modelMessageList.buildSearchView();
    //设置双击事件
    if (!modelMessageList.get("mulchose")) {
        modelMessageList.set("onRowDblClick", function onRowDblClick(rowIndex, rowData, isSelected, event) {
            openStack(window, rowData.TYPE_NAME, "medium", "/message/messageView", rowData);
            readMeg(rowData.MSG_ID);
        });
    }
    //渲染列表
    modelMessageList.render();

    $("#back").click(function () {
        window.history.back(-1);
    })
});

//列表刷新全局接口
function reloadTable(param) {
    modelMessageList.reloadGrid(param);
}

//阅读信息
function readMeg(msgId) {
    $.ajax({
        url: "/message/readMessage?messageId=" + msgId,
        success: function () {
            reloadTable();
        }
    })
}




