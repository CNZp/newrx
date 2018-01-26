//model渲染方案配置
var ModelMessageJson = {
    ModelMessage: {
        id: {display: false},
        title: {
            rules: {checkSave: ["notNull"]}
        },
        content: {
            rules: {checkSave: ["notNull"]}
        },
        typeCode: {
            rules: {checkSave: ["notNull"]},
            type: "dict",
            dictConfig: {
                ifSearch: true,
                reqInterface: "getMessageType"
            }
        },
        sendUser: {
            rules: {checkSave: ["notNull"]},
            type: "layer",
            layerConfig: {
                url: "/organ/organTree?selectType=sin&kind=ou&",
                style: "tree",
                callbackFunc: "sendUserSelect",
                canDelete: true
            }
        },
        sendUserIds: {},
        sfyx_st: {     //是否有效
            display: false,
            defaultValue: "VALID"
        }
    }
};

//初始状态新增json
var xzStateJson = {
    ModelMessage: {
        state: {
            disable: []
        }
    }
};
//查看
var ckStateJson = {
    ModelMessage: {
        state: {
            enable: []
        }
    }
};
//修改
var xgStateJson = {
    ModelMessage: {
        state: {
            disable: []
        }
    }
};

