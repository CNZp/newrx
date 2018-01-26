//权限状态配置
//新增权限配置
var XzState = {
    ModelRole: {
        state: {
            disable: []
        }
    }
};

//查看权限配置
var CkState = {
    ModelRole: {
        state: {
            enable: []
        }
    }
};

//model渲染方案配置
var ModelRoleJson = {
    ModelRole: {
        id: {        //主键ID
            display: false
        },

        roleName: {        //角色名称
            rules: {checkSave: ["notNull"]},
            maxLength: 25
        },
        roleCode: {        //角色编码
            rules: {checkKeyup: ["isCode"], checkSave: ["notNull"]},
            maxLength: 10
        },
        description: {},
        roleType: {        //角色类型
            rules: {checkSave: ["notNull"]},
            type: "dict",
            // defaultValue:1,
            dictConfig: {
                dictCode: "JSLX"
            }
        },
        levels: {        //角色级别
            rules: {checkSave: ["notNull"]},
            type: "dict",
            defaultValue: 3,
            dictConfig: {
                dictCode: "SYSLEVEL"
            }
        },
        roleMade: { //角色组成类型
            rules: {checkSave: ["notNull"]},
            type: "dict",
            dictConfig: {
                dictCode: "JSZCLX"
            },
            defaultValue: 1
        },
        authType: {     //数据规则类型
            type: "dict",
            dictConfig: {
                dictCode: "SJQXLX"
            }
        },
        sfyx_st: {        //是否有效
            display: false,
            defaultValue: "VALID"
        }
    }
};