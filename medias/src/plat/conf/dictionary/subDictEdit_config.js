var ModelSubDictJson = {
    ModelSubDict: {
        remark: {           //字典项扩展
            maxLength: 100
        },
        sort: {        //序号
            rules: {checkSave: ["notNull", "isIntGtZero", "isInteger"]},
            maxLength: 10
        },
        code:{
            rules: {checkSave: ["notNull"]},
            maxLength: 30
        },
        value:{
            rules: {checkSave: ["notNull"]},
            maxLength: 20
        },
        pcode:{
            type:"dict",
            dictConfig: {
                reqInterface: "getParentDict"
            },
            maxLength: 30
        }
    }
};