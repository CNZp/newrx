//操作类型标志位
var type = GetQueryString("type");
var roleId = GetQueryString("roleId");
$(function () {
    //初始化尺寸
    resizeForm();
    pageAjax();
    //资源岗位
    // resourcePostTree();
    if (type != "ck") {
        $("#save").show();
    }

    //获取初值
    var role = {};   //供初始化的角色数据对象
    if (roleId) {
        $.ajax({
            type: "get",
            url: "/role/getRoleById?id=" + roleId + "&random=" + Math.random(),
            async: false,
            success: function (ar) {
                if (ar.success) {
                    role = ar.data;
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    }
    var resultBack;
    if (roleId) {
        $.ajax({
            type: "post",
            url: "/role/getGlxxByRole",
            data: {roleId: roleId, type:"relate"},
            success: function (ar) {
                if (ar.success) {
                    var data = ar.data;
                    resultBack = chooseOrganPostUser(data.inUsers, data.outUsers, data.inOrganPosts, data.outOrganPosts, data.basePosts, data.supportBasePosts, data.organs);
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    }
    $("#save").click(function () {
        // //获取关联要素
        var saveParam = {};
        saveParam = resultBack.getSaveOrganData();
        $.ajax({
            type: "post",
            url: "/role/saveRoleGlxx",
            data: {
                roleId: roleId,
                organsAdd: saveParam.addOrganStr,
                organsDel: saveParam.delOrganStr,
                basepostsAdd: saveParam.addBasePostStr,
                basepostsDel: saveParam.delBasePost,
                postsInclude: saveParam.addPostStr,
                postsExclude: saveParam.removePostStr,
                postsTurn: saveParam.delPostStr,
                usersInclude: saveParam.gxAddUserStr,
                usersExclude: saveParam.gxNotUserStr,
                usersTurn: saveParam.delUserStr
            },
            success: function (ar) {
                if (ar.success) {
                    rxMsg("保存成功");
                    var evalFunc = eval("getPrevWin()." + GetQueryString("func"));
                    result = evalFunc();
                    closeWin();
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    });

});