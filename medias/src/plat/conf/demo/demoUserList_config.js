//搜索框部分

var SDemoJson = {
    SDemo: {
        userName: {
            tagName: "姓名(输入框)"
        },
        zzmm: {
            type: "dict",
            dictConfig: {
                dictCode: "ZZMMDEMO"
            },
            tagName: "政治面貌(下拉框)"
        },
        csrq:{
            type: "date",
            dateConfig: {
                dateFmt: "yyyy-MM-dd"
            },
            tagName: "出生日期(日期)"
        }
    }
};
//规定表头
var columns = [
    {title: '姓名(String)', id: 'USER_NAME', width: '', align: 'center', renderer:function (v, rowData, rowIndex, showPro){
        showPro.ifSetTitle = true;
        showPro.replaceSymbols = false;
        v=replaceSymbols(v);
        return "<a href='javascript:void(0)' onclick='alert("+rowData.ID+")'>"+ v +"</a>";
    }},
    {
        title: '性别(Function)', id: 'SEX', width: '200', align: 'center', renderer: function (v) {
        if (v == '0') {
            return "男"
        } else if (v == "1") {
            return "女"
        } else {
            return v;
        }
    }
    },
    {title: '出生日期(Date)', id: 'CSRQ', width: '200', align: 'center', renderer: "Date", format: "yyyy-MM-dd"},
    {title: '政治面貌(Dict)', id: 'ZZMM', width: '200', align: 'center', renderer: "Dict", dictCode: "ZZMMDEMO"}
];
//用户列表主配置
var ModelDemoList_Propertys = {
    ModelName: "ModelDemoUserList", //模型名称
    url: "/demoUser/getDemoUserList",  //请求列表数据的url 已自动添加了random不需要在加random
    columns: columns,
    searchJson: SDemoJson,
    SearchModelName: "SDemo",
    colSetting: [80, 160, 100, 160, 60, 160],
    checkbox: true, //是否显示checkbox
    mulchose: true, //是否多选,
    allPageChose: false //是否开启全页选择
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