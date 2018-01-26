var body = $("#body");
var w = $(window);
var buttonbar = $("#buttonbar");
w.resize(function () {
    body.height(w.height() - buttonbar.outerHeight(true) - 24);
}).resize();
$("document").ready(function () {
    //初始化按钮
    // $('#button-new').omButton({
    //     // icons: {left: RX.handlePath('/medias/style/plat/image/button/add.gif')},
    //     onClick: function () {
    //         panel().newFlow();
    //     }
    // });
    $('#button-new').click(function () {
        panel().newFlow();
    });
    $('#button-save').omButton({
        icons: {left: RX.handlePath('/medias/style/plat/image/button/disk.gif')},
        onClick: function () {
            panel().save();

        }
    });
    $('#buttonbar').omButtonbar({
        width: "100%",
        btns: [
            {
                label: "选择",
                id: "button-select",
                icons: {left: RX.handlePath('/medias/style/plat/image/lcsj/0069.png')},
                onClick: function () {
                    panel().select();
                }
            },
            {
                label: "开始环节",
                id: "button-draw-start-node",
                icons: {left: RX.handlePath('/medias/style/plat/image/lcsj/0144.png')},
                onClick: function () {
                    panel().draw('StartNode');
                }
            },
            {
                label: "活动环节",
                id: "button-draw-rect",
                icons: {left: RX.handlePath('/medias/style/plat/image/lcsj/0230.png')},
                onClick: function () {
                    panel().draw('ActivityNode');
                }
            },
            {
                label: "决策环节",
                id: "button-draw-diamond",
                icons: {left: RX.handlePath('/medias/style/plat/image/lcsj/0494.png')},
                onClick: function () {
                    panel().draw('DecisionNode');
                }
            },
//                {
//                    label:"嵌套环节",
//                    id:"button-draw-nestedrect",
//                    icons:{left:'/medias/style/plat/image/lcsj/0125.png'},
//                    onClick:function () {
//                        panel().draw('ClusterNode');
//                    }
//                },
//                {
//                    label:"传阅环节",
//                    id:"button-draw-read-node",
//                    icons:{left:'/medias/style/plat/image/lcsj/0362.png'},
//                    onClick:function () {
//                        panel().draw('CirculationNode');
//                    }
//                },
            {
                label: "结束环节",
                id: "button-draw-end-node",
                icons: {left: RX.handlePath('/medias/style/plat/image/lcsj/0143.png')},
                onClick: function () {
                    panel().draw('EndNode');
                }
            },
            {
                label: "流向",
                id: "button-draw-polyline",
                icons: {left: RX.handlePath('/medias/style/plat/image/lcsj/0277.png')},
                onClick: function () {
                    panel().relate('Router');
                }
            }
        ]
    });
    w.resize();
});

