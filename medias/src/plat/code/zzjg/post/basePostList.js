var modelPostList;   //岗位列表对象
var mainTree;    //机构树对象
$(function () {
    //打开加载中标志
    pageAjax();
    //初始化尺寸
    resizeTable();
    //实例化岗位列表
    modelPostList = new BaseGridModel(ModelBasePostList_Propertys);
    //隐藏搜索区
    toggleSearchView($(".query_box"), $(".downSearch"));
    //岗位列表对象搜索面板生成
    modelPostList.buildSearchView();
    //设置双击事件
    modelPostList.set("onRowDblClick", onRowDblClick);
    //渲染列表
    modelPostList.render();
    //新增
    $("#add").click(function () {
        openStack(window, "增加基础岗位", "medium", "post/basePostEdit?type=xz");
    });
    //修改
    $("#edit").click(function () {
        var row = modelPostList.getSelect();
        if (row.length > 0) {
            openStack(window, "修改岗位", "medium", "/post/basePostEdit?type=xg&id=" + row[0].ID);
        } else {
            rxMsg(RxMsgType.WARNNING,"请选择一条待修改的数据");
        }
    });
    //删除
    $("#del").click(function () {
        var obj = modelPostList.getSelect();//获取选中行的数据
        if (obj == null || obj == undefined || obj[0] == null) {
            rxMsg(RxMsgType.WARNNING,"请选择一条待删除的数据");
            return false;
        } else {
            layer.confirm("确定删除该基础岗位？", function () {
                $.ajax({
                    type: "post",
                    url: "/basePost/delBasePost",
                    data: {basePostId: obj[0].ID},
                    dataType: "json",
                    success: function (ar) {
                        if(ar.success){
                            rxMsg("删除成功");
                            reloadTable();
                        }else {
                            rxMsg(RxMsgType.WARNNING,ar.msg);
                        }

                    }
                });
            })
        }
    });

});

//双击事件
function onRowDblClick(rowIndex, rowData, isSelected, event) {
    openStack(window, "查看岗位", "medium", "/post/basePostEdit?type=ck&id=" + rowData.ID);
}

//刷新全局接口
function reloadTable(param) {
    if (param) {
        modelPostList.set("postData", param);
    }
    modelPostList.reloadGrid(param);
}


