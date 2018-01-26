var SPerObjAuthJson = {
    SPerObjAuth: {
        user_id: {
            canClear: true,
            display: false
        },
        user_name: {
            rules: {checkSave: ["notNull"]},
            type: "layer",
            layerConfig: {
                url: "/user/userSelect?",
                title: "请选择用户",
                callbackFunc: "userCallbackFunc"
            },
            tagName: "选择用户",
            canClear: true,
            ifForm: false
        },
        object_id: {
            canClear: true,
            display: false
        },
        object_name: {
            rules: {checkSave: ["notNull"]},
            type: "layer",
            layerConfig: {
                url: "/object/objectSelect?",
                title: "请选择对象",
                callbackFunc: "objectCallbackFunc"
            },
            tagName: "选择对象",
            canClear: true,
            ifForm: false
        },
        page_id: {
            canClear: true,
            display: false
        },
        page_name: {
            type: "layer",
            layerConfig: {
                url: "/page/pageSelect?",
                title: "请选择页面",
                callbackFunc: "pageCallbackFunc"
            },
            canClear: true,
            tagName: "选择页面",
            ifForm: false
        },
        db_name: {
            canClear: true,
            display: false
        },
        field_names: {
            canClear: true,
            display: false
        }
    }
};

var SDataAuthJson = {
    SDataAuth: {
        ztlx: {
            rules: {checkSave: ["notNull"]},
            type: "dict",
            dictConfig: {
                dictCode: [
                    {code: 2, value: "用户"},
                    {code: 1, value: "角色"}
                ]
            },
            defaultValue: 2,
            tagName: "主体类型",
            canClear: true,
            changeFunc: "ztlxChangeFunc"
        },
        zt_id: {
            canClear: true,
            display: false
        },
        zt_name: {
            type: "layer",
            layerConfig: {
                url: "/user/userSelect?",
                title: "请选择主体",
                callbackFunc: "ztCallbackFunc"
            },
            tagName: "选择主体",
            canClear: true,
            ifForm: false
        },
        object_id: {
            canClear: true,
            display: false
        },
        object_name: {
            type: "layer",
            layerConfig: {
                url: "/object/objectSelect?",
                title: "请选择对象",
                callbackFunc: "objectCallbackFunc"
            },
            tagName: "选择对象",
            canClear: true,
            ifForm: false
        },
        page_id: {
            canClear: true,
            display: false
        },
        page_name: {
            type: "layer",
            layerConfig: {
                url: "/page/pageSelect?",
                title: "请选择页面",
                callbackFunc: "pageCallbackFunc"
            },
            tagName: "选择页面",
            canClear: true,
            ifForm: false
        }
    }
};


var dataAuthColumns = [
    {title: '主体名称', id: 'ZT_NAME', width: '100', align: 'center', renderer: "String"},
    {title: '对象名称', id: 'OBJ_NAME', width: '100', align: 'center', renderer: "String"},
    {title: '数据范围', id: 'SJFW', width: '100', align: 'center', renderer: "String"},
    {title: '权限类型', id: 'QXLX', width: '100', align: 'center', renderer: "Dict", dictCode: "QXLX"},
    {title: '所属页面', id: 'PAGE_NAME', width: '100', align: 'center', renderer: "String", replaceNull: true},
    {title: '是否自定义', id: 'SFZDY', width: '100', align: 'center', renderer: "Boolean"}
];


var ztlxRoleState = {
    SDataAuth: {
        property: {
            zt_name: {
                disabled: false,
                layerConfig: {
                    url: "/role/roleSelect?"
                },
                canClear: true
            }
        }
    }
};

var ztlxUserState = {
    SDataAuth: {
        property: {
            zt_name: {
                disabled: false,
                layerConfig: {
                    url: "/user/userSelect?"
                },
                canClear: true
            }
        }
    }
};

var ztlxNoneState = {
    SDataAuth: {
        property: {
            zt_name: {
                disabled: true,
                canClear: true
            }
        }
    }
};
