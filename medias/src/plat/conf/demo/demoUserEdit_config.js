/**
 * 队伍成员信息页面配置
 * dwcyxxEditConfig
 * Created by RXCoder on 2017-4-11 11:12:14
 */
//表单渲染JSON：队伍成员信息
var ModelDemoUserJson = {
    ModelDemoUser: {     //队伍成员信息类
        id: {        //主键ID
        },
        cs: {
            rules: {checkSave: ["notNull"]}
        },
        userName: {        // 姓名
            type: "normal",
            display: true,
            // defaultValue:"Tom",
            changeFunc: "nameChangeFun",
            disabled: false,
            width: "100",
            rules: {checkSave: ["notNull"]}
            // showLength:10
            // rules: {checkSave: ["isDigits"]}
        },
        sex: {        // 性别
            rules: {checkSave: ["notNull"]}
        },
        mz: {
            rules: {checkSave: ["notNull"]},
            type: "dict",
            dictConfig: {
                dictCode: "MZDEMO",
                checkType: "radio"
            }
        },
        zzmm: {       //政治面貌
            type: "dict",
            // rules: {checkSave: ["notNull"]},
            dictConfig: {
                dictCode: "ZZMMDEMO",
                showPlsSelect: true,
                plsSelectName: "请选择"
            }
        },
        birTime: {
            type: "date",
            dateConfig: {
                dateFmt: "yyyy-MM-dd HH:mm:ss"
            }
        },
        hobby: {       //爱好
            rules: {checkSave: ["notNull"]},
            type: "dict",
            dictConfig: {
                dictCode: "HOBBYSDEMO",
                checkType: "checkbox"
            },
            defaultValue: ["1", "2"]
        },

        fruit: {        // 水果
            rules: {checkSave: ["notNull"]}
        },
        csrq: {        // 出生日期
            type: "date",
            changeFunc: "a",
            // rules: {checkSave: ["notNull"]},
            dateConfig: {
                dateFmt: "yyyy-MM-dd"
            }
        },
        language: {
            rules: {checkSave: ["notNull"]},
            type: "dict",
            dictConfig: {
                reqInterface: "getLanguage"
            }
        },
        city: {
            // defaultValue:"1",
            rules: {checkSave: ["notNull"]},
            type: "dict",
            dictConfig: {
                dictCode: "CSDEMO",
                ifSearch: true
            }
        },
        // organName2: {  //所属企业
        //     // rules: {checkSave: ["notNull"]},
        //     type: "layer",
        //     layerConfig: {
        //         title: "所属示例企业",
        //         type: "div",
        //         divWidth: "200px",
        //         divHeight: "200px",
        //         url: "/demo/demoOrganSelect?type=xz&selectType=ck&",
        //         checkFunc: "",
        //         callbackFunc: "organSelectCallback",
        //         canDelete: true
        //     }
        // },
        organName: {  //所属企业
            // rules: {checkSave: ["notNull"]},
            type: "layer",
            canThink: true,
            thinkFunc: "think",
            layerConfig: {
                canInput: true,
                title: "所属示例企业",
                style: "medium",
                url: "/demo/demoOrganSelect?type=xz&selectType=ck&",
                checkFunc: "",
                callbackFunc: "organSelectCallback",
                canDelete: true
            }
        },
        organId: {  //企业ID
            display: false
        },
        zp_id: {
            type: "file",
            rules: {checkSave: ["notNull"]},
            fileConfig: {
                canDelete: true,
                type: "image"
            }
        },
        description: { //备注
            rules: {checkSave: ["notNull"]},
            // defaultValue: "nihao"
            maxLength: 100
        },
        fj_id: {
            type: "file",
            fileConfig: {
                listName: "附件上传22",
                type: "list",
                minNum: 3
            }
        },
        fj_id_fl: {
            type: "file",
            fileConfig: {
                listName: "分类附件上传222",
                type: "list",
                dictCode: "ZZMMDEMO",
                // minNum: 6
                minNum: {"zd1": 1, "zd2": 2}
            }
        },
        fj_id_table: {
            type: "file",
            fileConfig: {
                listName: "附件表格上传",
                type: "table",
                minNum: "1"
            }
        },
        fj_id_single: {
            type: "file",
            fileConfig: {
                listName: "附件表格上传",
                type: "single"
            }
        },
        fj_id_html5: {
            type: "file",
            fileConfig: {
                listName: "多附件html5上传，浏览器版本有要求",
                type: "html5"

            }
        },
        fj_id_html5_fl: {
            type: "file",
            fileConfig: {
                listName: "多附件分类html5上传",
                type: "html5",
                dictCode: "ZZMMDEMO"
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
    ModelDemoUser: {        //用户案例
        state: {
            disable: []
        }
    }
};

//修改状态JSON：用户案例信息
var xgStateJson = {
    ModelDemoUser: {        //用户案例信息
        state: {
            disable: []
        }
    }
};

//查看状态JSON：用户案例信息
var ckStateJson = {
    ModelDemoUser: {        //用户案例信息
        state: {
            enable: []
        }
    }
};

function getLanguage() {
    return [
        {"value": "java", "code": "0"},
        {"value": "javaScript", "code": "1"},
        {"value": "html", "code": "2"}
    ];
}
