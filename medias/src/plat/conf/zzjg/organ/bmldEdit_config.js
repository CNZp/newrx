//model渲染方案配置
var ModelOrganLeaderJson = {
    ModelOrganLeader: {
        id: {   //主键ID
            display: false
        },

        organ_id: {  //机构ID
            display: false
        },

        user_id: {  //用户ID
            display: false
        },

        user_name: {   //用户
            rules: {checkSave: ["notNull"]},
            type: "layer",
            layerConfig: {
                url: "/tree/getTree?treeType=4&selectType=ry&",
                title: "选择部门领导",
                callbackFunc: "bmldSelectCallback",
                style: "tree",
                canDelete: true
            },
            changeFunc: "emptyBmld"
        },

        sort_no: {  //排序号
            rules: {checkKeyup: ["isIntGte"], checkSave: ["notNull"]},
            maxLength: 3
        },

        type_no: {  //类型
            display: false
        },

        sfyx_st: {  //是否有效
            display: false,
            defaultValue: "VALID"
        }
    }
};