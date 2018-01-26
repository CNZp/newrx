var ModelBasePost;
var modelBasePost;          //基础岗位
var ModelLinkOrgan;         //关联岗位类
var LinkOrganCollection;
var ModelLinkRole; //关联角色类
var LinkRoleCollection;
var type = GetQueryString("type");
$(function () {
    //异步提示注册
    pageAjax();
    //初始化尺寸
    resizeForm();

    var stateJson;
    if (type === "xz") {
        $(".w_button_box").show();
        stateJson = xzStateJson;
    } else if (type === "xg") {
        $(".w_button_box").show();
        stateJson = xgStateJson;
    } else if (type === "ck") {
        stateJson = ckStateJson;

    }
    //关联机构类
    ModelLinkOrgan = DetailModel.extend({
        className: "ModelLinkOrgan",
        initJson: ModelBasePostJson,
        stateJson: stateJson,
        setModelName: function () {
            this.set("ModelName", "ModelLinkOrgan" + (++modelIndex));
        }
    });
    //关联机构集合
    LinkOrganCollection = Backbone.Collection.extend({
        model: ModelLinkOrgan
    });

    //关联角色类
    ModelLinkRole = DetailModel.extend({
        className: "ModelLinkRole",
        initJson: ModelBasePostJson,
        stateJson: stateJson,
        setModelName: function () {
            this.set("ModelName", "ModelLinkRole" + (++modelIndex));
        }
    });

    LinkRoleCollection = Backbone.Collection.extend({
        model: ModelLinkRole
    });
    //基本岗位类
    ModelBasePost = DetailModel.extend({
        className: "ModelBasePost",
        initJson: ModelBasePostJson,
        stateJson: stateJson,
        relations: [
            {
                type: Backbone.HasMany,
                key: "postList",
                relatedModel: ModelLinkOrgan,
                collectionType: LinkOrganCollection
            },
            {
                type: Backbone.HasMany,
                key: "linkRoleList",
                relatedModel: ModelLinkRole,
                collectionType: LinkRoleCollection
            }
        ]
    });

    //关联角色的添加（初始模板添加）
    $("#roleList").append(RX.tpl("roleList", {TYPE: type}));
    var id = GetQueryString("id");
    if (id) {
        $.ajax({
            type: "get",
            url: "/basePost/getBasePostById?id=" + id + "&r=" + Math.random(),
            success: function (ar) {
                if (ar.success) {
                    renderForm(ar.data);
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    } else {
        renderForm();
    }

    //保存方法
    $("#save").click(function () {
        if (modelBasePost.ruleValidate()) {
            validateOrgans();
            $.ajax({
                type: "post",
                url: "/basePost/saveBasePost",
                data: {sysBasePost: modelBasePost.getJson()},
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        reloadPrevWin();
                        closeWin();
                        rxMsg("保存成功");
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        }
    });


});

function renderForm(data) {
    modelBasePost = new ModelBasePost(data);
    modelBasePost.render();
    //初始化树的数据
    // renderOrganTree(modelBasePost.get("postList"));
    //实例化ztree对象
    mainTree = $.fn.zTree.init($("#tree"), config());
    //渲染关联角色
    renderRole(modelBasePost.get("linkRoleList").models);
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
            dataFilter: dataFilter//数据过滤
        },
        edit: {
            enable: true,
            drag: {
                isCopy: false,    //是否允许复制节点，true时拖动节点变成复制该节点，按ctrl拖动表示复制
                isMove: true
            },
            showRenameBtn: false,
            showRemoveBtn: false
        },
        view: {
            selectedMulti: false
        },
        callback: {
            onAsyncSuccess: zTreeOnAsyncSuccess

        },
        check: {
            enable: true,
            chkboxType: {"Y": "", "N": ""}
        }
    };

    return setting;
}


//异步加载树默认展开节点
var firstAsyncSuccessFlag = 0;

function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
    //调用默认展开第一个结点
    if (firstAsyncSuccessFlag == 0) {
        var nodes = mainTree.getNodes();
        try {
            mainTree.expandNode(nodes[0], true);
            firstAsyncSuccessFlag = 1;
            closeLoading();
        } catch (err) {
        }
    }
}

var filterFlag = 0;
//数据过滤，树上岗位不能选择
function dataFilter(treeId, parentNode, responseData) {
    if (filterFlag == 0) {
        var temp = [];
        temp.push(responseData[0]);
        filterFlag = 1;
        responseData=temp;
    }
    if (responseData) {
        $.each(responseData, function (i, t) {
            if (t.lx == "gw") {
                t.nocheck = true;

            }
        });
    }
    var result = renderOrganTree(responseData, modelBasePost.get("postList"));

    return result
}

//获取选择的机构
function getTreeCheckedOrgans() {
    return mainTree.getCheckedNodes(true);
}

//同步组织机构
function validateOrgans() {
    var organCollection = modelBasePost.get("postList");
    var treeNodes = getTreeCheckedOrgans();

    //删除不存在的
    $.each(organCollection.models, function (i, t) {
        var inTag = false;
        $.each(treeNodes, function (ni, nt) {
            if (nt.id == t.get("organId")) {
                inTag = true;
                nt.inTag = true;
                return false;
            }
        });
        if (!inTag) {
            t.set("sfyx_st", "UNVALID");
        }
    });

    //增加新增的
    $.each(treeNodes, function (i, t) {
        if (t.inTag) {
            return true;
        } else {
            organCollection.add(new ModelLinkOrgan({
                organId: t.id,
                postName: $.getEle("ModelBasePost", "basePostName").val()
            }))
            ;
        }
    });

}

//渲染机构树
function renderOrganTree(treeData, postList) {
    var handleData = [];
    $.each(treeData, function (j, k) {
        $.each(postList.models, function (i, t) {
            if (k.lx == "jg" && t.get("organId") == k.id) {
                k.checked = true;
            }
        });
        //展示岗位
        if (!showPostFlag) {
            if (k.lx == "gw") {
            } else {
                handleData.push(k);
            }
        } else {
            handleData.push(k);
        }


    });
    return handleData;
}

//显示岗位标识
var showPostFlag = false;

//是否显示岗位
function ifShowPost(t) {
    firstAsyncSuccessFlag = 0;
    if ($(t).attr("checked")) {
        showPostFlag = true;
        mainTree = $.fn.zTree.init($("#tree"), config());
    } else {
        showPostFlag = false;
        mainTree = $.fn.zTree.init($("#tree"), config());
    }
}

//关联角色
function addRole() {
    var url = "/role/roleSelect?func=addRoleCallback&roleId=" + getLinkRoleIds() + "&roleType=1,2";
    openStack(window, "选择角色", ["680px", "500px"], url);
}

//关联角色回调
function addRoleCallback(id, name, code, type, typeName) {
    var model = new ModelLinkRole({
        roleId: id,
        roleName: name,
        roleCode: code,
        roleTypeName: typeName
    });
    modelBasePost.get("linkRoleList").add(model);
    var temp = modelBasePost.get("linkRoleList").models;
    var sum = 0;
    $.each(temp, function (i, t) {
        if (t.get("sfyx_st") == "VALID") {
            sum++;
        }
    });
    $("#roleTab").append(RX.tpl("roleBodyList", {model: model, INDEX: sum,TYPE: type}));

}

//获取已关联的岗位ids
function getLinkRoleIds() {
    var models = modelBasePost.get("linkRoleList").models;
    var ids = [];
    for (var i = 0, maxLength = models.length; i < maxLength; i++) {
        if (models[i].get("sfyx_st") == "VALID") {
            ids.push(models[i].get("roleId"));
        }
    }
    return ids;
}

//渲染角色列表
function renderRole(allRole) {
    $("#roleTab").empty();
    var index = 0;
    $.each(allRole, function (i, t) {
        if (t.get("sfyx_st") == "VALID") {
            index++;
            $("#roleTab").append(RX.tpl("roleBodyList", {model: t, INDEX: index,TYPE: type}));
        }
    });

    if (type === "xz") {
        $(".addRole").show();
    } else if (type === "xg") {
        $(".addRole").show();
    } else if (type === "ck") {
    }
}

//删除关联的角色
function delRole(modelName) {
    modelBasePost.get("linkRoleList").get(modelName).set("sfyx_st", "UNVALID");
    renderRole(modelBasePost.get("linkRoleList").models);
}




