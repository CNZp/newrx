var modelOrgan;        //机构对象
var type = GetQueryString("type");  //操作类型标志位
var ModelGlbOrganRole;             //角色机构关联类
var ModelGlbOrganPost; //机构岗位关联
var roleGlbTableView;     //角色TableView
$(function () {
    //初始化尺寸
    resizeForm();
    // $(".element_box").each(function(){
    //     var $this = $(this),
    //         $next = $this.next();
    //     if($next.length && $next.hasClass("element_box_hz")){
    //         $this.css("float","left");
    //         $next.css("float","right");
    //         $this.width($this.parent().width() - $next.width() -10);
    //     }
    // })
    //依据参数确定选择的状态配置
    var stateJson;
    if (type == "xz") {
        stateJson = XzState;
        $(".w_button_box").show();
    } else if (type == "xg") {
        $(".w_button_box").show();
        stateJson = XgState;
    } else if (type == "ck") {
        stateJson = CkState;
    }
    //机构角色关联类声明
    ModelGlbOrganRole = DetailModel.extend({
        className: "ModelGlbOrganRole",
        initJson: ModelOrganJson,
        stateJson: stateJson,
        setModelName: function () {
            this.set("ModelName", "ModelGlbOrganRole" + (++modelIndex));
        }
    });

    //角色关联集合
    var GlbOrganRoleCollection = Backbone.Collection.extend({
        model: ModelGlbOrganRole
    });

    //机构岗位关联
    ModelGlbOrganPost = DetailModel.extend({
        className: "ModelGlbOrganPost",
        initJson: ModelOrganJson,
        stateJson: stateJson,
        setModelName: function () {
            this.set("ModelName", "ModelGlbOrganPost" + (++modelIndex));
        }
    });

    //岗位关联集合
    var GlbOrganPostCollection = Backbone.Collection.extend({
        model: ModelGlbOrganPost
    });

    //机构类声明
    var ModelOrgan = DetailModel.extend({
        className: "ModelOrgan",
        initJson: ModelOrganJson,
        stateJson: stateJson,
        state: type,
        relations: [
            {
                type: Backbone.HasMany,
                key: 'organRoleList',
                relatedModel: ModelGlbOrganRole,
                collectionType: GlbOrganRoleCollection
            },
            {
                type: Backbone.HasMany,
                key: 'sysPostList',
                relatedModel: ModelGlbOrganPost,
                collectionType: GlbOrganPostCollection
            }
        ]
    });

    //获取初值
    var id = GetQueryString("id");
    var organ = {};   //机构数据对象
    if (id) {
        $.ajax({
            type: "get",
            url: "/organ/getOrganById?id=" + id + "&random=" + Math.random(),
            async: false,
            success: function (ar) {
                organ = ar.data;
            }
        });
    }
    //创建机构对象
    modelOrgan = new ModelOrgan(organ);
    if (type == "xz") {
        var sjbmmc = decodeURI(decodeURI(GetQueryString("sjbmmc")));    //上级机构名称
        var sjbmid = GetQueryString("sjbmid");    //上级机构id
        if (sjbmid && sjbmid != "undefined") {
            modelOrgan.set("parentName", sjbmmc);
            modelOrgan.set("parentOrg", sjbmid);
        }
        $.ajax({
            type: "get",
            url: "/module/getMaxSort?tableName=sys_organ&fieldName=sort_num&random=" + Math.random(),
            async: false,
            success: function (ar) {
                modelOrgan.set("sortNum", ar.data);          //设置顺序号
            }
        });
        //关联岗位的添加
        $("#postList").append(RX.tpl("postList", {TYPE: type}));
    }
    //渲染数据
    modelOrgan.render(stateJson);
    if (type != "xz") {
        renderPostList(modelOrgan.get("sysPostList").models);
    }
    if (type == "ck") {
        $(".addPost").hide();
    }
    /**************关联角色列表*****************************/
        //角色trView
    var RoleGlbTrView = BaseElementView.extend({
            events: {
                'click .delRole': 'delRole'
            },
            delRole: function () {
                var that = this;
                var delRoleId = that.model.get("roleId");
                var inModel;
                $.each(modelOrgan.get("organRoleList").models, function (i, t) {
                    if (t.get("roleId") == delRoleId) {
                        inModel = t;
                        that.model.set("sfyx_st", "UNVALID");
                        inModel.set("sfyx_st", "UNVALID");
                    }
                });
                if (!inModel) {
                    modelOrgan.get("organRoleList").add(
                        new ModelLinkRole({
                            roleId: delRoleId,
                            glType: 3,       //3表示用户
                            sfqy_st: 'UNVALID',
                            sfyx_st: 'VALID'
                        }))
                }

                that.model.set("sfyx_st", "UNVALID");
                that.remove();
                this.parentView.index--;
                this.parentView.renderIndex();
            },
            canCheck: true,
            render: function () {    //实现渲染接口  render 方法会调用
                $(this.el).empty();
                return $(this.el).append($(RX.tpl("roleBodyList", {model: this.model, INDEX: this.index, TYPE: type})));
            },
            tagName: 'tr'
        });

    //角色关联表view
    var RoleGlbTableView = BaseTableView.extend({
        events: {
            'click .addRole': 'addRole'
        },
        getControlHtml: function () { //控制区域
            $("#roleList").empty();
            $("#roleList").append(RX.tpl("roleList", {TYPE: type}));
        },
        getNewTrView: function (item, index) {  //实现接口，以关联创建的行view
            var view = this;
            return new RoleGlbTrView({
                model: item,
                index: index,
                parentView: view
            });
        },
        //新增角色
        addRole: function () {
            var url = "/role/roleSelect?func=getRole&roleId=" + getLinkRoleIds() + "&roleType=1,2";
            openStack(window, "选择角色", "medium", url);
        },
        //添加新的一行
        addNewItem: function (model) {
            var view = this;
            // view.collection.push(model);
            modelOrgan.get("organRoleList").push(model);
            view.index++;
            var $tr = $(view.getNewTrView(model, view.index).render());
            $("tbody", view.el).append($tr);
            view.renderIndex($tr);
        },
        render: function () {  //RoleGlbTableView
            var view = this;
            view.index = 0;
            view.getControlHtml(); //初始化控制区域和Column区域
            if (type != "ck") {
                $(".addRole").show();
            }
            $.each(this.collection.models, function (key, model) {
                view.index++;
                $("tbody", view.el).append(view.getNewTrView(model, view.index).render());
            });
            this.renderIndex();
        },
        renderIndex: function (el, index) {
            if (el) {
                $("td.indextd", el).text(index || this.index);
            } else {
                $("tbody tr td.indextd", this.el).each(function (i, t) {
                    var $t = $(t);
                    $t.text(i + 1);
                })
            }
        }
    });

    roleGlbTableView = new RoleGlbTableView({
        collection: modelOrgan.get("organRoleList"),
        el: $("#roleList") //view的容器，事件的绑定
    });
    //视图渲染
    roleGlbTableView.render();
    /*****************关联角色列表*****************************/
    //保存
    $("#save").click(function () {
        if (modelOrgan.ruleValidate()) {
            $.ajax({
                type: "post",
                url: "/organ/saveOrgan",
                data: {sysOrgan: modelOrgan.getJson()},
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        rxMsg("保存成功");
                        reloadPrevWin();
                        //刷新列表树
                        getPrevWin().reLoadPartentNode();
                        closeAllWin();
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        }
    });

    $(".addPost").live("click", function () {
        openStack(window, "关联岗位", "medium", "/post/basePostSelect?type=xz&func=addPostCallback&postIds=" + getLinkPostIds());
    })
});

//选择上级机构机构回调函数
function sjmbSelectCallback(modelName, name, id) {
    $.getEle(modelName, "parentOrg").val(id);
    $.getEle(modelName, "parentName").val(name);
}


//取消
function cancelCheck() {
    if (modelOrgan.changeValidate()) {
        layer.confirm("页面已修改，确认关闭吗", function (index) {
            layer.close(index);
            closeWin();
        });
        return false;
    }
    return true;
}

//添加树类型，过滤id
function addOrganId() {
    var organId = modelOrgan.get("id");
    var str = "&filterId=" + organId + "&treeType=" + 1 + "&filterLx=jg";
    return str;
}

//新增角色回调函数
function getRole(id, name, code, type, typeName) {
    roleGlbTableView.addNewItem(new ModelGlbOrganRole({
        roleId: id,
        roleName: name,
        roleCode: code,
        roleType: type,
        glType: 2,
        sfqy_st: 'VALID',
        sfyx_st: 'VALID',
        roleTypeName: typeName
    }));
}

//改变启用状态
function changeState(model) {
    model.set("sfqy_st", model.get("sfqy_st") == "UNVALID" ? "VALID" : "UNVALID");
    roleGlbTableView.render();
}

//删除关联的角色
function delRole(modelName) {
    layer.confirm("您确认要删除这条数据", function (index) {
        roleGlbTableView.collection.get(modelName).set("sfyx_st", "UNVALID");
        roleGlbTableView.render();
        layer.close(index);
    });
}

//清空上级机构
function emptyParent() {
    $.getEle("ModelOrgan", "parentOrg").val("");
}

//所选岗位的回调函数
function addPostCallback(posts) {
    var maxLength = posts.length;
    var sum = 0;
    $.each(modelOrgan.get("sysPostList").models, function (i, t) {
        if (t.get("sfyx_st") == "VALID") {
            sum++;
        }
    });
    var modelArr = [];
    for (var i = 0; i < maxLength; i++) {
        var model = new ModelGlbOrganPost(posts[i]); //大小写不影响
        modelOrgan.get("sysPostList").add(model);
        modelArr.push(model);
    }
    $.each(modelArr, function (i, t) {
        $("#postTab").append(RX.tpl("postBodyList", {model: t, INDEX: ++sum, TYPE: type}));
    })
}

//渲染关联岗位列表
function renderPostList(models) {
    $("#postList").empty();
    var index = 0;
    $("#postList").append(RX.tpl("postList", {TYPE: type}));
    $.each(models, function (i, t) {
        if (t.get("sfyx_st") != "UNVALID") {
            index++;
            $("#postTab").append(RX.tpl("postBodyList", {model: t, INDEX: index, TYPE: type}));
        }
    })
}

function hideCz() {
    if (type == "ck") {
        $(".cz").hide();
    }
}

//删除关联岗位
function delPost(modelName) {
    layer.confirm("您确认要删除这条数据", function (index) {
        modelOrgan.get("sysPostList").get(modelName).set("sfyx_st", "UNVALID");
        renderPostList(modelOrgan.get("sysPostList").models);
        layer.close(index);
    });
}

//获取已关联的角色ids
function getLinkRoleIds() {
    var models = roleGlbTableView.collection.models;
    var ids = [];
    for (var i = 0, maxLength = models.length; i < maxLength; i++) {
        if (models[i].get("sfyx_st") == "VALID") {
            ids.push(models[i].get("roleId"));
        }
    }
    return ids;
}

//获取已经关联的岗位ids
function getLinkPostIds() {
    var models = modelOrgan.get("sysPostList").models;
    var ids = [];
    for (var i = 0, maxLength = models.length; i < maxLength; i++) {
        if (models[i].get("sfyx_st") == "VALID") {
            ids.push(models[i].get("basePostId"));
        }
    }
    return ids;
}


