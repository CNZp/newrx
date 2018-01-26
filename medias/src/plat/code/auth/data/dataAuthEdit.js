//全局类声明
var ModelObjectData,  //对象数据类
    AuthCollection,   //对象数据集合类
    ObjDataTableView;    //对象数据动态列表视图类
//全局对象声明
var modelDataAuth,  //数据权限对象
    objDataTableView;   //对象数据动态列表视图对象
//全局动态参数声明
var ModelObjectDataJson,  //对象数据类字段配置参数
    objectColumns,   //选择对象数据弹出层列表列配置
    objectSearchJson,   //选择对象数据弹出层列表搜索字段配置
    hasSearchItem,  //选择对象是否有搜索项
    objFields,   //对象属性数据库字段名数组
    objFields_CN,    //对象属性中文名数组
    idProperty;    //主键字段数据库名

$(function () {
    //初始化尺寸
    resizeForm();
    pageAjax();

    //操作类型标志位
    var type = GetQueryString("type");
    //依据参数确定选择的状态配置
    var stateJson;
    if (type == "xz") {
        stateJson = XzState;
    } else if (type == "ck") {
        stateJson = CkState;
        $(".w_button_box").hide();
    }

    //数据权限类声明
    var ModelDataAuth = DetailModel.extend({
        className: "ModelDataAuth",
        initJson: ModelDataAuthJson,
        stateJson: stateJson
    });

    //获取主键
    var id = GetQueryString("id");
    //获取数据权限数据对象
    var dataAuth = {};
    if (id) {     //请求数据权限数据
        $.ajax({
            type: "get",
            url: "/auth/getDataAuthById?dataAuthId=" + id + "&random=" + Math.random(),
            async: false,
            dataType: "json",
            success: function (ar) {
                if (ar.success) {
                    dataAuth = ar.data;
                    if (dataAuth.roleId) {    //角色存在，主体为对象
                        dataAuth.ztlx = 1;
                    } else {      //角色不存在，主体为用户
                        dataAuth.ztlx = 2;
                    }
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    }

    //依据初值创建数据权限对象
    modelDataAuth = new ModelDataAuth(dataAuth);
    //数据权限对象渲染
    modelDataAuth.render();

    //选择对象数据动态列表行视图类声明
    var ObjDataTrView = BaseElementView.extend({
        canCheck: true,
        tagName: 'tr',
        className: 'rx-grid-tr',
        renderEditMode: function () {    //动态实现渲染接口
            var html = "";
            html += "<td style='text-align:center'>" + this.index + "</td>";
            if (objFields.length) {      //依据动态字段动态凭借行html
                for (var i = 0; i < objFields.length; i++) {
                    html += "<td style='text-align:center'><input type='text' class='i_text' data-property='" + objFields[i] +
                        "' data-model='" + this.model.get("ModelName") + "'/></td>";
                }
            }
            $(this.el).html(html);
        }
    });

    //选择对象数据动态列表视图类声明
    ObjDataTableView = BaseTableView.extend({
        cols: 1,    //列数
        getControlHtml: function () { //实现控制区域渲染接口
            var ctrlStr = "<div class='page_title'>" +
                "<h1>包含对象数据</h1>";
            if (type == "xz") {
                ctrlStr += "<ul class='action_button' style='float: right;margin: 0 5px 0 0;'>" +
                    "<li><a class='addTrLayerItem'>新增</a></li>" +
                    "<li><a class='deleteItems'>删除</a></li>" +
                    "</ul>";
            }
            ctrlStr += "</div>";
            return ctrlStr;
        },
        getTheadHtml: function () {  //实现表头区域渲染接口
            var theads = "<thead><th style='width:10%'>序号</th>";
            this.cols = 1;
            if (objFields_CN.length) {
                for (var i = 0; i < objFields_CN.length; i++) {
                    theads += "<th>" + objFields_CN[i] + "</th>";
                    this.cols++;
                }
            }
            return theads;
        },
        render: function () {      //主渲染方法
            var view = this;
            this.index = 0;
            $(this.el).empty();
            //渲染控制区域，放入table的caption中
            var x = $(this.el)[0].createCaption();
            x.innerHTML = this.getControlHtml();
            //渲染table的thead部分
            $(this.el).append(view.getTheadHtml());
            var hasTr = false;
            //渲染collection
            if (this.collection != null && this.collection.models != null) {
                $.each(this.collection.models, function (key, model) {
                    if (model.get("sfyx_st") != "UNVALID") {
                        view.index++;
                        hasTr = true;
                        var viewel = view.getNewTrView(model, 'renderEditMode', true, view.index, view).render().el;
                        $(view.el).append(viewel);
                    }
                });
                view.modelRender()
            }
            //没有数据的提示（拥有所有数据的权限）
            if (!hasTr) {
                $(view.el).append("<tr><td style='height:32px;text-align:center;color:blue;font-weight: bold' " +
                    "class='allDataRow' colspan='" + view.cols + "'>未选择对象数据,拥有该对象所有数据的权限</td></tr>");
            }
        },
        getNewModel: function () { //实现接口，以关联创建的model
            return new ModelObjectData();
        },
        getNewTrView: function (item, mode, display, index, parent) {  //实现接口，以关联创建的行view
            //去除没有数据的提示
            var allDataRow = $(".allDataRow", this.el);
            if (allDataRow.length) {
                allDataRow.remove();
            }
            //获取行视图对象
            return new ObjDataTrView({
                model: item,
                renderCallback: mode,
                display: display,
                index: index,
                parentView: parent
            });
        },
        openAddLayer: function () {     //选择数据按钮事件
            var sparam = {columns: objectColumns, searchJson: objectSearchJson,hasSearchItem: hasSearchItem};
            openStack(window, "选择对象数据", "medium", "/object/objectDataSelect?func=objectDataCallbackFunc", sparam);
        }
    });

    //查看状态处理
    if (type == "ck") {
        ztlxChangeFunc(null, true);     //重新渲染主体选择字段
        buildViewByObjId(modelDataAuth.get("objectId"));      //创建选择动态数据列表面板
    }

    //保存按钮事件
    $("#save").click(function () {
        if (modelDataAuth.ruleValidate()) {
            getOidsByCollection();
            $.ajax({type: "post",
                url: "/auth/saveDataAuth",
                data: {sysDataAuth: modelDataAuth.getJson()},
                async:false,
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        rxMsg("保存成功");
                        reloadPrevWin();
                        closeWin();
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        }
    });
});

function saveFunc() {

}

////取消
//function cancelCheck() {
//    if (modelDataAuth.changeValidate()) {
//        layer.confirm("页面已修改，确认关闭吗", function (index) {
//            layer.close(index);
//            closeWin();
//        });
//        return false;
//    }
//    return true;
//}

//主体类型变更后置
function ztlxChangeFunc(model, first) {
    var ztlx;    //实际值
    var oztlx = modelDataAuth.get("ztlx");  //原始值
    if (first) {       //ck状态初次渲染
        ztlx = oztlx;
    } else {
        ztlx = $.getEle("ModelDataAuth", "ztlx").val();
        if (oztlx != ztlx) {      //值未变更
            modelDataAuth.empty(["roleId", "roleName", "userId", "userName"]);
        }
    }
    if (ztlx == "1") {      //角色
        modelDataAuth.reRender(ztlxRoleState, true);
    } else if (ztlx == "2") {      //用户
        modelDataAuth.reRender(ztlxUserState, true);
    } else {       //未选择
        modelDataAuth.reRender(ztlxNoneState, true);
    }
}

//角色主体选择回调
function roleCallbackFunc(id, name) {
    //先判断角色下有无用户
    $.ajax({
        type: "get",
        url: "/role/checkRoleHasUser?roleId=" + id + "&r=" + Math.random(),
        dataType: "json",
        success: function (ar) {
            if (ar.success) {
                if (ar.data) {
                    modelDataAuth.setValue("roleId", id);
                    modelDataAuth.setValue("roleName", name);
                } else {
                    modelDataAuth.setValue("roleId", "");
                    modelDataAuth.setValue("roleName", "");
                    layer.alert("角色下无关联人员，请重新选择");
                }
            } else {
                layer.alert(ar.msg);
            }
        }
    })

}

//用户主体选择回调
function userCallbackFunc(id, name) {
    modelDataAuth.setValue("userId", id);
    modelDataAuth.setValue("userName", name);
}

//对象主体选择回调
function objectCallbackFunc(id, name) {
    modelDataAuth.setValue("objectId", id);
    modelDataAuth.setValue("objectName", name);
    buildViewByObjId(id);
}

//页面选择回调
function pageCallbackFunc(id, name) {
    modelDataAuth.setValue("pageIds", id);
    modelDataAuth.setValue("pageNames", name);
}

//使用对象id，获取对象相关数据，渲染对象选择数据动态面板方法
function buildViewByObjId(id) {
    $.ajax({
        type: "post",
        url: "/object/getObjectFields?objId=" + id,
        async: false,
        success: function (ar) {
            if (ar.success) {
                objFields = [];
                objFields_CN = [];
                if (ar.data && ar.data.length > 0) {
                    modelDataAuth.setValue("db_name", ar.data[0].DB_NAME);
                    var field_names = [];
                    var search_field_names = [];
                    objectColumns = [];
                    idProperty = "";
                    objectSearchJson = {SObjectData: {}};
                    hasSearchItem = false;
                    ModelObjectDataJson = {ModelObjectData: {sfyx_st: {display: false, defaultValue: "VALID"}}};
                    for (var i = 0; i < ar.data.length; i++) {
                        if (ar.data[i].DB_FIELD_NAME) {
                            if (ar.data[i].FIELD_TYPE == 1) {
                                idProperty = ar.data[i].DB_FIELD_NAME;
                            }
                            objFields.push(ar.data[i].DB_FIELD_NAME);
                            objFields_CN.push(ar.data[i].FIELD_NAME);
                            var tname = ar.data[i].DB_FIELD_NAME;
                            ModelObjectDataJson.ModelObjectData[ar.data[i].DB_FIELD_NAME] = {disabled: true};
                            objectColumns.push({title: ar.data[i].FIELD_NAME, id: tname ? tname.toString().toUpperCase() : "",
                                width: '100', align: 'center', renderer: "String"});
                            if (ar.data[i].FIELD_TYPE == 3) {
                                hasSearchItem = true;
                                search_field_names.push(ar.data[i].DB_FIELD_NAME);
                                objectSearchJson.SObjectData[ar.data[i].DB_FIELD_NAME] = {tagName: ar.data[i].FIELD_NAME};
                            }

                        }
                    }
                    modelDataAuth.setValue("db_field_name", objFields.toString());
                    objectSearchJson.SObjectData.db_field_name = {
                        display: false,
                        defaultValue: modelDataAuth.get("db_field_name")
                    };
                    objectSearchJson.SObjectData.db_name = {
                        display: false,
                        defaultValue: modelDataAuth.get("db_name")
                    };
                    objectSearchJson.SObjectData.condition_name = {
                        display: false,
                        defaultValue: search_field_names.toString()
                    };
                    buildObjectDataList();
                }
            } else {
                _top.layer.alert(ar.msg);
            }
        }
    });
}

//创建动态对象数据动态列表视图方法
function buildObjectDataList() {
    if (objDataTableView) {
        objDataTableView.remove();
    }
    if (objFields.length == 0) {
        layer.alert("所选对象无有效属性");
        return false;
    }

    //动态创建对象数据类
    ModelObjectData = DetailModel.extend({
        className: "ModelObjectData",
        initJson: ModelObjectDataJson,
        setModelName: function () {
            this.set("ModelName", "ModelObjectData" + (++modelIndex));
        }
    });

    //动态创建对象数据集合类
    AuthCollection = Backbone.Collection.extend({
        model: ModelObjectData
    });

    //创建对象数据集合对象
    getCollectionByOids();

    //实例动态选择对象数据视图
    var tEl = $("<table class='form'></table>");
    $("#objDataList").append(tEl);
    objDataTableView = new ObjDataTableView({
        collection: authCollection,
        el: tEl
    });
    objDataTableView.render();
}

//动态面板对象数据选择回调
function objectDataCallbackFunc(sel) {
    for (var i = 0; i < sel.length; i++) {
        var inTag = false;
        if (idProperty && authCollection) {
            $.each(authCollection.models, function (index, model) {
                if (model.get("sfyx_st") != "UNVALID" && model.get(idProperty) == sel[i][idProperty]) {
                    inTag = true;
                }
            })
        }
        if (!inTag) {
            objDataTableView.addSelItem(new ModelObjectData(sel[i]));
        }
    }
}

//使用动态对象数据集合获取对象oids
function getOidsByCollection() {
    if (authCollection) {
        var oids = [];
        $.each(authCollection.models, function (index, model) {
            if (idProperty && model.get("sfyx_st") != "UNVALID" && model.get(idProperty)) {
                oids.push(model.get(idProperty));
            }
        });
        modelDataAuth.setValue("oids", oids.toString());
    }
}

//创建对象数据集合对象（如有oids，则请求已有对象数据）
function getCollectionByOids() {
    var datas;
    if (modelDataAuth.get("oids")) {
        $.ajax({
            type: "post",
            url: "/object/getObjectData",
            data: {
                dbName: modelDataAuth.get("db_name"),
                dbFields: modelDataAuth.get("db_field_name"),
                oids: modelDataAuth.get("oids")
            },
            async: false,
            dataType: "json",
            success: function (ar) {
                datas = ar.data;
            }
        });
    }
    authCollection = new AuthCollection(datas);
}