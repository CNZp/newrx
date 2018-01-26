//model渲染方案配置
var ModelPostJson = {
    ModelPost: {
        id: {display: false},
        basePostId: {},
        organId: {},
        actualPostName:{}
    },
    ModelGlbRole: {
        id: {display: false},
        roleId: { //角色ID
        },
        glId: { //关联ID
        },
        glType: {//关联类型
            defaultValue: "4"
        },
        sfyx_st: {     //是否有效
            display: false,
            defaultValue: "VALID"
        },
        sfqy_st: {     //是否启用
            display: false,
            defaultValue: "VALID"
        }
    },
    ModelPostRole: {
        roleName: {},
        roleCode: {}
    }
};

//初始状态新增json
var xzStateJson = {
    ModelPost: {
        state: {
            disable: []
        }
    }
};
//查看
var ckStateJson = {
    ModelPost: {
        state: {
            enable: []
        }
    }
};
//修改
var xgStateJson = {
    ModelPost: {
        state: {
            enable: []
            // disable: ["actualPostName"]
        }
    }
};