function config() {
    var setting = {
        data: {
            simpleData: {
                enable: true,
                idKey: "handleId",
                pIdKey: "pId",
                rootPId: 0
            }
        },
        view: {
            addHoverDom: addHoverDom,
            removeHoverDom: removeHoverDom,
            selectedMulti: false
        },
        callback: {
            onClick: function (event, treeId, treeNode) {
                var id = treeNode.id.split("_").pop();
                $.get("/workflow/designTools/getWorkflowJSON", {id: id, c: Math.random}, function (ar) {
                    if (ar.success) {
                        panel().getWorkflow(ar.data);
                    } else {
                        _top.layer.alert(ar.msg);
                    }
                }, 'json');
            },
            beforeClick: function (treeId, treeNode, clickFlag) {
                return treeNode.type == 'workflow';
            },
            onAsyncSuccess: expandFirstTreeNode()
        }
    };
    return setting;
}
reloadWfTree();
var flTree;
function reloadWfTree(func) {
    $.get("/workflow/designTools/getSyncWorkflowTypeAndWorkflowTree", {c: Math.random}, function (ar) {
        flTree = $.fn.zTree.init($("#flowlist"), config(), ar);
        if(func){func()};
    }, 'json');
}
function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.id).length > 0
        || $("#editBtn_" + treeNode.id).length > 0 || $("#delBtn_" + treeNode.id).length > 0)
        return;
    if (treeNode.type === "workflowtype") {
        //增加
        var addStr = "<span class='button add' id='addBtn_" + treeNode.id
            + "' title='增加类别' onfocus='this.blur();'></span>";
        sObj.after(addStr);
        var addBtn = $("#addBtn_" + treeNode.id);
        if (addBtn) {
            addBtn.bind("click", function () {
                var url = "/workflow/designTools/workflowType?type=xz&nodeId=" + treeNode.id + "&nodeName=" + encode(treeNode.name);
                openStack(window, "新建流程类别", "small", RX.handlePath(url));
            });
        }
        //编辑
        var editStr = "<span class='button edit' id='editBtn_" + treeNode.id
            + "' title='修改' onfocus='this.blur();'></span>";
        sObj.append(editStr);
        var editBtn = $("#editBtn_" + treeNode.id);
        if (editBtn) {
            editBtn.bind("click", function () {
                var url = "/workflow/designTools/workflowType?type=xg&nodeId=" + treeNode.id + "&nodeName=" + encode(treeNode.name);
                openStack(window, "修改流程类别", "small", RX.handlePath(url));
            });
        }
        //删除
        var delStr = "<span class='button remove' id='delBtn_" + treeNode.id
            + "' title='删除' onfocus='this.blur();'></span>";
        sObj.append(delStr);
        var delBtn = $("#delBtn_" + treeNode.id);
        if (delBtn) {
            delBtn.bind("click", function () {
                layer.confirm("确认删除该流程类别？",function(index){
                   layer.close(index);
                    $.ajax({
                        type: "post",
                        url: "/workflow/designTools/delWorkflowType",
                        data: {id: treeNode.id},
                        async: false,
                        success: function (ar) {
                            if (ar.success) {
                                reloadWfTree();
                                rxMsg(RxMsgType.SUCCESS,"删除成功");
                            } else {
                                _top.layer.alert(ar.msg);
                            }
                        }
                    });
                })
            });
        }
    } else {
        //删除
        delStr = "<span class='button remove' id='delBtn_" + treeNode.id
            + "' title='删除' onfocus='this.blur();'></span>";
        sObj.append(delStr);
        delBtn = $("#delBtn_" + treeNode.id);
        if (delBtn) {
            delBtn.bind("click", function () {
                layer.confirm("确定要删除所选流程吗?", function (index) {
                    layer.close(index);
                    $.ajax({
                        type: "post",
                        url: "/workflow/designTools/delWorkflow",
                        data: {id: treeNode.id.replace("f_", "")},
                        async: false,
                        success: function (ar) {
                            if (ar.success) {
                                reloadWfTree();
                                rxMsg(RxMsgType.SUCCESS,"删除成功");
                            } else {
                                layer.alert(ar.msg);
                            }
                        }
                    });
                })
            });
        }
    }
}
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.id).unbind().remove();
    $("#editBtn_" + treeNode.id).unbind().remove();
    $("#delBtn_" + treeNode.id).unbind().remove();
}

function panel() {
    //chrome 存在本地跨域问题
    return $("#flow-panel")[0].contentWindow;
}

//选中树节点，并填充panel内容
function redrawPanel(id){
    var nodes = flTree.getNodesByParam("handleId","f_"+id);
    if(nodes.length){
        flTree.selectNode(nodes[0]);
    }
    $.get("/workflow/designTools/getWorkflowJSON", {id: id, c: Math.random}, function (ar) {
        if (ar.success) {
            panel().getWorkflow(ar.data);
        } else {
            _top.layer.alert(ar.msg);
        }
    }, 'json');
}