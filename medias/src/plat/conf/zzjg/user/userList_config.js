//搜索部分配置
var SUserJson = {
    SUser: {
        organName: {
            tagName: "所属机构",
            disabled: true,
            ifForm: false,
            spanShow: false
        },
        postName: {
            tagName: "所属岗位",
            disabled: true,
            ifForm: false,
            spanShow: false
        },
        postId: {
            display: false,
            disabled: true
        },
        organ_id: {              //机构id，隐藏字段
            display: false,
            disabled: true
        },
        user_name: {
            tagName: "用户名称",
            maxLength: 40,
            canClear: true
        },
        loginName: {
            tagName: "登录账号",
            maxLength: 40,
            canClear: true
        },
        userStatus: {
            type: "dict",
            dictConfig: {
                dictCode: [{code: 1, value: "封锁"}, {code: 0, value: "未封锁"}]
            },
            tagName: "用户状态",
            canClear: true
        }
    }
};
//规定表头
var columns = [
    {title: '用户名称', id: 'USER_NAME', width: '', align: 'center', renderer: "String"},
    {title: '登录账号', id: 'LOGIN_NAME', width: '20%', align: 'center', renderer: "String"},
    {title: '创建时间', id: 'CJSJ', width: '20%', align: 'center', renderer: "Date", format: "yyyy-MM-dd"},
    {
        title: '是否封锁', id: 'IS_BLOCKED', width: '15%', align: 'center', renderer: function (v) {
        if (v == '1') {
            return '是';
        } else {
            return '否';
        }
    }
    }
];
//用户列表主配置
var ModelUserList_Propertys = {
    ModelName: "ModelUserList", //模型名称
    url: "getUserPageList",  //请求列表数据的url 已自动添加了random不需要在加randon
    columns: columns,
    searchJson: SUserJson,
    SearchModelName: "SUser",
    colSetting: [60, 160, 60, 160, 60, 160]
};


//操作按钮的配置
var buttonArr = [
    {
        id: "add",
        name: "新增",
        icon: "&#xe62a;",
        onClick: "add"              //可以是方法引用，也可以是方法字符串名称
    },
    {
        id: "edit",
        name: "修改",
        icon: "&#xe605;",
        onClick: "edit"
    },
    {
        id: "del",
        name: "删除",
        icon: "&#xe606;",
        onClick: "del"
    },
    {
        id: "isBlock",
        name: "封锁/解锁",
        icon: "&#xe607;",
        onClick: "isBlock"
    },
    {
        id: "resetPwd",
        name: "重置用户密码",
        icon: "&#xe616;",
        onClick: "resetPwd"
    }
];

//存在默认配置
var buttonsJson = {
    tag: "._rx_grid_control",
    tpl: null,
    param: {},
    title: null,
    buttons: buttonArr,
    beforeInit: function (param) {
        return true
    },
    onInit: function (param) {
    }
};