var func = GetQueryString("func");
var id = GetQueryString("id");
var isNewOrgan = GetQueryString("isNewOrgan");  //是否可以将下级数据移到指定节点
$(function () {
    resizeForm();
    if (isNewOrgan) {
        $("#selPosition").show();
    }
    var data = winData(window, "param");
    var stateJson = CkState;
    //机构
    if (data.organ && data.organ.length) {
        var ModelOrgan = DetailModel.extend({
            className: "ModelOrgan",
            initJson: ModelOrganJson,
            stateJson: stateJson,
            setModelName: function () {
                this.set("ModelName", "ModelOrgan" + (++modelIndex));
            }
        });
        var OrganCollection = Backbone.Collection.extend({
            model: ModelOrgan
        });
        var organColl = new OrganCollection(data.organ);
        var trNames = [
            {name: "MC"},
            {name: "ORGAN_CODE"},
            {name: "QC"},
            {name: "SFYX_ST", type: "Boolean"}
        ];
        var title = "下级机构";
        var colums = [{name: "机构名称", width: "20%"}, {name: "代码", width: "20%"}, {
            name: "全称",
            width: "40%"
        }];
        var pos = "organList";
        getView(trNames, title, colums, organColl, pos);
    }
    //岗位
    if (data.post && data.post.length) {
        var ModelPost = DetailModel.extend({
            className: "ModelPost",
            initJson: ModelPostJson,
            stateJson: stateJson,
            setModelName: function () {
                this.set("ModelName", "ModelPost" + (++modelIndex));
            }
        });
        var PostCollection = Backbone.Collection.extend({
            model: ModelPost
        });
        var postColl = new PostCollection(data.post);
        var trPostNames = [
            {name: "MC"},
            {name: "PARENT_POSTNAME"},
            {name: "SFYX_ST", type: "Boolean"}
        ];
        var postTitle = "岗位";
        var postColums = [{name: "岗位名称", width: "40%"}, {name: "上层岗位", width: "40%"}];
        var postPos = "postList";
        getView(trPostNames, postTitle, postColums, postColl, postPos);
    }
    //用户
    if (data.user && data.user.length) {
        var ModelUser = DetailModel.extend({
            className: "ModelUser",
            initJson: ModelUserJson,
            stateJson: stateJson,
            setModelName: function () {
                this.set("ModelName", "ModelUser" + (++modelIndex));
            }
        });
        var UserCollection = Backbone.Collection.extend({
            model: ModelUser
        });
        var userColl = new UserCollection(data.user);
        var trUserNames = [
            {name: "MC"},
            {name: "LOGIN_NAME"},
            {name: "SFYX_ST", type: "Boolean"}
        ];
        var userTitle = "用户";
        var userColums = [{name: "用户名称", width: "40%"}, {name: "用户账号", width: "40%"}];
        var userPos = "userList";
        getView(trUserNames, userTitle, userColums, userColl, userPos);
    }
    //角色
    if (data.role && data.role.length) {
        var ModelRole = DetailModel.extend({
            className: "ModelRole",
            initJson: ModelRoleJson,
            stateJson: stateJson,
            setModelName: function () {
                this.set("ModelName", "ModelRole" + (++modelIndex));
            }
        });
        var RoleCollection = Backbone.Collection.extend({
            model: ModelRole
        });
        var roleColl = new RoleCollection(data.role);
        var trRoleNames = [
            {name: "ROLE_NAME"},
            {name: "ROLE_CODE"},
            {name: "ROLETYPE_NAME"}

        ];
        var roleTitle = "角色";
        var roleColums = [{name: "角色名称", width: "30%"}, {name: "角色编码", width: "30%"}, {
            name: "角色类型",
            width: "20%"
        }];
        var rolePos = "roleList";
        getView(trRoleNames, roleTitle, roleColums, roleColl, rolePos);
    }
    $("#yes").click(function () {
        var evalFunc = eval("getPrevWin()." + func);
        var newOrganId = $("#selOrganId").val();
        if(!newOrganId||newOrganId===""){
            $("#selOrganId").parent().makeTip($("#selOrganId").parent(), "不可为空");
            return;
        }
        var result = evalFunc(id, newOrganId);
        if (result || typeof(result) == "undefined") {
            closeWin();
        }
    });
    $("#selOrganName").click(function () {
        openStack(window, "移除的位置", "tree", "/tree/getTree?treeType=1&hasTop=true&filterId=" + id + "&filterLx=jg&func=selPositionCallback");
    });
});

//选择移除到指定的位置 回调函数
function selPositionCallback(modelName, name, id) {
    $("#selOrganId").parent().removeErrorTip();
    $("#selOrganName").val(name);
    $("#selOrganId").val(id);
}

/*
 *  动态列表展示公共函数
 *  trNames：需渲染的字段对象数组，对象属性有name（需渲染的字段，与model配置对应）
 *      和type（渲染类型，不填或“normal”表示直接渲染值，“Boolean”表示将“0”转化为“×”，大于“0”转化为“√”），
 *  title:表格区域名称
 *  colums：表头名称数组
 *  data：数据集合 （collection）
 *  pos:放置的位置
 * */
function getView(trNames, title, colums, data, pos) {
    var TempTrView = BaseElementView.extend({
        canCheck: false,
        tagName: 'tr',
        className: 'rx-grid-tr',
        renderEditMode: function () {    //实现渲染接口
            var view = this;
            var html = "";
            html += "<td style='text-align:center'>" + this.index + "</td>";
            for (var i = 0, trNamesLength = trNames.length; i < trNamesLength; i++) {
                if (!trNames[i].type || trNames[i].type == "normal") {
                    html += "<td style='text-align:center' ><input type='text' class='i_text' data-property='" + trNames[i].name + "' data-model='" + this.model.get("ModelName") + "'/>" + "</td>";
                }
            }
            $(this.el).html(html);
        }
    });
    //创建动态列表主体view类
    var TempTableView = BaseTableView.extend({
        getControlHtml: function () { //实现控制区域渲染接口
            var controlstr = "<div class='page_title'>" +
                "<h1>" + title + "</h1></div>";
            return controlstr;
        },
        getTheadHtml: function () {  //实现表头区域渲染接口
            var theads = "<thead><th style='width:10%'>序号</th>";
            for (var i = 0, columLength = colums.length; i < columLength; i++) {
                theads += "<th style='width:" + colums[i].width + "'>" + colums[i].name + "</th>";
            }
            theads += "</thead>";
            return theads;
        },
        getNewTrView: function (item, mode, display, index, parent) {  //实现接口，以关联创建的行view
            return new TempTrView({
                model: item,
                renderCallback: mode,
                display: display,
                index: index,
                parentView: parent
            });
        }
    });
    //实例动态列表主view
    var tempTableView = new TempTableView({
        collection: data,
        el: $("#" + pos + "")
    });
    tempTableView.render();
}
