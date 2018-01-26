var modelConfigList;         //配置列表对象
$(function () {
    //异步提示注册
    pageAjax();
    //初始化尺寸
    resizeTable();
    var buttonArr = [
        {
            id: "add",
            name: "新增",
            icon: "&#xe62a;",
            onClick: add              //可以是方法引用，也可以是方法字符串名称
        },
        {
            id: "del",
            name: "按类别展示",
            icon: "&#xe605;",
            onClick: "typeShow"
        }
    ];
    //存在默认配置
    var buttonsJson = {
        buttons: buttonArr
    };

    RX.button.init($("#text"), buttonsJson);
    //列表模型
    modelConfigList = new BaseGridModel(ModelConfigList_Propertys);

    toggleSearchView($(".query_box"), $(".downSearch"));
    //设置列表搜索区
    modelConfigList.buildSearchView();
    //设置双击事件
    if (!modelConfigList.get("mulchose")) {
        modelConfigList.set("onRowDblClick", function onRowDblClick(rowIndex, rowData, isSelected, event) {
            openStack(window, "查看配置", "medium", "/config/configEdit?type=ck&id=" + rowData.ID);
        });
    }
    //渲染列表
    modelConfigList.render();
});
function editRow(id) {
    openStack(window, "修改配置", "medium", "/config/configEdit?type=xg&id=" + id);
    stopBubble();
}

function delRow(id) {
    layer.confirm("确定要删除所选记录吗？", function (index) {
        layer.close(index);
        $.ajax({
            type: "post",
            url: "/config/delConfig",
            data: {id: id},
            success: function (ar) {
                if (ar.success) {
                    reloadTable();
                    rxMsg("删除成功");
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    });
    stopBubble();
}

//列表刷新全局接口
function reloadTable(param) {
    modelConfigList.reloadGrid(param);
}
function add() {
    openStack(window, "新增配置", "medium", "/config/configEdit?type=xz");
}

function typeShow() {
    gotoLocation("/config/configTypeShow");
}

