//权限状态配置
//新增权限配置
var XzState = {
    ModelUser: {
        state: {
            disable: []
        }
    },
    ModelSSJG: {
        state: {
            disable: ["organName"]
        }
    },
    ModelLinkRole: {
        state: {
            enable: []
        }
    }
};
//修改权限配置
var XgState = {
    ModelUser: {
        state: {
            disable: []
        }
    },
    ModelSSJG: {
        state: {
            disable: ["organName"]
        }
    },
    ModelLinkRole: {
        state: {
            enable: []
        }
    }
};

var CkState = {
    ModelUser: {
        state: {
            enable: []
        }
    },
    ModelSSJG: {
        state: {
            enable: []
        }
    },
    ModelLinkRole: {
        state: {
            enable: []
        }
    }
};
//model渲染方案配置
var ModelUserJson = {
    ModelUser: {
        id: {        //主键ID
            display: false
        },
        loginName: {        //登录名
            // rules: {checkValue:["checkLoginPwd"],checkSave: ["notNull","checkLoginPwd"]},
            rules: {checkValue: ["isCode"], checkSave: ["notNull"]},
            maxLength: 25
        },
        loginPwd: {        //登录密码
            rules: {checkValue: ["checkLoginPwd"], checkSave: ["notNull"]},
            maxLength: 64
        },
        userName: {        //用户名
            rules: {checkSave: ["notNull"]},
            maxLength: 50
        },
        is_Blocked: {    //是否封锁
            defaultValue: "0"
        },
        sex: {        //性别
            rules: {checkSave: ["notNull"]},
            type: "dict",
            dictConfig: {
                dictCode: "XB",
                checkType: "radio"
            },
            defaultValue:'1'
        },

        dftOrganName: {        //默认机构
            disabled: true,
            ifForm: true
        },
        defaultOrganId: {        //默认机构ID
            display: false
        },
        sfyx_st: {        //是否有效
            display: false,
            defaultValue: "VALID"
        }
    },
    ModelSSJG: {       //所属机构model
        id: {        //主键ID
            display: false
        },
        userId: {        //用户ID
            display: false
        },
        postId: {        //岗位ID
            display: false
        },
        organId: {        //机构ID
            display: false
        },
        organName: {        //机构名称
            ifForm: false
        },
        postName: {        //岗位名称
            ifForm: false
        },
        sfyx_st: {        //是否有效
            display: false,
            defaultValue: "VALID"
        }
    },
    ModelLinkRole: {
        id: {               //主键ID
            display: false
        },
        roleId: {           //角色id
            display: false
        },
        roleName: {        //角色名称
            ifForm: false
        },
        roleCode: {        //角色编码
            ifForm: false
        },
        roleType: {        //角色类型，
            ifForm: false
        },
        glId: {                //关联id
            display: false
        },
        glType: {             //关联类型，3：用户，1：岗位，2：机构
            display: false
        },
        roleTypeName: {     //role_type名称
            ifForm: false
        },
        sfqy_st: {           //是否启用
            display: false,
            defaultValue: "VALID"
        },
        sfgl: {               //是否关联
            ifForm: false,
            display: false
        },
        notShowTag: {         //不显示标志
            ifForm: false,
            display: false
        },
        sfyx_st: {           //是否有效
            display: false,
            defaultValue: "VALID"
        }
    },
    ModelUserRole: {
        roleCode: {},
        roleName: {}
    }
};

var userState = {
    ModelUser: {
        property: {
            dftOrganName: {}
        }
    }
};
