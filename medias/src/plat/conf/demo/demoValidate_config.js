/**
 * 队伍成员信息页面配置
 * dwcyxxEditConfig
 * Created by RXCoder on 2017-4-11 11:12:14
 */
//表单渲染JSON：队伍成员信息
var ModelDemoValidateJson = {
    ModelDemoValidate: {     //队伍成员信息类
        id: {        //主键ID
        },
        notNull: {        //
            rules: {checkSave: ["notNull"]}
        },
        isNumber: {        //
            rules: {checkSave: ["isNumber"]}
        },
        isInteger: {        //
            rules: {checkSave: ["isInteger"]}
        },
        isIdCardNo: {        //
            rules: {checkSave: ["isIdCardNo"]}
        },
        isEmail: {        //
            rules: {checkSave: ["isEmail"]}
        },
        isCode: {        //
            rules: {checkSave: ["isCode"]}
        },
        isDate: {        //
            rules: {checkSave: ["isDate"]}
        },
        isChinese: {        //
            rules: {checkSave: ["isChinese"]}
        },
        isZipCode: {        //
            rules: {checkSave: ["isZipCode"]}
        },
        isUrl: {        //
            rules: {checkSave: ["isUrl"]}
        },
        isTel: {        //
            rules: {checkSave: ["isTel"]}
        },
        isPhone: {        //
            rules: {checkSave: ["isPhone"]}
        },
        isMobile: {        //
            rules: {checkSave: ["isMobile"]}
        },
        isIp: {        //
            rules: {checkSave: ["isIp"]}
        },
        isEnglish: {        //
            rules: {checkSave: ["isEnglish"]}
        },
        sfyx_st: {        //是否有效
            display: false,
            defaultValue: "VALID"
        }
    }

};

//新增状态JSON：用户案例信息
var StateJson = {
    ModelDemoValidate: {        //用户案例
        state: {
            disable: []
        }
    }
};


