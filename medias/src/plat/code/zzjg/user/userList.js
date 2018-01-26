var mainTree;    //ztree
var modelUserList;  //用户列表对象
$(function () {
    //打开加载中标志
    pageAjax();
    //实例化ztree
    mainTree = $.fn.zTree.init($("#tree"), config());
    //初始化尺寸
    resizeTable();
    //初始化按钮
    buttons = RX.button.init($("#operate"), buttonsJson);
    //实例化用户列表
    modelUserList = new BaseGridModel(ModelUserList_Propertys);
    //可收缩
    toggleSearchView($(".query_box"), $(".downSearch"));
    // 用户列表对象搜索面板生成
    modelUserList.buildSearchView();
    //设置双击事件
    modelUserList.set("onRowDblClick", onRowDblClick);
    //渲染列表
    modelUserList.render();

});

//新增用户
function add() {
    //当前机构树所选机构
    var organId = modelUserList.getSearchModel().get("organ_id");
    var postId = modelUserList.getSearchModel().get("postId");
    var organName, postName;
    if (organId && organId != -1) {
        organName = $.getEle("SUser", "organName").val();
        postName = $.getEle("SUser", "postName").val();
    }
    var url = "/user/userEdit?type=xz&organId=" + organId + "&organName=" + encode(organName) + "&postId=" + postId + "&postName=" + encode(postName);
    openStack(window, "新增用户", "medium", url);
}

//修改用户
function edit() {
    var row = modelUserList.getSelect();
    if (row.length > 0) {
        openStack(window, "修改用户", "medium", "/user/userEdit?type=xg&id=" + row[0].ID);
    } else {
        rxMsg(RxMsgType.WARNNING, "请选择一条待修改的数据");
    }
}

//删除用户
function del() {
    var obj = modelUserList.getSelect();//获取选中行的数据
    if (obj == null || obj == undefined || obj[0] == null) {
        rxMsg(RxMsgType.WARNNING, "请选择一条待删除的数据");
    } else {
        layer.confirm("确定要删除所选用户？", function (index) {
            $.ajax({
                url: "/user/delUser?userId=" + obj[0].ID,
                success: function () {
                    rxMsg(RxMsgType.SUCCESS, "删除成功");
                    reloadTable();
                }
            });
            layer.close(index);
        });

    }
}

//封锁/解锁用户
function isBlock() {
    var obj = modelUserList.getSelect();
    if (!obj || obj.length === 0) {
        rxMsg(RxMsgType.WARNNING,"请选择一条数据");
    } else {
        if (obj[0].IS_BLOCKED == 0) {
            $.ajax({
                url: "/user/blockUser?userId=" + obj[0].ID,
                success: function (ar) {
                    rxMsg('封锁成功');
                    reloadTable();
                }
            })
        } else if (obj[0].IS_BLOCKED == 1) {
            $.ajax({
                url: "/user/unblockUser?userId=" + obj[0].ID,
                success: function (ar) {
                    rxMsg('解锁成功');
                    reloadTable();
                }
            })
        } else {
            layer.alert("该数据状态异常");
        }
    }
}


//双击事件
function onRowDblClick(rowIndex, rowData, isSelected, event) {
    openStack(window, "查看用户", "medium", "/user/userEdit?type=ck&id=" + rowData.ID);
}

//刷新全局接口
function reloadTable(param) {
    if (param) {
        modelUserList.set("postData", param);
    }
    modelUserList.reloadGrid(param);
}

//用户关联信息
function isUserGlxx(id) {
    $.ajax({
        type: "post",
        data: {id: id},
        url: "/user/userGlxx",
        dataType: "json",
        success: function (ar) {
            if (ar.success) {
                if (ar.data.role.length > 0) {
                    openStack(window, "用户关联信息", "medium", "/organ/organLinkList?func=isDel&id=" + id, ar.data);
                    return false;
                } else {
                    layer.confirm("确定要删除所选记录吗？", function (index) {
                        delOrAbleUser(id, 0);   //0删除
                        layer.close(index);
                    });
                }
            } else {
                layer.alert(ar.msg);
            }
        }
    });
}


//异步加载树默认展开节点
var firstAsyncSuccessFlag = 0;

function zTreeOnAsyncSuccess(event, treeId, msg) {
    if (firstAsyncSuccessFlag == 0) {
        try {
            //调用默认展开第一个结点
            var nodes = mainTree.getNodes();
            mainTree.expandNode(nodes[0], true);
            firstAsyncSuccessFlag = 1;
            closeLoading();
        } catch (err) {
        }
    }
}

