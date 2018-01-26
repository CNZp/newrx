//权限状态配置
//新增权限配置
var XzState = {
    ModelGlbRoleAuthRule: {
        state: {
            enable: []
        }
    }
};

//查看权限配置
var CkState = {
    ModelGlbRoleAuthRule: {
        state: {
            enable: []
        }
    }
};

//model渲染方案配置
var ModelRuleJson = {
    ModelGlbRoleAuthRule: {     //    角色与权限规则关联
        id: {
            display: false
        },
        roleId: {             //角色id
            display: false
        },
        ruleId: {             //规则id
            display: false
        },
        ruleName: {               //规则名称
            ifForm: false
        },
        ruleXgsj: {                  //修改时间
            type: "date",
            ifForm: false
        },
        description: {           //描述
            ifForm: false
        },
        sfyx_st: {              //是否有效
            display: false,
            defaultValue: "VALID"
        }
    }
};

