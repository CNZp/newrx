//(模型类)  用户主类，所属机构类，关联角色类（关联表）用户角色类（分解表）
var ModelUser, ModelSSJG, ModelLinkRole, ModelUserRole;
//用户对象
var modelUser;
// (Table View 类) 所属机构Table view
var SsjgTableView;
//(Table View 对象) 所属机构Table view 对象,角色关联Table view
var ssjgTableView, roleGlbTableView;
//(集合类)角色关联集合  所属机构集合 用户角色集合
var RoleLinkCollection, SSJGCollection, UserRoleCollection;
//获取用户ID
var id = GetQueryString("id");
//操作类型标志位
var type = GetQueryString("type");
$(function () {
    //初始化尺寸
    resizeForm();
    //依据参数确定选择的状态配置
    var stateJson;
    if (type === "xz") {
        $(".w_button_box").show();
        stateJson = XzState;
    } else if (type === "xg") {
        $(".w_button_box").show();
        stateJson = XgState;
    } else if (type === "ck") {
        stateJson = CkState;
    }

    //所属机构类声明
    ModelSSJG = DetailModel.extend({
        className: "ModelSSJG",
        initJson: ModelUserJson,
        stateJson: stateJson,
        state: type,
        setModelName: function () {
            this.set("ModelName", "ModelSSJG" + (++modelIndex));
        }
    });

    //创建动态表单块集合collection类（1对多关系必须创建）
    SSJGCollection = Backbone.Collection.extend({
        model: ModelSSJG
    });

    //所属机构类声明
    ModelUserRole = DetailModel.extend({
        className: "ModelUserRole",
        initJson: ModelUserJson,
        stateJson: stateJson,
        state: type,
        setModelName: function () {
            this.set("ModelName", "ModelUserRole" + (++modelIndex));
        }
    });

    //创建动态表单块集合collection类（1对多关系必须创建）
    UserRoleCollection = Backbone.Collection.extend({
        model: ModelUserRole
    });

    //角色关联声明
    ModelLinkRole = DetailModel.extend({
        className: "ModelLinkRole",
        initJson: ModelUserJson,
        stateJson: stateJson,
        setModelName: function () {
            this.set("ModelName", "ModelLinkRole" + (++modelIndex));
        }
    });

    //角色关联集合
    RoleLinkCollection = Backbone.Collection.extend({
        model: ModelLinkRole
    });

    //用户类声明(主类)
    ModelUser = DetailModel.extend({
        className: "ModelUser",
        initJson: ModelUserJson,
        stateJson: stateJson,
        state: type,
        relations: [
            {
                type: Backbone.HasMany,
                key: 'sysGlbOrganUserPostList', //三要素管理
                relatedModel: ModelSSJG,
                collectionType: SSJGCollection
            },
            {
                type: Backbone.HasMany,
                key: 'sysGlbRoleList',
                relatedModel: ModelLinkRole,
                collectionType: RoleLinkCollection
            },
            {
                type: Backbone.HasMany,
                key: 'userRoleList',
                ifForm: false,
                relatedModel: ModelUserRole,
                collectionType: UserRoleCollection
            }
        ]
    });

    var user = {};  //用户数据对象
    if (id) { //修改
        $.ajax({
            type: "get",
            url: "/user/getUserById?id=" + id + "&random=" + Math.random(),
            async: false,
            success: function (ar) {
                user = ar.data;
            }
        });
        //存在机构显示默认机构名称
        if (user.dftOrganName) {
            $(".defOrgan").show();
        }
    }

    //依据初值创建用户对象
    modelUser = new ModelUser(user);

    //创建所属机构行view类
    var SsjgTrView = BaseElementView.extend({
        canCheck: true,
        tagName: 'tr',
        className: 'rx-grid-tr',
        renderEditMode: function () {    //实现渲染接口
            var html = "";
            html += "<td style='text-align:center'>" + this.index + "</td>";
            html += "<td style='text-align:center;width:85%;'><input type='text' id='organName'  class='i_text' data-model='" + this.model.get("ModelName") + "' data-property='organName' value='" + this.model.get("organName") + "'>";
            html += "<td style='text-align:center;width:85%;'><div class='element_box'><span  type='text' id='postName'  class='span_show_ellipsis' data-model='" + this.model.get("ModelName") + "' data-property='postName' value='" + this.model.get("postName") + "'></div>";
            html += "</td>";
            $(this.el).html(html);
        }
    });

    //创建所属机构view类
    SsjgTableView = BaseTableView.extend({
        getControlHtml: function () { //实现控制区域渲染接口
            var titleName = "所属机构岗位信息";
            var controlButton = "<div class='page_title'>" +
                "<h1>" + titleName + "</h1>";
            if (type === "ck") { //查看状态
                controlButton += "</div>";
            } else { //编辑状态
                controlButton += "<ul class='action_button to_right' >" +
                    "<li><a class='addTrItem'>新增</a></li>" +
                    "<li><a class='deleteItems'>删除</a></li>" +
                    "<li><a class='addDefaultOrgan'>设为默认机构</a></li>" +
                    "</ul>" +
                    "</div>";
            }
            return controlButton;
        },
        events: {
            'click .addTrItem': 'add',
            'click .deleteItems': 'deleteItems',
            'click .addDefaultOrgan': 'addDefaultOrgan'
        },
        getTheadHtml: function () {  //实现表头区域渲染接口
            var column =
                "<thead>" +
                "<th style='width:10%'>序号</th>" +
                "<th style='width:45%'>所属机构</th>" +
                "<th style='width:45%'>所属岗位</th>" +
                "</thead>";
            return column;
        },
        getNewModel: function () { //实现接口，以关联创建的model
            return new ModelSSJG();
        },
        getNewTrView: function (item, mode, display, index) {  //实现接口，以关联创建的行view
            return new SsjgTrView({
                model: item,
                renderCallback: mode,
                display: display,
                index: index
            });
        },
        //主渲染方法
        render: function () { //SsjgTableView
            var view = this;
            this.index = 0;
            $(this.el).empty();
            //渲染标题和控制区域
            $(this.el).append(view.getControlHtml());
            var table = $('<table  cellpadding="0" cellspacing="0" border="0" class="list"></table>');
            //渲染table的column部分
            $(table).append(view.getTheadHtml());
            var emptyFlag = true;
            //渲染collection
            if (this.collection != null && this.collection.models != null) {
                $.each(this.collection.models, function (key, model) {
                    if (model.get("sfyx_st") != "UNVALID") {
                        view.index++;
                        var viewel = view.getNewTrView(model, 'renderEditMode', true, view.index, view).render().el;
                        $(table).append(viewel);
                        emptyFlag = false;
                    }
                })
            }
            $(this.el).append(table);
            view.modelRender()
        },
        deleteItems: function () {
            var view = this;
            var dels = [];
            var defFlag = false;  //删除机构是否包含默认机构
            var defOrganId = $.getEle("ModelUser", "defaultOrganId").val();
            _.map(this.collection.models, function (model, key) {
                model.updateModel();
                if (model.checked == true) {
                    if (model.get("organId") == defOrganId) {
                        defFlag = true;
                    }
                    dels.push(model);
                }
            });
            var conFirmMsg = "您确定要删除选中的数据？";
            if (defFlag) {
                if (dels.length === 1) {
                    conFirmMsg = "删除的数据已设为默认机构，是否确认删除？";
                } else {
                    conFirmMsg = "删除的数据包含默认机构，是否确认删除？";
                }
            }
            if (dels.length > 0) {
                layer.confirm(conFirmMsg, function (index) {
                    $.each(dels, function (index, model) {
                        if (model.get("organId") == $.getEle("ModelUser", "defaultOrganId").val()) {
                            $.getEle("ModelUser", "dftOrganName").val("");
                            $.getEle("ModelUser", "defaultOrganId").val("");
                        }
                        model.set("sfyx_st", "UNVALID");
                        model.checked = false;
                    });
                    var hasValidData = false;
                    var models = view.collection.models;
                    for (var i = 0, maxLength = models.length; i < maxLength; i++) {
                        if (models[i].get("sfyx_st") !== "UNVALID") {
                            hasValidData = true;
                            break;
                        }
                    }
                    view.render();
                    changeJjRoleList();
                    layer.close(index);
                    if (hasValidData) {       //存在所属机构岗位
                        if (defFlag) {         //删除包含默认机构
                            $(".addDefaultOrgan").addClass("TextBoxErr");
                            $(".addDefaultOrgan").makePoshTip("请设置默认机构");
                        }
                    } else {
                        $(".defOrgan").hide();
                    }
                });
            } else {
                rxMsg(RxMsgType.WARNNING, "请选择要删除的数据");
            }
        },
        add: function () {
            var title = "选择机构岗位";
            var url = "/tree/getTree?treeType=2&func=addOrganPost&userFlag=true";
            // var url = "/tree/getOrganPostUserTree?kind=op&func=addOrganPost";
            openStack(window, title, "tree", url);
        },
        addNewItem: function (model) {
            var view = this;
            view.collection.push(model);
            view.index++;
            $(view.el).children("table").append(
                view.getNewTrView(model, 'renderEditMode', true, view.index).render().el
            );
            model.render();
            $(".promptMsg").remove();
        },
        addDefaultOrgan: function () {     //设置默认机构
            var dels = [];
            _.map(this.collection.models, function (model, key) {
                model.updateModel();                             //dftOrganName  defaultOrganId
                if (model.checked == true) {
                    dels.push(model);
                }
            });
            if (dels.length == 1) {
                $.getEle("ModelUser", "dftOrganName").val(dels[0].get("organName"));
                $.getEle("ModelUser", "defaultOrganId").val(dels[0].get("organId"));
                $(".defOrgan").show();
                modelUser.reRender(userState);
                $(".addDefaultOrgan").removeClass("TextBoxErr");
            } else {
                rxMsg(RxMsgType.WARNNING,"请选择一条数据");
            }
        }
    });

    //实例动态列表主view
    ssjgTableView = new SsjgTableView({
        collection: modelUser.get("sysGlbOrganUserPostList"),
        el: $("#tableview")
    });

    //新增用户
    if (type === "xz") {
        addUserInit();
    }

    //所属机构view渲染
    ssjgTableView.render();

    //依据初值创建主model实例
    modelUser.render(stateJson);

    //获取机构岗位信息
    var sysGlbOrganUserPostList = user.sysGlbOrganUserPostList;//用户关联机构、岗位信息
    if (sysGlbOrganUserPostList) {
        var postId = "", organId = "", basePostId = "";
        for (var i = 0, glbOrganLength = sysGlbOrganUserPostList.length; i < glbOrganLength; i++) {
            //机构岗位ID
            var pId = sysGlbOrganUserPostList[i].postId || "";
            postId += pId + ",";
            //机构ID
            var oId = sysGlbOrganUserPostList[i].organId || "";
            organId += oId + ",";
            //基础岗位ID
            var bId = sysGlbOrganUserPostList[i].basePostId || "";
            basePostId += bId + ",";
        }
    }
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
            modelUser.get("sysGlbRoleList").push(model);
            view.index++;
            var $tr = $(view.getNewTrView(model, view.index).render());
            $("tbody", view.el).append($tr);
            view.renderIndex($tr);
        },
        render: function (data) {  //RoleGlbTableView
            var view = this;
            view.index = 0;
            view.getControlHtml(); //初始化控制区域和Column区域
            if (type != "ck") {
                $(".addRole").show();
            }
            if (data) {
                view.collection.reset();
                $.each(data, function (i, t) {
                    view.collection.add(new ModelUserRole({
                        roleCode: t.ROLE_CODE,
                        roleName: t.ROLE_NAME
                    }))
                })
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
            $.each(modelUser.get("sysGlbRoleList").models, function (i, t) {
                if (t.get("roleId") == delRoleId) {
                    inModel = t;
                    that.model.set("sfyx_st", "UNVALID");
                    inModel.set("sfyx_st", "UNVALID");
                }
            });
            if (!inModel) {
                modelUser.get("sysGlbRoleList").add(
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

    roleGlbTableView = new RoleGlbTableView({
        collection: modelUser.get("userRoleList"),
        el: $("#roleList") //view的容器，事件的绑定
    });
    roleGlbTableView.render();

    //保存
    $("#save").click(function () {
        if (modelUser.ruleValidate()) {
            //读取系统配置
            var existNoOrganUser = _top.winData(_top, "CONFIG").existNoOrganUser;
            var organModels = ssjgTableView.collection.models;
            var organFlag = false;      //有无所属机构
            for (var i = 0, organModelLength = organModels.length; i < organModelLength; i++) {
                if (organModels[i].get("sfyx_st") == "VALID") {
                    organFlag = true;
                    break;
                }
            }
            var defOrgan = $.getEle("ModelUser", "defaultOrganId").val();
            if (!organFlag && !defOrgan) {
                if (existNoOrganUser && existNoOrganUser == "false") {
                    rxMsg(RxMsgType.WARNNING, "请至少选择一个机构");
                    return;
                }
            }
            //保存用户
            saveUser();

        }
    });
});

//保存用户
function saveUser() {
    $.ajax({
        type: "post",
        url: "/user/saveUser",
        data: {sysUser: modelUser.getJson()},
        dataType: "json",
        success: function (ar) {
            if (typeof ar != "undefined" && ar.success) {
                rxMsg("保存成功");
                reloadPrevWin();
                closeWin();
            } else {
                layer.alert(ar.msg);
            }
        }
    });
}

//取消
function cancelCheck() {
    if (modelUser.changeValidate()) {
        layer.confirm("页面已修改，确认关闭吗", function (index) {
            layer.close(index);
            closeWin();
        });
        return false;
    }
    return true;
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
    var flag = true;
    var modelTmp;
    $.each(modelUser.get("sysGlbRoleList").models, function (i, t) {
        if (t.get("roleId") == roleId) {
            t.set("sfqy_st", "VALID");
            flag = false;
            modelTmp = t;
            return;
        }
    });
    if (flag) {
        modelTmp = new ModelLinkRole({
            roleId: roleId,
            glId: id,
            roleName: name,
            roleCode: code,
            roleType: type,
            glType: 3,       //3表示用户
            sfqy_st: 'VALID',
            sfyx_st: 'VALID',
            sfgl: 2,   //2不关联
            roleTypeName: typeName
        })
    }
    roleGlbTableView.addNewItem(modelTmp);
}

//机构、岗位变动刷新关系列表
function changeJjRoleList() {
    var pIds = "";
    var oIds = "";
    var models = ssjgTableView.collection.models;
    for (var i = 0, maxLength = models.length; i < maxLength; i++) {
        if (models[i].get("sfyx_st") != "UNVALID") {
            //岗位ID
            var pId = models[i].get("postId");
            var oId = models[i].get("organId");
            if (pId) {
                pIds += pId + ',';
            } else if (oId) {
                oIds += oId + ",";
            }
        }
    }
    var pRoles = getLinkRole("post", pIds);
    var oRoles = getLinkRole("organ", oIds);
    var result = Array.union(pRoles, oRoles);
    roleGlbTableView.render(result);
}


//从机构岗位树中选择机构岗位 render页面
function addOrganPost(jgName, jgId, gwName, gwId) {
    if (checkIsRepet(jgId, gwId)) {
        var models = ssjgTableView.collection.models;
        var flag = true;
        for (var i = 0, maxLength = models.length; i < maxLength; i++) {
            if (models[i].get("sfyx_st") == "VALID") {
                flag = false;
                break;
            }
        }
        if (flag) {
            $.getEle("ModelUser", "defaultOrganId").val(jgId);
            $.getEle("ModelUser", "dftOrganName").val(jgName);
            $(".defOrgan").show();
            modelUser.reRender(userState);
        }
        ssjgTableView.addNewItem(new ModelSSJG({
            organName: jgName,
            organId: jgId,
            postName: gwName,
            postId: gwId,
            sfyx_st: 'VALID'
        }));
        roleGlbTableView.render();
        changeJjRoleList();
    } else {
        if (gwId) {
            rxMsg(RxMsgType.WARNNING,"所选岗位已存在");
        } else {
            rxMsg(RxMsgType.WARNNING,"所选机构已存在");
        }
        return false;
    }
}

//所属机构和上层岗位验重
function checkIsRepet(jgId, gwId) {
    var models = ssjgTableView.collection.models;
    for (var i = 0, maxLength = models.length; i < maxLength; i++) {
        if (gwId == null) {
            if (models[i].get("organId") == jgId && (models[i].get("postId") == null || models[i].get("postId") == "") && models[i].get("sfyx_st") == "VALID") {
                return false;
            }
        } else {
            if (models[i].get("organId") == jgId && models[i].get("postId") == gwId && models[i].get("sfyx_st") == "VALID") {
                return false;
            }
        }
    }
    return true;
}

//获取直接关联的角色ids
function getLinkRoleIds() {
    var models = modelUser.get("userRoleList").models;
    var ids = [];
    for (var i = 0, maxLength = models.length; i < maxLength; i++) {
        if (models[i].get("sfyx_st") != "UNVALID") {
            ids.push(models[i].get("roleId"));
        }
    }
    return ids;
}


//添加用户初始化操作
function addUserInit() {
    var mrjgmc, mrjgid, postName, postId;
    mrjgmc = decode(GetQueryString("organName"));    //默认机构
    mrjgid = GetQueryString("organId");   //默认机构id
    postName = decode(GetQueryString("postName")); //岗位名称
    postId = GetQueryString("postId");          //岗位ID
    if (mrjgid == "undefined" || mrjgid == -1 || !mrjgid) {//初始机构不存在
        mrjgmc = null;
        mrjgid = null;
        postName = null;
        postId = null;
    } else {//初始机构存在
        $(".defOrgan").show();
        modelUser.set("dftOrganName", mrjgmc);
        modelUser.set("defaultOrganId", mrjgid);
        if (postId == "undefined" || !postId) { //初始机构存在，初始岗位不存在
            postName = null;
            postId = null;
        }
        ssjgTableView.addNewItem(new ModelSSJG({
            organName: mrjgmc,
            organId: mrjgid,
            postName: postName,
            postId: postId,
            sfyx_st: 'VALID'
        }));
    }
    if (mrjgid && postId) {
        renderAddRole("post", postId);
    } else if (mrjgid && !postId) {
        renderAddRole("organ", mrjgid);
    } else {
    }
}

/**
 * 从树上新增用户时或添加机构时，展示当前要素已经关联的角色
 * @param type organ 机构
 * @param id
 */
function renderAddRole(type, id) {
    var roles = getLinkRole(type, id);
    $.each(roles, function (i, t) {
        modelUser.get("userRoleList").add(
            new ModelUserRole({
                roleCode: t.ROLE_CODE,
                roleName: t.ROLE_NAME
            })
        );
    });
}
/**
 *
 * @param oIds
 */
function getLinkRole(type, oIds) {
    var roles = [];
    $.ajax({
        url: "/user/getLinkRole?type=" + type + "&ids=" + oIds,
        async: false,
        success: function (ar) {
            if (ar.success) {
                roles = ar.data;
            }
        }
    });
    return roles;
}
