//model渲染方案配置
var ModelRuleJson = {
    ModelAuthRule: {
        id: {
            display: false
        },
        qxlx: { //权限类型
            rules: {checkSave: ["notNull"]},
            type: "dict",
            dictConfig: {
                dictCode: "QXLX"
            }
        },
        gzlx: {    //规则类型
            // rules: {checkSave: ["notNull"]},
            // type: "dict",
            // dictConfig: {
            //     dictCode: "GZLX"
            // },
            // changeFunc:"changeGzlx",
            defaultValue:"2"
        },
        pageIds: {  //页面IDs
            display: false
        },
        pageNames: {          //页面names
            type: "layer",
            layerConfig: {     //在类型为数据字典时才有dictConfig
                url: "/page/pageSelect?mulChooseFlag=true&",
                title: "选择所属页面",
                callbackFunc: "pageSelectCallback",
                checkFunc: "checkPageSelect"
            },
            ifForm: false
        },
        objectId: {   //对象类id
            display: false
        },
        objectName: {           //对象名称
            rules: {checkSave: ["notNull"]},
            type: "layer",
            layerConfig: {     //在类型为数据字典时才有dictConfig
                url: "/object/objectSelect?",
                title: "选择关联对象",
                callbackFunc: "objectSelectCallback",
                checkFunc: "checkObjectSelect"
            },
            ifForm: false
        },
        sfyx_st: {     //是否有效
            display: false,
            defaultValue: "VALID"
        }
    },
    ModelRule: {
        id: {        //主键ID
            display: false
        },
        rule_name: {        //规则名称
            rules: {checkSave: ["notNull"]},
            maxLength: 10
        },
        sxfs: {        //实现方式
            rules: {checkSave: ["notNull"]},
            type: "dict",
            dictConfig: {
                dictCode: "GZSXFS"
            },
            changeFunc:"changeSxfs"
        },
        rule_detail: {        //规则实现细节
            rules: {checkSave: ["notNull"]},
            maxLength: 1000
        },
        description: {        //规则描述
            maxLength: 50
        },
        sfyx_st: {        //是否有效
            display: false,
            defaultValue: "VALID"
        }
    }
};


//初始状态新增json
var xzStateJson = {
    ModelAuthRule: {
        state: {
            disable: []
        }
    },
    ModelRule: {
        state: {
            disable: []
        }
    }
};
//查看
var ckStateJson = {
    ModelAuthRule: {
        state: {
            enable: []
        }
    },
    ModelRule: {
        state: {
            enable: []
        }
    }
};
//修改
var xgStateJson = {
    ModelAuthRule: {
        state: {
            disable: []
        }
    },
    ModelRule: {
        state: {
            disable: []
        }
    }
};

