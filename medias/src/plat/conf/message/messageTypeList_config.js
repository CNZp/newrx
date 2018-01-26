//搜索部分配置
var SMessageTypeJson = {
    SMessageType: {
        name: {
            tagName: "消息类型名称",
            maxLength: 20,
            canClear:true
        },
        code: {
            tagName: "消息类型编码",
            maxLength: 20,
            canClear:true
        }
    }
};

//表头
var columns = [
    {title: '类型名称', id: 'NAME', width: '10%', align: 'center', renderer: "String"},
    {title: '配置编码', id: 'CODE', width: '10%', align: 'center', renderer: "String"},
    {title: '紧急程度', id: 'URGENT_LEVEL', width: '20%', align: 'center', renderer: "Dict",dictCode:"XXJJCD"},
    {title: '有效时间(天)', id: 'VALID_TIME', width: '10%', align: 'center', renderer: "String"},
    {title: '跳转类型', id: 'SKIP_TYPE', width: '10%', align: 'center', renderer: "Dict",dictCode:"XXTZLX"},
    {title: '窗口大小', id: 'WIN_SIZE', width: '10%', align: 'center', renderer: "Dict",dictCode:"WINSIZE"},
    {title: '操作类型', id: 'OPERATE_TYPE', width: '10%', align: 'center', renderer: "Dict",dictCode:"XXCZLX"},
    {title: '跳转路径', id: 'SKIP_PATH', width: '20%', align: 'center', renderer: "String"}
];
//配置动态加载属性
var ModelMessageTypeList_Propertys = {
    ModelName: "ModelMessageTypeList", //模型名称
    url: "/messageType/getMessageTypePage",  //请求列表数据的url 已自动添加了random不需要在加random
    limit: 10,            //分页页码
    columns: columns,
    searchJson: SMessageTypeJson,
    SearchModelName: "SMessageType",
    colSetting:[100,150,100,150,80,150] //列宽设置
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