//zTree配置
function config() {
    // var url = "/tree/organTree?type=1&hasTop=false&hasDelData=true";      //type=1机构树，hasTop是否有顶级机构
    var url = "/tree/getOrganPostUserTree?kind=op";
    // var url = "/tree/getOrganTree?kind=o";
    var setting = {
        data: {
            simpleData: {
                enable: true,
                idKey: "handleId",
                pIdKey: "pId",
                rootPId: 0
            }
        },
        async: {enable: true, type: "post", url: url, autoParam: ["id", "lx"]},
        view: {
            selectedMulti: false
        },
        callback: {
            onClick: zTreeOnClick,
            onAsyncSuccess: zTreeOnAsyncSuccess
        }
    };
    if (!(!-[1,] && !window.XMLHttpRequest)) {         //不是IE6
        setting.view.addHoverDom = addHoverDom;
        setting.view.removeHoverDom = removeHoverDom;
    } else {
        setting.view.expandSpeed = "";
    }
    return setting;
}


//ztree节点点击事件
function zTreeOnClick(event, treeId, treeNode) {
    var param=[];
    if (treeNode.lx == "jg") {
        if (treeNode.id == 0) {              //后台可以做处理，机构id为0是查全部 todo
            $.getEle("SUser", "organName").val("");
            modelUserList.getSearchModel().setValue("organ_id", "");
            modelUserList.set("postData", null);
        } else if (treeNode.id == -1) {           //无组织-用户节点  todo
            $.getEle("SUser", "organName").val(treeNode.name);
            modelUserList.getSearchModel().setValue("organ_id", treeNode.id);
            param = [
                {zdName: "organ_id", value: treeNode.id}
            ];
        } else {
            $.getEle("SUser", "organName").val(treeNode.name);
            modelUserList.getSearchModel().setValue("organ_id", treeNode.id);
            modelUserList.getSearchModel().setValue("postId", "");
            $.getEle("SUser", "postName").val("");
            param = [
                {zdName: "organ_id", value: treeNode.id}
            ];
        }
        param.push({zdName: "user_name", value:$.getEle("SUser", "user_name").val()});
    } else if (treeNode.lx == "gw") {

        modelUserList.getSearchModel().setValue("postId", treeNode.id);
        $.getEle("SUser", "postName").val(treeNode.name);

        modelUserList.getSearchModel().setValue("organ_id", treeNode.organId);
        $.getEle("SUser", "organName").val(treeNode.organName);
        param = [
            {zdName: "organ_id", value: treeNode.organId},
            {zdName: "postId", value: treeNode.id}
        ];
    }
    param.push({zdName: "user_name", value:$.getEle("SUser", "user_name").val()});
    reloadTable(param);
}

//在树节点后添加按钮事件
function addHoverDom(treeId, treeNode) {
    if (treeNode.id != 0 && treeNode.id != -1) {
        var sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.id).length > 0) return;
        var addStr = "<span class='button add' id='addBtn_" + treeNode.id
            + "' title='新增' onfocus='this.blur();'></span>";
        sObj.append(addStr);

        var btn = $("#addBtn_" + treeNode.id);

        if (btn) {
            btn.bind("click", function () {  //getParrentOrgan
                if (treeNode.lx === "jg") {
                    var organName = treeNode.name;
                    var organId = treeNode.id;
                    var url = "/user/userEdit?type=xz&organId=" + organId + "&organName=" + encode(organName);
                    openStack(window, "新增用户", "medium", url);
                } else if (treeNode.lx === "gw") {
                    var organName = treeNode.organName;
                    var organId = treeNode.organId;
                    var postId = treeNode.id;
                    var postName = treeNode.name;
                    var url = "/user/userEdit?type=xz&organId=" + organId +
                        "&organName=" + encode(organName) + "&postId=" + postId + "&postName=" + encode(postName);
                    openStack(window, "新增用户", "medium", url);
                }

            });
        }
    }
}

//移除树节点后添加按钮的事件
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.id).unbind().remove();
}

//重置密码
function resetPwd() {
    var obj = modelUserList.getSelect();
    if (obj == null || obj == undefined || obj[0] == null) {
        rxMsg(RxMsgType.WARNNING, "至少选择一个用户");
    }
    else {
        var userIds = "";
        $.each(obj, function (i, t) {
            userIds += t.ID + ",";
        });
        layer.confirm("确认重置密码？", function () {
            $.ajax({
                url: "/main/resetPwd",
                type: "post",
                data: {userIds: userIds},
                success: function (ar) {
                    if (ar.success) {
                        rxMsg(RxMsgType.SUCCESS, "重置成功");
                    }
                }

            })
        });

    }
}

