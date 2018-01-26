var func = GetQueryString("func");
var roleId = GetQueryString("roleId");
var modelRoleList;
var roleType = GetQueryString("roleType");
$(function () {
    //初始化尺寸
    resizeForm();
    //注册请求中msg
    pageAjax();
    //设置默认值
    SModelRoleJson.SModelRole.roleType.defaultValue = roleType;
    //实例列表对象
    modelRoleList = new BaseGridModel(ModelRoleList_Propertys);
    //渲染搜索区
    modelRoleList.buildSearchView();
    //设置过滤项
    modelRoleList.set("dischose", true);
    modelRoleList.set("disObject", {id: eval("[" + roleId + "]")});
    //设置双击事件
    modelRoleList.set("onRowDblClick", function () {
        selectItem()
    });
    //渲染列表
    modelRoleList.render();
    $(".viewElement").live('click', function (event) {
        var ptr = $(this).parents("tr");
        if (ptr.next().hasClass("elementTr")) {
            ptr.next().toggle();
        } else {
            var rowData = ptr.data("rowData");
            var htmlStr = "<div style='width:100%;height:200px'>" +
                "<iframe src='"+RX.handlePath("/role/roleElementView?id=" + rowData.ID + "&roleMade=" + rowData.ROLE_MADE)+"' frameborder='0'" +
                "width='100%' height='200px' scrolling='no'></iframe></div>";
            $(this).parents("tr").after("<tr id='ele" + rowData.ID + "' class='elementTr'><td colspan='4'>" + htmlStr + "</td></tr>")
        }
        if (!ptr.next().is(":hidden")) {
            $(".elementTr").each(function (i, t) {
                if ($(t).attr("id") != ptr.next().attr("id")) {
                    $(t).hide();
                }
            })
        }
        event.stopPropagation();
    });
    //保存按钮事件
    $("#confirm").click(function () {
        selectItem();
    });
});

function reloadTable(param) {
    modelRoleList.reloadGrid(param);
}

function selectItem() {
    var sel = modelRoleList.getSelect();
    if (sel.length > 0) {
        var evalFunc = eval("getPrevWin()." + func);
        result = evalFunc(sel[0].ID, sel[0].ROLE_NAME, sel[0].ROLE_CODE, sel[0].ROLE_TYPE, sel[0].ROLE_TYPE_NAME, sel[0].ROLE_MADE);
        if (result || typeof(result) == "undefined") {
            closeWin();
        }
    } else {
        layer.alert("请选择一条数据");
    }
}