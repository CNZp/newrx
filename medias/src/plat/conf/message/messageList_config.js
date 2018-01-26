//搜索部分配置
var SMessageJson = {
    SMessage: {
        startTime: {
            type: "date",
            tagName: "开始时间",
            maxLength: 20,
            canClear: true
        },
        endTime: {
            type: "date",
            tagName: "至",
            maxLength: 20,
            canClear: true
        }
    }
};

//表头
var columns = [
    {title: '标题', id: 'TITLE', width: '10%', align: 'center', renderer: "String"},
    {title: '内容', id: 'CONTENT', width: '', align: 'center', renderer: "String"},
    {title: '日期', id: 'RECEIVE_TIME', width: '20%', align: 'center', renderer: "String"},
    {
        title: '状态', id: 'STATUS', width: '20%', align: 'center', renderer: function (v) {
        if (v == "1") {
            return "未读"
        } else if (v == "2") {
            return "已读"
        } else {
            return "已办理"
        }
    }
    }
];
//配置动态加载属性
var ModelMessageList_Propertys = {
    ModelName: "ModelMessageList", //模型名称
    url: "/message/getMessagePage",  //请求列表数据的url 已自动添加了random不需要在加random
    limit: 10,            //分页页码
    columns: columns,
    searchJson: SMessageJson,
    SearchModelName: "SMessage",
    colSetting: [100, 150, 25, 150, 80, 80] //列宽设置
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
        id: "sendMessage",
        name: "发送消息",
        icon: "&#xe62a;",
        onClick: "sendMessage"
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