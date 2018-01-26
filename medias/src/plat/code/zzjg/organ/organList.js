var mainTree; //主体树对象
var organList; //机构列表对象
$(function () {
    pageAjax();
    //实例化ztree对象
    mainTree = $.fn.zTree.init($("#tree"), config());
    //初始化尺寸
    resizeTable();
    //构建按钮
    buttons = RX.button.init($("#operate"), buttonsJson);
    //机构列表对象创建
    organList = new BaseGridModel(OrganList_Propertys);
    //可收缩
    toggleSearchView($(".query_box"), $(".downSearch"));
    //机构列表对象搜索面板生成
    organList.buildSearchView();
    //设置单双击事件
    organList.set("onRowDblClick", onRowDblClick);
    //渲染列表
    organList.render();
});

//新增
function add() {
    var sjbmid = organList.getSearchModel().get("parentId");
    var sjbmmc = $.getEle("SOrgan", "parentName").val();
    addOrgan(sjbmid, sjbmmc);
}

//修改
function edit() {
    var row = organList.getSelect();
    if (row.length > 0) {
        openStack(window, "修改机构", "medium", "/organ/organEdit?type=xg&id=" + row[0].ID);
    } else {
        rxMsg(RxMsgType.WARNNING, "请选择一条待修改的数据");
    }
}

//删除机构前打开机构关联信息
function openLink() {
    var obj = organList.getSelect();//获取选中行的数据
    if (obj == null || obj == undefined || obj[0] == null) {
        rxMsg(RxMsgType.WARNNING, "请选择一条待删除的数据");
        return false;
    } else {
        isOrganGlxx(obj[0].ID);
    }
}

//双击事件
function onRowDblClick(rowIndex, rowData, isSelected, event) {
    openStack(window, "查看机构信息", "medium", "/organ/organEdit?type=ck&id=" + rowData.ID);
}

//列表刷新全局接口
function reloadTable(param) {
    if (param) {
        organList.set("postData", param);
    }
    organList.reloadGrid();
}

//查看组织关联信息
function isOrganGlxx(id) {
    var result = false;
    $.ajax({
        type: "post",
        url: "/organ/organGlxx",
        async: false,
        data: {id: id},
        dataType: "json",
        success: function (ar) {
            if (ar.success) {             //设置为弹出层，显示关联数据
                //组织只关联了角色
                if (ar.data.organ.length == 0 && (ar.data.user.length == 0 && ar.data.post.length == 0)) {
                    if (ar.data.role.length > 0) {
                        openStack(window, "机构关联信息", "medium", "/organ/organLinkList?func=isDel&id=" + id, ar.data);
                    } else {
                        result = true;
                    }
                } else { //组织下有元素
                    confirmCascadeOrgan(id, ar.data);
                }
            } else {
                layer.alert(ar.msg);
            }
        }
    });
    return result;
}

//打开关联信息
function confirmCascadeOrgan(id, data) {
    openStack(window, "机构关联信息", "medium", "/organ/organLinkList?func=deleteOrgan&id=" + id, data);
}

//增加机构
function addOrgan(sjbmid, sjbmmc) {
    var url = "/organ/organEdit?type=xz&sjbmid=" + sjbmid + "&sjbmmc=" + encode(sjbmmc);
    openStack(window, "新增机构", "medium", url);
}

// //删除机构
function deleteOrgan(id, newOrganId) {
    $.ajax({
        url: "/organ/deleteOrgan?organId=+" + id + "&newOrganId=" + newOrganId,
        success: function (ar) {
            if (ar.success) {
                rxMsg(RxMsgType.SUCCESS, "删除成功");
            }
        }
    })
}

