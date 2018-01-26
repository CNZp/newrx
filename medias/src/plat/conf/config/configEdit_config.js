//model渲染方案配置
var type = GetQueryString("type");
var ModelConfigJson = {
    ModelConfig: {
        id: {display: false},
        name: {rules: {checkSave: ["notNull"]}},
        code: {rules: {checkSave: ["notNull"]}},
        levels: {
            rules: {checkSave: ["notNull"]},
            type: "dict",
            dictConfig: {
                dictCode: "CONFIGLEVEL",
                pcode:type=="ck"?null:(roleLevel=="1"?null:roleLevel),
                showPlsSelect:false
            },
            changeFunc:"levelChange",
            defaultValue:roleLevel
        },
        bizType: {   
            rules: {checkSave: ["notNull"]},
            type: "dict",
            dictConfig: {
                dictCode: "CONFIGTYPE",
                dependence:"levels"
            }
        },
        appId:{},
        appName:{
            rules: {checkSave: ["notNull"]},
            type:"layer",
            layerConfig: {
                url: "/resource/resourceSelect?resourceType=app&",
                title: "选择应用",
                callbackFunc: "selectAppCallback",
                style: "medium",
                canDelete:true
            },
            ifForm: false
        },
        value: {},
        description:{maxLength:100},
        sfyx_st: {     //是否有效
            display: false,
            defaultValue: "VALID"
        }
    }
};

//初始状态新增json
var xzStateJson = {
    ModelConfig: {
        state: {
            disable: []
        }
    }
};
//查看
var ckStateJson = {
    ModelConfig: {
        state: {
            enable: []
        }
    }
};
//修改
var xgStateJson = {
    ModelConfig: {
        state: {
            disable: []
        }
    }
};

