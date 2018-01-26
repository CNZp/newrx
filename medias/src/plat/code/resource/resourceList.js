var modelResourceList;         //资源列表对象
var oldParentId = null;
$(function () {
    //异步提示注册
    pageAjax();
    //初始化尺寸
    resizeTable();
    //创建资源树
    createResourceTree();
    //列表模型
    modelResourceList = new BaseGridModel(ModelResourceList_Propertys);
    //设置列表搜索区
    modelResourceList.buildSearchView();
    //设置双击事件
    if (!modelResourceList.get("mulchose")) {
        modelResourceList.set("onRowDblClick", function onRowDblClick(rowIndex, rowData, isSelected, event) {
            openStack(window, "查看" + getTypeName(rowData.TYPE), "medium", "/resource/resourceEdit?resourceType=" + rowData.TYPE + "&type=ck&id=" + rowData.ID);
        });
    }
    //渲染列表
    modelResourceList.render();

    RX.button.init($("#operBtns"),buttonsJson);
    toggleSearchView($(".query_box"), $(".downSearch"));
});

function createResourceTree() {
    $.ajax({
        url: "/resource/getRoleResourceTreeData",
        type: 'post',
        data: {treeHide: false},
        success: function (ar) {
            $.fn.zTree.init($("#tree"), {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pid",
                        rootPId: 0
                    }
                },
                edit: {
                    enable: true,
                    drag: {
                        isCopy: false,    //是否允许复制节点，true时拖动节点变成复制该节点，按ctrl拖动表示复制
                        isMove: true
                    },
                    showRenameBtn:false,
                    showRemoveBtn:false
                },
                callback: {
                    beforeDrag:zTreeBeforeDrag,
                    beforeDrop:ztreeBeforeDrop,
                    onDrop:zTreeOnDrop,
                    onClick: zTreeOnClick
                }
            }, ar);
        }
    })
}

//是否可移动，比如顶级节点不可移动等
//注意是treeNodes，可以拖动多个节点
function zTreeBeforeDrag(treeId, treeNodes){
    var result = true, type = treeNodes[0].type;
    $.each(treeNodes,function(i,t){
        if(t.type != type){
            result = false;
            layer.alert("不可同时移动不同类型的资源");
            return false;
        }
    })
    if(result){
        oldParentId = treeNodes[0].pid;
    }
    return result;
}

//是否可以移至目标节点 的
//moveType  "inner"：成为子节点，"prev"：成为同级前一个节点，"next"：成为同级后一个节点
//判断资源类型，移动资源、目标资源，和规则对比
function ztreeBeforeDrop(treeId, treeNodes, targetNode, moveType){
    if(!targetNode){
        return false;
    }
    //比较资源类型，看是否可以移动
    if(moveType == "inner" && !checkIfConfigChild(treeNodes[0].type, targetNode.type)){     //inner移动：不可作为下级
        layer.alert("不可将"+getTypeName(treeNodes[0].type)+"移动到"+getTypeName(targetNode.type)+"下");
        return false;
    }else if(treeNodes[0].pid != targetNode.pid){         //sort移动：上级不同时
        if(targetNode.pid && targetNode.pid != "0"){       //具有上级时
            var parentNode = targetNode.getParentNode();
            if(parentNode && !checkIfConfigChild(treeNodes[0].type, parentNode.type)){         //不可作为移动点父级点的下级
                layer.alert("不可将"+getTypeName(treeNodes[0].type)+"移动到"+getTypeName(parentNode.type)+"下");
                return false;
            }
        }
    }
   return true;
}

function checkIfConfigChild(fromType,toType){
    result = false;
    if(!fromType || !toType){
        return result;
    }
    var config = resourceConfig[fromType];
    if(config.parent && config.parent.indexOf(toType) > -1){
        result = true;
    }
    return result;
}

