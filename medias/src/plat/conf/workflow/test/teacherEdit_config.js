//活动节点渲染json
var ModelTeacherJson = {
    ModelTeacher: {
        id: {   //id
        },
        sfyx_st: {         //是否有效
            defaultValue: "VALID"
        },
        name: {  //名称
            rules: {checkValue: [], checkSave: ["notNull"]},
            maxLength: 50
        },
        qjsc:{
            rules: {checkValue: [], checkSave: ["notNull"]}
        }
    }
};
//新增状态
var xzStateJson = {
    ModelTeacher: {
        state: {
            disable: []
        }
    }
};

//修改状态
var xgStateJson = {
    ModelTeacher: {
        state: {
            disable: []
        }
    }
};

//查看状态
var ckStateJson = {
    ModelTeacher: {
        state: {
            enable: []
        }
    }
};