//zTree的配置
function config() {
    var url = "/tree/getOrganPostUserTree?kind=op";
    var setting = {
        data: {
            simpleData: {
                enable: true,
                idKey: "handleId",
                pIdKey: "pId",
                rootPId: 0
            }
        },
        async: {
            enable: true, type: "post", url: url,
            autoParam: ["id", "lx"],
            dataFilter: childAjaxDataFilter
        },
        edit: {
            enable: true,
            drag: {
                isCopy: false,    //是否允许复制节点，true时拖动节点变成复制该节点，按ctrl拖动表示复制
                isMove: true
            },
            removeTitle: "删除",
            renameTitle: "修改",
            showRenameBtn: false,
            showRemoveBtn: false
        },
        view: {
            selectedMulti: false
        },
        callback: {
            onClick: zTreeOnClick,
            onAsyncSuccess: zTreeOnAsyncSuccess,
            beforeDrag: zTreeBeforeDrag,
            onDrop: zTreeOnDrop
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

//刷新树父节点方法
function reLoadPartentNode() {
    mainTree = $.fn.zTree.init($("#tree"), config());
    firstAsyncSuccessFlag = 0; //设置标志位为0
}

//树节点单击事件
function zTreeOnClick(event, treeId, treeNode) {
    if (treeNode.id == 0 && treeNode.lx == "jg") {
        $.getEle("SOrgan", "parentName").val("");
        organList.getSearchModel().setValue("parentId", "");
        organList.set("postData", null);
        reloadTable();
    } else if (treeNode.lx == "jg") {
        $.getEle("SOrgan", "parentName").val(treeNode.name);
        organList.getSearchModel().setValue("parentId", treeNode.id);
        var param = [
            {zdName: "parentId", value: treeNode.id}
        ];
        reloadTable(param);
    } else if (treeNode.lx == "gw") {
        organList.getSearchModel().setValue("parentId", -1);
        var param = [
            {zdName: "parentId", value: -1}
        ];
        reloadTable(param);
    }
}

//异步加载树默认展开节点标志位
var firstAsyncSuccessFlag = 0;

//异步加载树默认展开节点
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

/**
 * 树节点hover事件
 * 主要用来添加按钮
 * @param treeId
 * @param treeNode
 */
function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    //验证按钮是否存在
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.id).length > 0 || $("#stopBtn_" + treeNode.id).length > 0
        || $("#ableBtn_" + treeNode.id).length > 0 || $("#editBtn_" + treeNode.id).length > 0) return;

    if (treeNode.lx == "jg") {
        //添加按钮
        var addStr = "<span class='button add' id='addBtn_" + treeNode.id + "' title='新增' onfocus='this.blur();'></span>";
        sObj.append(addStr);
        var btn = $("#addBtn_" + treeNode.id);
        var organId = treeNode.id;
        var organName = "";
        if (organId) {
            organName = treeNode.name
        } else {
            organId = null;
        }
        //添加机构
        if (btn) {
            btn.bind("click", function () {
                addOrgan(organId, organName);
            });
        }

        if (treeNode.id != 0) {       //如果不是  顶级"机构"
            //编辑按钮
            var editStr = "<span class='button edit' id='editBtn_" + treeNode.id + "' title='修改' onfocus='this.blur();'></span>";
            sObj.append(editStr);
            var editBtn = $("#editBtn_" + treeNode.id);
            if (editBtn) {
                editBtn.bind("click", function () {
                    openStack(window, "修改机构", "medium", "/organ/organEdit?type=xg&id=" + treeNode.id);
                });
            }
        }
    } else if (treeNode.lx == "gw") {
        var relateRole = "<span class='button edit' id='editBtn_" + treeNode.id + "' title='管理岗位' onfocus='this.blur();'></span>";
        sObj.append(relateRole);
        var relateRoleBtn = $("#editBtn_" + treeNode.id);
        if (relateRoleBtn) {
            relateRoleBtn.bind("click", function () {
                openStack(window, "关联角色", "medium", "/post/postRole?type=xg&organPostId=" +
                    treeNode.id + "&organId=" + treeNode.organId + "&basePostId=" + treeNode.basePostId
                );
                // openStack(window, "关联角色", "medium", "/post/organPostRole?type=xg&organPostId=" + treeNode.id + "&organId=" + treeNode.pId.substring(0, treeNode.pId.length - 2));
            });
        }
        //编辑按钮
        var deleteStr = "<span class='button remove' id='deleteBtn_" + treeNode.id + "' title='删除' onfocus='this.blur();'></span>";
        sObj.append(deleteStr);
        var deleteBtn = $("#deleteBtn_" + treeNode.id);
        if (deleteBtn) {
            deleteBtn.bind("click", function () {
                //todo 岗位下有人禁止删除
                layer.confirm("确认删除该岗位吗？", function (index) {
                    deletePost(treeNode.id, treeNode);
                    layer.close(index);
                })
            });
        }
    }
}

