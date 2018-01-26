
var CkState = {
    ModelOrgan: {
        state:{
            enable: []
        }

    },
    ModelPost: {
        state:{
            enable: []
        }

    },
    ModelUser:{
        state:{
            enable: []
        }
    },
    ModelRole:{
        state:{
            enable: []
        }
    }
};

//model渲染方案配置
var ModelOrganJson = {
    ModelOrgan: {
        id: {        //主键ID
            display: false
        },
        ORGAN_CODE: {

        },
        MC: {       //名称

        },
        QC: {        //全称

        },
        SFYX_ST:{    //是否有效
 
        }
    }}
var ModelPostJson = {
    ModelPost: {
        id: {        //主键ID
            display: false
        },
        MC: {        //岗位名称

        },
        ORGAN: {        //所属机构ID
            display: false
        },
        ORGAN_NAME:{    //所属机构名称

        },
        PARENT_POST: {   //上层岗位id
            display: false
        } ,
        PARENT_POSTNAME:{  //上层岗位名称

        },
        SFYX_ST:{    //是否有效

        }
    }
}
var ModelUserJson = {
    ModelUser: {
        id: {
            display: false
        },
        LOGIN_NAME: {

        },
        MC: {

        },
        DEFAULT_ORGAN_ID: {

        },
        SFYX_ST:{

        }
    }
}
var ModelRoleJson = {
    ModelRole: {
        id: {        //主键ID
            display: false
        },
        ROLE_NAME: {    //角色名称

        },
        ROLE_CODE: {       //角色编码

        } ,
        ROLETYPE_NAME:{      //角色类型名称

        } ,
        SFQY_ST:{       //是否启用

        }
    }
};