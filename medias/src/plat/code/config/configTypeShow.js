$(function () {
    //异步提示注册
    pageAjax();
    //初始化尺寸
    resizeTable();

    $("#listShow").click(function () {
        gotoLocation("/config/configList");
    });
    //新增
    $("#add").unbind("click").click(function () {
        openStack(window, "新增配置", "medium", "/config/configEdit?type=xz");
    });
});

function editConfig(id){
    openStack(window, "修改配置", "medium", "/config/configEdit?type=xg&id=" + id);
}

function delConfig(id){
    layer.confirm("确定要删除所选记录吗？", function (index) {
        layer.close(index);
        $.ajax({
            type: "post",
            url: "/config/delConfig",
            data: {id: id},
            async: false,
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
}

function reloadTable(){
    gotoLocation("/config/configTypeShow");
}
