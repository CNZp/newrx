var XzState = {
    ModelDataAuth: {
        state: {
            disable: []
        }
    }
};

//查看权限配置
var CkState = {
    ModelDataAuth: {
        state: {
            enable: []
        }
    }
};

//model渲染方案配置
var ModelDataAuthJson = {
    ModelDataAuth: {
        id: {        //主键ID
            display: false
        },
        ztlx: {        // 主体类型
            rules: {checkSave: ["notNull"]},
            type: "dict",
            dictConfig: {
                dictCode: [
                    {code: 2, value: "用户"},
                    {code: 1, value: "角色"}
                ]
            },
            changeFunc: "ztlxChangeFunc",
            ifForm: false
        },
        userId: {                   //用户ID
            display: false
        },
        userName: {                 //用户名称
            display: false,
            type: "layer",
            layerConfig: {
                url: "/user/userSelect?",
                title: "请选择用户",
                callbackFunc: "userCallbackFunc"
            },
            tagName: "选择对象",
            ifForm: false
        },
        roleId: {        //角色ID
            display: false
        },
        roleName: {             //角色名称
            display: false,
            type: "layer",
            layerConfig: {
                url: "/role/roleSelect?roleType=1&",
                title: "请选择角色",
                callbackFunc: "roleCallbackFunc"
            },
            tagName: "选择对象",
            ifForm: false
        },
        objectId: {                  //对象ID
            display: false
        },
        objectName: {                 //对象名称
            rules: {checkSave: ["notNull"]},
            type: "layer",
            layerConfig: {
                url: "/object/objectSelect?",
                title: "请选择对象",
                callbackFunc: "objectCallbackFunc"
            },
            tagName: "选择对象",
            ifForm: false
        },
        qxlx: {        //权限类型
            rules: {checkSave: ["notNull"]},
            type: "dict",
            dictConfig: {
                dictCode: "QXLX"
            }
        },
        pageIds: {         //页面IDS
            display: false
        },
        pageNames: {            //页面名称字符串，以“，”
            type: "layer",
            layerConfig: {
                url: "/page/pageSelect?",
                title: "请选择页面",
                callbackFunc: "pageCallbackFunc"
            },
            tagName: "选择页面",
            ifForm: false
        },
        db_name: {
            display: false,
            ifForm: false
        },
        db_field_name: {
            display: false,
            ifForm: false
        },
        oids: {
            display: false
        },
        sfyx_st: {        //是否有效
            display: false,
            defaultValue: "VALID"
        }
    }
};

var ztlxRoleState = {
    ModelDataAuth: {
        property: {
            userName: {
                rules: {checkSave: []},
                display: false
            },
            roleName: {
                rules: {checkSave: ["notNull"]},
                display: true
            }
        }
    }
};

var ztlxUserState = {
    ModelDataAuth: {
        property: {
            userName: {
                rules: {checkSave: ["notNull"]},
                display: true
            },
            roleName: {
                rules: {checkSave: []},
                display: false
            }
        }
    }
};

var ztlxNoneState = {
    ModelDataAuth: {
        property: {
            userName: {
                rules: {checkSave: []},
                display: false
            },
            roleName: {
                rules: {checkSave: []},
                display: false
            }
        }
    }
};
