//搜索框部分

var SDemoOrganSelectJson = {
    DemoOrganList: {
        organName: {
            tagName: "所属机构",
            ifForm: false,
            spanShow: false
        }
    }
};
//规定表头
var columns = [
    {title: '机构名称', id: 'ORGAN_NAME', width: '', align: 'center', renderer: "String"}
];
//用户列表主配置
var ModelDemoOrganList_Propertys = {
    ModelName: "DemoOrganList", //模型名称
    url: "/demoOrgan/getDemoOrganList",  //请求列表数据的url 已自动添加了random不需要在加randon
    columns: columns,
    searchJson: SDemoOrganSelectJson,
    SearchModelName: "SDemo",
    colSetting: [60, 160, 60, 160, 60, 160]
};
//操作按钮的配置
var buttonArr = [
    {
        id: "add",
        name: "新增",
        icon: "&#xe62a;",
        onClick: "add"
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
        id: "validate",
        name: "验证管理",
        icon: "&#xe606;",
        onClick: "validate"
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