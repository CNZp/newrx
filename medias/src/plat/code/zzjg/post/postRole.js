var ModelGlbRole; //关联角色
var ModelGlbRoleCollection; //关联角色集合
var id = GetQueryString("organPostId"); //机构岗位ID
var ModelPost, ModelPostRole, ModelPostRoleCollection;
var roleGlbTableView;
var modelPost;
var type = GetQueryString("type");
$(function () {
    var stateJson = xgStateJson;
    //关联角色类（保存角色使用）
    ModelGlbRole = DetailModel.extend({
        className: "ModelGlbRole",
        initJson: ModelPostJson,
        stateJson: stateJson,
        setModelName: function () {
            this.set("ModelName", "ModelGlbRole" + (++modelIndex));
        }
    });
    //机构角色（查看角色使用）
    ModelPostRole = DetailModel.extend({
        className: "ModelPostRole",
        initJson: ModelPostJson,
        stateJson: stateJson,
        setModelName: function () {
            this.set("ModelName", "ModelPostRole" + (++modelIndex));
        }
    });
    //关联关系集合
    ModelPostRoleCollection = Backbone.Collection.extend({
        model: ModelPostRole
    });
    //岗位主类
    ModelPost = DetailModel.extend({
        className: "ModelPost",
        initJson: ModelPostJson,
        stateJson: stateJson,
        relations: [
            {
                type: Backbone.HasMany,
                key: 'sysGlbRoleList',
                relatedModel: ModelGlbRole,
                collectionType: ModelGlbRoleCollection
            }, {
                type: Backbone.HasMany,
                ifForm: false,
                key: 'postRoleList',
                relatedModel: ModelPostRole,
                collectionType: ModelPostRoleCollection
            }
        ]
    });
    var post = {};
    if (id) {
        $.ajax({
            type: "get",
            url: "/post/getPostById?id=" + id + "&random=" + Math.random(),
            async: false,
            success: function (ar) {
                post = ar.data;
                $("#postName").text(post.organName + "·" + post.postName)
            }
        });
    }
    modelPost = new ModelPost(post);
    // modelPost.render();
    //获取机构岗位的角色
    $("#save").click(function () {
        $.ajax({
            url: "/post/saveOrganPostRole",
            type: "post",
            data: {sysPost: modelPost.getJson()},
            success: function () {
                rxMsg("保存成功");
                closeWin();
            }
        })
    });

    //角色关联表view
    var RoleGlbTableView = BaseTableView.extend({
        events: {
            'click .addRole': 'addRole'
        },
        getControlHtml: function () { //控制区域
            $("#roleList").empty();
            $("#roleList").append(RX.tpl("roleList", null));
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
            modelPost.get("sysGlbRoleList").push(model);
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
    //角色trView
    var RoleGlbTrView = BaseElementView.extend({
        events: {
            'click .delRole': 'delRole'
        },
        delRole: function () {
            var that = this;
            var delRoleId = that.model.get("roleId");
            var inModel;
            $.each(modelPost.get("sysGlbRoleList").models, function (i, t) {
                //删除的角色在关联表中，即来自实际岗位本体，直接置为UNVALID
                if (t.get("roleId") == delRoleId) {
                    inModel = t;
                    that.model.set("sfyx_st", "UNVALID");
                    inModel.set("sfyx_st", "UNVALID");
                }
            });
            //删除的岗位不在关联表中，即删除的角色为来自其他基础岗位或机构
            if (!inModel) {
                modelPost.get("sysGlbRoleList").add(
                    new ModelGlbRole({
                        roleId: delRoleId,
                        glType: 4,       //4表示实际岗位
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
            return $(this.el).append($(RX.tpl("roleBodyList", {model: this.model, INDEX: this.index})));
        },
        tagName: 'tr'
    });
    roleGlbTableView = new RoleGlbTableView({
        collection: modelPost.get("postRoleList"),
        el: $("#roleList")
    });
    roleGlbTableView.render();
});

//获取已关联的岗位ids
function getLinkRoleIds() {
    var models = modelPost.get("postRoleList").models;
    var ids = [];
    for (var i = 0, maxLength = models.length; i < maxLength; i++) {
        // if (models[i].get("sfyx_st") == "VALID") {
        ids.push(models[i].get("roleId"));
        // }
    }
    return ids;
}

/**
 *
 * @param id
 * @param name
 * @param code
 * @param type
 * @param typeName
 * 添加角色时，如果glb中已经有该角色了，但是处于禁用状态，将sfqy_st置成VALID
 * 如果glb中没有该角色，则在collection 中添加一条记录
 */
function getRole(roleId, name, code, type, typeName) {
    $.each(modelPost.get("sysGlbRoleList").models, function (i, t) {
        if (t.get("roleId") == id) {
            t.set("sfqy_st", "VALID");
            return;
        }
    });
    roleGlbTableView.addNewItem(new ModelGlbRole({
        roleId: roleId,
        glId: id,
        roleName: name,
        roleCode: code,
        roleType: type,
        glType: 4,       //4表示实际岗位
        sfqy_st: 'VALID',
        sfyx_st: 'VALID'
    }));
}