//树节点hover
// 移除事件
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.id).unbind().remove();
    $("#deleteBtn_" + treeNode.id).unbind().remove();
    // $("#ableBtn_" + treeNode.id).unbind().remove();
    $("#editBtn_" + treeNode.id).unbind().remove();

}

//注意是treeNodes，可以拖动多个节点
function zTreeBeforeDrag(treeId, treeNodes) {
    for (var i = 0; i < treeNodes.length; i++) {
        if (treeNodes[i].lx !== 'jg') {
            treeNodes[i].drag == false;
            return false;
        }
    }
    if (treeNodes.length > 1) {
        layer.alert("只可拖动一个机构");
    } else {
        if (treeNodes[0].pId == 0) {
            layer.alert("顶级机构不可拖动");
        }
    }

}

/**
 *
 * @param event
 * @param treeId 目标节点的treeId
 * @param treeNodes 被拖拽节点的JSON数据集合
 * @param targetNode    目标节点的JSON数据集合
 * @param moveType  //相对目标节点的位置  "inner"：成为子节点，"prev"：成为同级前一个节点，"next"：成为同级后一个节点
 */
function zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
    var ids = [], parentNode = targetNode;
    if (!moveType) {
        return;
    }
    if (moveType === "inner") {
        if (parentNode.children) {
            $.each(parentNode.children, function (i, t) {
                if (t.lx === 'jg') {
                    ids.push(t.id);
                }
            })
        }
    } else if (treeNodes[0].pid != parentNode.pid) {
        parentNode = targetNode.getParentNode();
        if (parentNode) {
            if (parentNode.children) {
                $.each(parentNode.children, function (i, t) {
                    if (t.lx === 'jg') {
                        ids.push(t.id);
                    }
                })
            }
        } else {
            $.each($.fn.zTree.getZTreeObj(treeId).getNodesByParam("pid", 0), function (i, t) {
                ids.push(t.id);
            });
            parentNode = {}
        }
    } else {
        parentNode = targetNode.getParentNode();
        if (parentNode) {
            if (parentNode.children) {
                $.each(parentNode.children, function (i, t) {
                    if (t.lx === 'jg') {
                        ids.push(t.id);
                    }
                })
            }
        } else {
            $.each($.fn.zTree.getZTreeObj(treeId).getNodesByParam("pid", 0), function (i, t) {
                ids.push(t.id);
            });
            parentNode = {}
        }
    }
    if (ids.length > 0) {
        $.ajax({
            url: "/organ/changeTreeNodeSortAndParent",
            type: 'post',
            data: {ids: ids.join(), parentId: parentNode.id},
            success: function (ar) {
                if (ar.success) {
                    rxMsg("操作成功");
                } else {
                    layer.alert(ar.msg);
                }
            }
        })
    }
}

/**
 * 删除岗位
 * @param postId
 */
function deletePost(postId, treeNode) {
    $.ajax({
        type: "post",
        url: "/post/deletePost?postId=" + postId,
        async: false,
        success: function (ar) {
            if (ar.success) {
                reloadTable();
                rxMsg(RxMsgType.SUCCESS, "删除成功");
                mainTree.removeNode(treeNode);
            } else {
                layer.alert(ar.data);
            }
        }
    });
}

//第一次过滤标识
var filterFlag = 0;

function childAjaxDataFilter(treeId, parentNode, childNodes) {
    if (filterFlag == 0) {
        var result = [];
        $.each(childNodes, function (i, t) {
            if (t.id != -1) {
                result.push(childNodes[i]);
            }
        });
        filterFlag = 1;
        return result;
    }
    return childNodes;
}
