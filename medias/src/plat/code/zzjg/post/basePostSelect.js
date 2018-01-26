var modelPostList;   //岗位列表对象
var mainTree;    //机构树对象
var type = GetQueryString("type");
var func = GetQueryString("func");
var postIds = GetQueryString("postIds");//已经选择的岗位ID
$(function () {
    //打开加载中标志
    pageAjax();
    //初始化尺寸
    resizeTable();
    if (type == "xz") {
        $(".w_button_box").show();
    } else {
        $(".operation_box").show();
    }
    //实例化岗位列表
    modelPostList = new BaseGridModel(ModelBasePostList_Propertys);
    //岗位列表对象搜索面板生成
    modelPostList.buildSearchView();
    //设置过滤项
    modelPostList.set("dischose", true);
    modelPostList.set("disObject", {id: eval("[" + postIds + "]")});
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
            $.ajax({
                type: "post",
                url: "/post/delBasePost",
                data: {id: obj[0].ID},
                dataType: "json",
                success: function (ar) {
                    rxMsg("保存成功");
                    reloadTable();
                }
            });
        }
    });

    $("#confirm").click(function () {
        var obj = modelPostList.getSelect();//获取选中行的数据
        if (obj == null || obj == undefined || obj[0] == null) {
            rxMsg(RxMsgType.WARNNING,"请选择一个岗位");
            return false;
        } else {
            var evalFunc = eval("getPrevWin()." + func);
            var posts = [];
            $.each(obj, function (i, t) {
                var post = {};
                post["basePostId"] = t.ID;
                post["postCode"] = t.CODE;
                post["postName"] = t.NAME;
                posts.push(post)
            });
            evalFunc(posts);
            closeWin();
        }
    })
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


