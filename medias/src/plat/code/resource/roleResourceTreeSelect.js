var tree;
var id = GetQueryString("id");
var roleId = GetQueryString("roleId");
var resourceType = GetQueryString("resourceType");
var func = GetQueryString("func");
$(function () {
    //异步提示注册
    pageAjax();
    //初始化尺寸
    resizeForm();

    $.ajax({
        url: "/resource/getRoleResourceTreeData",
        type: 'post',
        data: {treeHide:true, roleId:roleId},
        success:function(ar){
            tree = $.fn.zTree.init($("#tree"), {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pid",
                        rootPId: 0
                    }
                },
                check:{
                    enable:true,
                    chkboxType:{"Y":"ps","N":"s"}
                }
            }, ar);
        }
    })

    $("#save").click(function () {
        var ids = [],nodes = tree.getCheckedNodes();
        $.each(nodes, function(i,t){
            ids.push(t.id);
        })
        $.ajax({
            url: "/resource/saveRoleResource",
            type: 'post',
            data: {roleId: roleId, resourceIds: ids.join()},
            success: function (ar) {
                 if(ar.success){
                     rxMsg("保存成功");
                     closeWin();
                 }else{
                     layer.alert(ar.msg);
                 }
            }
        });
    });
});

