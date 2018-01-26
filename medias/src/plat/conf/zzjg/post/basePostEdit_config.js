//model渲染方案配置
var ModelBasePostJson = {
    ModelBasePost: {
        id: {display: false},
        basePostName: { //基础岗位名称
            rules: {checkSave: ["notNull"]}
        },
        basePostCode: { //基础岗位CODE
            rules: {checkSave: ["notNull"]}
        },
        // isWhole: {
        //     defaultValue: 1
        // },
        sort: {//排序
            rules: {checkSave: ["isIntGtZero"]}
        },
        description: {//描述
        },
        sfyx_st: {     //是否有效
            display: false,
            defaultValue: "VALID"
        }
    },
    ModelLinkOrgan: {
        id: {display: false},
        organId: {},
        postName: {},
        sfyx_st: {     //是否有效
            display: false,
            defaultValue: "VALID"
        }
    },
    ModelLinkRole: {
        id: {display: false},
        roleId: { //角色ID
        },
        glType: {//关联类型
            defaultValue: "1"
        },
        sfyx_st: {     //是否有效
            display: false,
            defaultValue: "VALID"
        },
        sfqy_st: {     //是否启用
            display: false,
            defaultValue: "VALID"
        }
    }
};

//初始状态新增json
var xzStateJson = {
    ModelBasePost: {
        state: {
            disable: []
        }
    }
};
//查看
var ckStateJson = {
    ModelBasePost: {
        state: {
            enable: []
        }
    }
};
//修改
var xgStateJson = {
    ModelBasePost: {
        state: {
            disable: []
        }
    }
};

