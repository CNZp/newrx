/**
 * 队伍成员信息页面配置
 * dwcyxxEditConfig
 * Created by RXCoder on 2017-4-11 11:12:14
 */
//表单渲染JSON：队伍成员信息
var ModelDemoJson = {
    ModelDemo: {     //demo信息类
        id: {        //主键ID
        },
        num: {
            rules: {checkValue: ["isIntGte"]}
        },
        date: {
            rules: {checkSave: ["notNull"]},
            type: "date",
            dateConfig: {
                dateFmt: "yyyy-MM-dd"
            }
        },
        type: {        // 性别
            rules: {checkSave: ["notNull"]},
            type: "dict",
            dictConfig: {
                dictCode: "MZDEMO"
            }
        },
        sfyx_st: {        //是否有效
            display: false,
            defaultValue: "VALID"
        }
    }
};

//新增状态JSON：用户案例信息
var xzStateJson = {
    ModelDemo: {        //用户案例
        state: {
            disable: []
        }
    }
}

//修改状态JSON：用户案例信息
var xgStateJson = {
    ModelDemo: {        //用户案例信息
        state: {
            disable: []
        }
    }
};

//查看状态JSON：用户案例信息
var ckStateJson = {
    ModelDemo: {        //用户案例信息
        state: {
            enable: []
        }
    }
};
