//权限状态配置
//新增权限配置
var XzState = {
    Modelfj: {
        state: {
            enable: ['fj_id']
        }
    }
};
//查看权限配置
var CkState = {
    Modelfj: {
        state: {
            enable: []
        }
    }
};

//model渲染方案配置
var ModelfjJson = {
    Modelfj: {
        id: {        //主键ID
            display: false
        },
        sfyx_st: {    //是否有效
            display: false,
            defaultValue: "VALID"
        },
        fj_id: {        //附件id
            type: "file",
            fileConfig: {     //在类型为file时才有fileConfig
                type: "table",
                listName: "资料附件上传"
            }
        }
    }
};