var modelRuleCollection;
var type = GetQueryString("type");    //标志位
var ModelGlbRoleAuthRule;          //角色给规则关联类
var ruleTableView;                  //规则视图
var roleId = GetQueryString("roleId");
$(function () {
    //初始化尺寸
    resizeForm();
    pageAjax();

    //操作类型标志位
    var type = GetQueryString("type");
    //项目页面跳转配置对象标志

    var stateJson;
    if (type == "xz") {
        stateJson = XzState;
        $("#save").show();
    } else if (type == "xg") {
        stateJson = XzState;
        $("#save").show();
    } else if (type == "ck") {
        stateJson = CkState;
    }

    //角色与权限规则关联
    ModelGlbRoleAuthRule = DetailModel.extend({
        className: "ModelGlbRoleAuthRule",
        initJson: ModelRuleJson,
        stateJson: stateJson,
        state: type,
        setModelName: function () {
            this.set("ModelName", "ModelGlbRoleAuthRule" + (++modelIndex));
        }
    });

    var ModelGlbRoleAuthRuleCollection = Backbone.Collection.extend({
        model: ModelGlbRoleAuthRule
    });

    //获取初值
    var roleList = [];   //供初始化的角色数据对象
    if (roleId) {
        $.ajax({
            type: "get",
            url: "/role/getRuleByRole?roleId=" + roleId + "&random=" + Math.random(),
            async: false,
            success: function (ar) {
                if (ar.success) {
                    roleList = ar.data;
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    }

    //依据初值创建主model实例
    modelRuleCollection = new ModelGlbRoleAuthRuleCollection(roleList);
    //角色渲染

    //规则列表行view
    var RuleTrView = BaseElementView.extend({
        canCheck: false,
        tagName: 'tr',
        className: 'rx-grid-tr',
        renderEditMode: function () {    //实现渲染接口
            var modelRu = this.model,
                modelRuName = modelRu.get("ModelName");
            var html = "";
            html += "<td style='text-align:center'>" + this.index + "</td>";
            html += "<td style='text-align:center'><input type='text' class='i_text' data-property='ruleName' data-model='" + modelRuName + "'/>" + "</td>" +
                "<td style='text-align:center'><input type='text' class='i_text' data-property='ruleXgsj' data-model='" + modelRuName + "'/></td>" +
                "<td style='text-align:center'>";
            if (type != "ck") {
                html += "<a onclick='editRule(\"" + modelRuName + "\"," + modelRu.get("ruleId") + ")' >修改</a>" +
                    "  <a onclick='delRule(\"" + modelRuName + "\")' >删除</a>";
            } else {
                html += "<input type='text' class='i_text' data-property='description' data-model='" + modelRuName + "'/>";
            }
            html += "</td>";
            $(this.el).html(html);
        }
    });

    //创建规则动态列表主体view类
    var RuleTableView = BaseTableView.extend({
        titleType: 0,
        title: "",
        getControlHtml: function () { //实现控制区域渲染接口
            if (this.titleType == 1) {       //系统角色
                this.title = "数据权限规则";
            } else if (this.titleType == 3) {     //业务角色
                this.title = "关联动态规则";
            }
            var controlstr = "<div class='page_title'>" +
                "<h1 class='ruleTitle'>" + this.title + "</h1>";
            if (type != "ck") {
                controlstr += "<ul class='action_button' style='float: right;margin: 0 5px 0 0;'>" +
                    "<li><a class='selRule'>选择规则</a></li>" +
                    "<li><a class='addRule'>新增</a></li>" +
                    "</ul>" +
                    "</div>";
            }
            return controlstr;
        },
        events: {
            'click .selRule': 'selRule',
            'click .addRule': 'addRule',
            'click .deleteItems': 'deleteItems'
        },
        getTheadHtml: function () {  //实现表头区域渲染接口
            var theads = "<thead>";
            theads += "<th style='width:10%'>序号</th>" +
                "<th style='width:40%'>规则名称</th>  " +
                "<th style='width:20%'>修改时间</th>  " +
                "<th>" + (type == "ck" ? "描述" : "操作") + "</th></thead>";
            return theads;
        },
        getNewModel: function () { //实现接口，以关联创建的model
            return new ModelGlbRoleAuthRule();
        },
        getNewTrView: function (item, mode, display, index) {  //实现接口，以关联创建的行view
            return new RuleTrView({
                model: item,
                renderCallback: mode,
                display: display,
                index: index
            });
        },
        selRule: function () {
            var roleType = this.titleType;
            var ruleType;
            if (roleType == 1) {       //系统角色
                ruleType = 1;
            } else if (roleType == 3) {     //业务角色
                ruleType = 2;
            }
            openStack(window, "请选择" + this.title, "medium", "/rule/ruleSelect?func=ruleSelectCallback&ruleType=" + ruleType + "&ids=" + getSeRulelIds());
        },
        addRule: function () {
            var roleType = this.titleType;
            var ruleType;
            if (roleType == 1) {       //系统角色
                ruleType = 1;
            } else if (roleType == 3) {     //业务角色
                ruleType = 2;
            }
            openStack(window, "新增" + this.title, "medium", "/rule/authRuleEdit?type=xz&func=ruleSelectCallback&ruleType=" + ruleType);
        },
        addNewItem: function (model) {
            var view = this;
            view.collection.push(model);
            view.index++;
            $(view.el).children("table").append(
                view.getNewTrView(model, 'renderEditMode', true, view.index).render().el
            );
            model.render();
        }
    });
    //实例规则动态列表主view
    ruleTableView = new RuleTableView({
        collection: modelRuleCollection,
        el: $("#dataRule")
    });
    ruleTableView.titleType = 3; //动态角色
    ruleTableView.render();
    ruleTableView.modelRender();

    //保存
    $("#save").click(function () {
        var jsonArr = [];
        $.each(modelRuleCollection.models,function(i,t){
            var tjson = t.getJson();
            if(tjson){
                jsonArr.push(JSON.parse(t.getJson()));
            }
        })
        $.ajax({
            type: "post",
            url: "/role/saveRoleRule",
            data: {list: JSON.stringify(jsonArr)},
            success: function (ar) {
                if (ar.success) {
                    rxMsg("保存成功");
                    closeWin();
                } else {
                    layer.alert(ar.msg);
                }
            }
        })
    });

});

//选择规则回调函数
function ruleSelectCallback(modelName, id, name, xgsj, description) {
    ruleTableView.addNewItem(new ModelGlbRoleAuthRule({
        roleId: roleId,
        ruleId: id,
        ruleName: name,
        ruleXgsj: xgsj,
        description: description
    }));
}

//获取选中的rule的ids
function getSeRulelIds() {
    var models = ruleTableView.collection.models;
    var ids = [];
    for (var i = 0, modelsLength = models.length; i < modelsLength; i++) {
        if (models[i].get("sfyx_st") != "UNVALID") {
            ids.push(models[i].get("ruleId"));
        }
    }
    return ids;
}

//删除规则
function delRule(modelName) {
    layer.confirm("您确认要删除这条数据", function (index) {
        ruleTableView.collection.get(modelName).set("sfyx_st", "UNVALID");
        ruleTableView.render();
        layer.close(index);
    });
}

//修改规则
function editRule(modelName, id) {
    var roleType = ruleTableView.titleType;
    var ruleType;
    if (roleType == 1) {       //系统角色
        ruleType = 1;
    } else if (roleType == 3) {     //业务角色
        ruleType = 2;
    }
    openStack(window, "修改" + ruleTableView.title, "medium", "/rule/authRuleEdit?type=xg&func=ruleEditCallback&modelName=" + modelName + "&id=" + id);
}

//修改规则回调
function ruleEditCallback(modelName, id, name, xgsj, description) {
    var model = ruleTableView.collection.get(modelName);
    model.updateFromObject({
        ruleName: name,
        ruleXgsj: xgsj,
        description: description
    });
    model.render();
}