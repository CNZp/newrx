//全局对象声明
var modelPerObjAuthList, //个人数据权限查询列表对象
    modelDataAuthList;   //自定义维护数据权限查询列表对象
$(function () {
    //Tab控件的使用渲染 "查询用户数据权限"和 "自定义数据权限" 两个面板
    // 配置items中的cId将div、src将iframe、html将页面html分别载入面板
    new TabPanel({
        renderTo: 'center-tab',
        fullTab: true,
        active: 0,
        items: [
            {id: "tttt1",
                title: "查询用户数据权限",
                cId: "tab1"},
            {title: "自定义数据权限",
                cId: "tab2"}
        ]
    });

    //初始化尺寸
    resizeTable();

    //个人数据权限查询列表主配置
    var ModelPerObjAuthList_Propertys = {
        ModelName: "ModelPerObjAuthList",
        columns: "",
        searchJson: SPerObjAuthJson,
        SearchModelName: "SPerObjAuth",
        url: "/auth/getOraDataAuthList"
    };
    //个人数据权限查询列表对象创建
    modelPerObjAuthList = new BaseGridModel(ModelPerObjAuthList_Propertys);
    //个人数据权限查询列表对象搜索面板生成
    modelPerObjAuthList.buildSearchView();
    //个人数据权限查询列表对象渲染
    modelPerObjAuthList.render();

    //自定义维护数据权限查询列表主配置
    var ModelDataAuthList_Propertys = {
        ModelName: "ModelDataAuthList",
        columns: dataAuthColumns,
        searchJson: SDataAuthJson,
        SearchModelName: "SDataAuth",
        url: "/auth/getPerDataAuthList"
    };
    //自定义维护数据权限查询列表对象创建
    modelDataAuthList = new BaseGridModel(ModelDataAuthList_Propertys);
    //自定义维护数据权限查询列表对象双击事件注册
    modelDataAuthList.set("onRowDblClick", function (rowIndex, rowData) {
        openStack(window, "查看自定义数据权限", "medium", "/dataAuth/dataAuthEdit?type=ck&id=" + rowData.ID);
    });
    //自定义维护数据权限查询列表对象搜索面板生成
    modelDataAuthList.buildSearchView();
    //自定义维护数据权限查询列表对象渲染
    modelDataAuthList.render();

    //页面新增按钮事件
    $("#add").click(function () {
        openStack(window, "新增自定义数据权限", "medium", "/dataAuth/dataAuthEdit?type=xz");
    });

    //页面删除按钮事件
    $("#delete").click(function () {
        var sel = modelDataAuthList.getSelect();//获取选中行的数据
        if (sel == null || sel == undefined || sel[0] == null) {
            layer.alert("请选择一条待删除的数据");
            return;
        } else {
            if (sel[0].SFZDY != "1") {   //个性维护数据，不可删除
                layer.alert("非个性维护数据，不可删除");
                return;
            } else {   //个性维护数据删除确认
                _top.layer.confirm("确定要删除所选记录吗？", function (index) {
                    var ztlx = modelDataAuthList.getSearchModel().get("ztlx");
                    $.ajax({
                        type: "post",
                        url: "/auth/deleteDataAuth?ztlx=" + ztlx + "&id=" +
                            (ztlx == "1" ? sel[0].ZT_ID : sel[0].ID) + "&objId=" + sel[0].OBJID,
                        async: false,
                        success: function (ar) {
                            if (ar.success) {
                                reloadTable();
                                rxMsg(RxMsgType.SUCCESS,"删除成功");
                            } else {
                                layer.alert("删除失败");
                            }
                        }
                    });
                    layer.close(index);
                });
            }
        }
    });
});

//个性维护数据权限列表刷新全局接口
function reloadTable(param) {
    modelDataAuthList.reloadGrid(param);
}

//选择用户弹出层回调
function userCallbackFunc(id, name) {
    modelPerObjAuthList.getSearchModel().setValue("user_id", id);
    modelPerObjAuthList.getSearchModel().setValue("user_name", name);
}

//选择对象弹出层回调
function objectCallbackFunc(id, name, modelName) {
    if (modelName == "SDataAuth") {
        modelDataAuthList.getSearchModel().setValue("object_id", id);
        modelDataAuthList.getSearchModel().setValue("object_name", name);
    } else {
        modelPerObjAuthList.getSearchModel().setValue("object_id", id);
        modelPerObjAuthList.getSearchModel().setValue("object_name", name);
        $.ajax({
            type: "post",
            url: "/object/getObjectFields?objId=" + id,
            async: false,
            success: function (ar) {
                if (ar.success) {
                    if (ar.data && ar.data.length > 0) {
                        modelPerObjAuthList.getSearchModel().setValue("db_name", ar.data[0].DB_NAME);  //处理对象数据表名
                        var field_names = [];   //处理对象数字数据库字段名
                        var objectColumns = [];    //处理个人数据权限查询列表列配置
                        for (var i = 0; i < ar.data.length; i++) {
                            if (ar.data[i].DB_FIELD_NAME) {
                                field_names.push('s.' + ar.data[i].DB_FIELD_NAME);
                                var tname = ar.data[i].DB_FIELD_NAME;
                                objectColumns.push({title: ar.data[i].FIELD_NAME, id: tname ? tname.toString().toUpperCase() : "",
                                    width: '100', align: 'center', renderer: "String"});
                            }
                        }
                        modelPerObjAuthList.getSearchModel().setValue("field_names", field_names.toString());
                        objectColumns.push(
                            {title: '权限类型', id: 'QXLX', width: '100', align: 'center',
                                renderer: "Dict", dictCode: "QXLX"}
                        );
                        objectColumns.push({title: '所属页面', id: 'PAGE_NAMES', width: '100', align: 'center', renderer: "String"});
                    }
                    modelPerObjAuthList.set("columns", objectColumns);
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    }
}

//页面选择弹出层回调
function pageCallbackFunc(id, name, modelName) {
    if (modelName == "SDataAuth") {
        modelDataAuthList.getSearchModel().setValue("page_id", id);
        modelDataAuthList.getSearchModel().setValue("page_name", name);
    } else {
        modelPerObjAuthList.getSearchModel().setValue("page_id", id);
        modelPerObjAuthList.getSearchModel().setValue("page_name", name);
    }
}

//主体类型变更后置处理
function ztlxChangeFunc(model) {
    var oztlx = model.get("ztlx");
    var ztlx = $.getEle("SDataAuth", "ztlx").val();
    if (oztlx != ztlx) {
        model.empty(["zt_id", "zt_name"]);
    }
    if (ztlx == "1") {      //角色
        model.reRender(ztlxRoleState, true);
    } else if (ztlx == "2") {      //用户
        model.reRender(ztlxUserState, true);
    } else {
        model.reRender(ztlxNoneState, true);
    }
}

//主体选择弹出层回调
function ztCallbackFunc(id, name) {
    modelDataAuthList.getSearchModel().setValue("zt_id", id);
    modelDataAuthList.getSearchModel().setValue("zt_name", name);
}