//拖曳结束后，数据处理
function zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType){
    var selfId = treeNodes[0].id,ids = [], parentNode = targetNode;

    if(!moveType){
        return;
    }
    if(moveType == "inner"){
        if(parentNode.children){
            $.each(parentNode.children, function(i,t){
                ids.push(t.id);
            })
        }
    }else if(treeNodes[0].pid != parentNode.pid){
        parentNode = targetNode.getParentNode();
        if(parentNode){
            if(parentNode.children){
                $.each(parentNode.children, function(i,t){
                    ids.push(t.id);
                })
            }
        }else{
            $.each($.fn.zTree.getZTreeObj(treeId).getNodesByParam("pid",0), function(i,t){
                ids.push(t.id);
            });
            parentNode = {}
        }
    }else{
        parentNode = targetNode.getParentNode();
        if(parentNode){
            if(parentNode.children){
                $.each(parentNode.children, function(i,t){
                    ids.push(t.id);
                })
            }
        }else{
            $.each($.fn.zTree.getZTreeObj(treeId).getNodesByParam("pid",0), function(i,t){
                ids.push(t.id);
            });
            parentNode = {}
        }
    }
    if(ids.length>0){
        $.ajax({
            url: "/resource/changeTreeNodeSortAndParent",
            type: 'post',
            data: {ids: ids.join(), parentId:parentNode.id, parentType:parentNode.type, parentShowId:parentNode.showParentId, needClearTargetId:oldParentId == parentNode.id? null:selfId},
            success: function (ar) {
                if(ar.success){
                    rxMsg("操作成功");
                }else{
                    layer.alert(ar.msg);
                    //刷新树
                }
            }
        })
        if(oldParentId != parentNode.id){
            createResourceTree();
        }
    }
}

function zTreeOnClick(event, treeId, treeNode) {
    $.getEle("SResource", "parentName").val(treeNode.name);
    modelResourceList.getSearchModel().setValue("parentId", treeNode.id);
    modelResourceList.getSearchModel().setValue("parentType", treeNode.type);
    //var param = [
    //    {zdName: "parentId", value:  treeNode.id}
    //];
    reloadTable();
}

//列表刷新全局接口
function reloadTable(param) {
    modelResourceList.reloadGrid(param);
}

function getTypeName(code) {
    var name = "";
    $.each(resourceDict, function (i, t) {
        if (t.code == code) {
            name = t.value;
            return false;
        }
    })
    return name;
}

function add(){
    var sm = modelResourceList.getSearchModel(), url = "/resource/resourceTypeSelect";
    if (sm.get("parentId")) {
        url += "?parentId=" + sm.get("parentId") + "&parentName=" + encode(sm.get("parentName")) + "&parentType=" + sm.get("parentType");
    }
    openStack(window, "新增资源", "medium", url);
}

function edit(){
    var row = modelResourceList.getSelect();
    if (row && row.length == 1) {
        openStack(window, "修改" + getTypeName(row[0].TYPE), "medium", "/resource/resourceEdit?resourceType=" + row[0].TYPE + "&type=xg&id=" + row[0].ID);
    } else {
        rxMsg(RxMsgType.WARNNING,"请选择一条待修改的数据");
    }                                          
}

function del(){
    var obj = modelResourceList.getSelect();//获取选中行的数据
    if (obj == null || obj.length != 1) {
        rxMsg(RxMsgType.WARNNING,"请选择一条待删除的数据");
    } else {
        var isParent = (obj[0].UTYPE == 1);
        layer.confirm("确定要删除所选记录吗？", function (index) {
            layer.close(index);
            $.ajax({
                type: "post",
                url: "/resource/delResource",
                data: {id: obj[0].ID},
                async: false,
                success: function (ar) {
                    if (ar.success) {
                        rxMsg(RxMsgType.SUCCESS,"删除成功");
                        if (isParent) {
                            var sm = modelResourceList.getSearchModel();
                            sm.setValue("parentId", "");
                            sm.setValue("parentName", "");
                            sm.setValue("parentType", "");
                        }
                        reloadTable();
                        createResourceTree();

                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        });
    }
}