var ModelResource;
var modelResource;
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
    ModelResource = DetailModel.extend({
        className: "ModelResource",
        initJson: ModelResourceJson,
        stateJson: stateJson
    });
    var id = GetQueryString("id");
    if (id) {
        $.ajax({
            type: "get",
            url: "/resource/getResourceById?id=" + id + "&r=" + Math.random(),
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

    $("#save").click(function () {
        if (modelResource.ruleValidate()) {
            $.ajax({
                type: "post",
                url: "/resource/saveResource",
                data: {resource: modelResource.getJson()},
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        reloadPrevWin();
                        var reloadTree = getPrevWin(1).createResourceTree;
                        if (reloadTree && typeof reloadTree === "function") {
                            reloadTree();
                        }
                        closeAllWin();
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
    if(data && data.targetName){
        $("#targetNameTr").show();
    }
    var parentId = GetQueryString("parentId");
    if (!data && parentId) {
        data = {
            parentId: parentId,
            parentName: decode(GetQueryString("parentName")),
            parentType: GetQueryString("parentType")
        };
    }
    if (resourceType) {
        $("#title").text(getTypeName(resourceType) + "基本信息");
    }
    if (data && data.parentType) {
        data.parentName += " (" + getTypeName(data.parentType) + ")";
    }
    modelResource = new ModelResource(data);
    modelResource.render();
}

function selectParentCallback(id, name, type) {
    modelResource.setValue("parentId", id);
    modelResource.setValue("parentName", name + " (" + getTypeName(type) + ")");
    modelResource.setValue("parentType", type);

}

function emptyParent(model) {
    if (!$.getEle("ModelResource", "parentName").val()) {
        modelResource.setValue("parentId", "");
        modelResource.setValue("parentName", "");
        modelResource.setValue("parentType", "");
    }
}

function getTypeName(code) {
    var name = "";
    $.each(resourceDict, function (i, t) {
        if (t.code == code) {
            name = t.value;
            return false;
        }
    });
    return name;
}

function selectIconCallback(url) {
    modelResource.setValue("icon", url);
}

function urlSelectCallback(modelName, id, name, url) {
    $("#targetNameTr").show();
    modelResource.setValue("targetId",id);
    modelResource.setValue("targetName",name);
    modelResource.setValue("url",url);
}

function urlChangeCallback(model){
    $("#targetNameTr").hide();
    model.setValue("targetId","");
    model.setValue("targetName","");
}

function urlCheck(model){
    var id = model.get("id");
    if(id){
        return "&parentId="+id;
    }else{
        rxMsg(RxMsgType.WARNNING,"新增资源无法选择URL");
        return false;
    }
}
