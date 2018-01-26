//model渲染方案配置
var ModelResourceJson = {
    ModelResource: {
        id: {display: false},
        name: {rules: {checkSave: ["notNull"]}},
        code: {rules: {checkSave: ["notNull"]}},
        type: {defaultValue:resourceType},
        parentId:{},
        parentName:{
            type:"layer",
            layerConfig: {
                url: "/resource/resourceTreeSelect?id="+(GetQueryString("id") || "")+"&resourceType="+config.parent+"&",
                title: "选择上级资源",
                callbackFunc: "selectParentCallback",
                style: "tree",
                canDelete:true
            },
            changeFunc:"emptyParent",
            ifForm: false
        },
        parentType:{},
        url:{
             maxLength: 50
        },
        targetId:{},
        targetName:{
            disabled:true
        },
        icon:{
        },
        bizType:{
            type:"dict",
            dictConfig:{
                dictCode:config.bizdict
            }
        },
        description:{maxLength:100},
        sfyx_st: {     //是否有效
            display: false,
            defaultValue: "VALID"
        }
    }
};

if(config.iconpath){
    var url = config.iconpath;
    if(url.indexOf("?") > -1){
        url += "&";
    }else{
        url += "?";
    }
    ModelResourceJson.ModelResource.icon = {
        type:"layer",
        layerConfig:{
            url:url,
            title: "选择图标",
            callbackFunc: "selectIconCallback",
            style: "medium",
            canDelete:true
        }
    }
}

if(config.urlselect){
    var url = config.urlselect;
    if(url.indexOf("?") > -1){
        url += "&";
    }else{
        url += "?";
    }
    ModelResourceJson.ModelResource.url = {
        type: "layer",
        layerConfig: {
            canInput: true,
            title: "选择地址",
            style: "medium",
            url: url,
            checkFunc: "urlCheck",
            callbackFunc: "urlSelectCallback",
            canDelete: true
        },
        changeFunc:"urlChangeCallback"
    };
}

//初始状态新增json
var xzStateJson = {
    ModelResource: {
        state: {
            disable: []
        }
    }
};
//查看
var ckStateJson = {
    ModelResource: {
        state: {
            enable: []
        }
    }
};
//修改
var xgStateJson = {
    ModelResource: {
        state: {
            disable: []
        }
    }
};

