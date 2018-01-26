/**
 * 队伍成员信息页面配置
 * dwcyxxEditConfig
 * Created by RXCoder on 2017-4-11 11:12:14
 */
//表单渲染JSON：队伍成员信息
var ModelDemoOrganJson = {
    ModelDemoOrgan: {     //队伍成员信息类
        id: {        //主键ID
        },
        organName: {        // 名称
        },
        sfyx_st: {        //是否有效
            display: false,
            defaultValue: "VALID"
        }
    },
    ModelDemoProject: {
        id: {        //主键ID
        },
        projectName: {        // 名称
        },
        projectType:{     //项目类型

        },
        sfyx_st: {        //是否有效
            display: false,
            defaultValue: "VALID"
        }
    }

};

//新增状态JSON：用户案例信息
var xzStateJson = {
    ModelDemoOrgan: {        //用户案例
        state: {
            disable: []
        }
    }
};

//修改状态JSON：用户案例信息
var xgStateJson = {
    ModelDemoOrgan: {        //用户案例信息
        state: {
            disable: []
        }
    }
};

//查看状态JSON：用户案例信息
var ckStateJson = {
    ModelDemoOrgan: {        //用户案例信息
        state: {
            enable: []
        }
    },
    ModelDemoProject:{
        state: {
            enable: []
        }
    }

};

