//按钮配置
var buttonArr = [
    {
        id: "add",
        name: "新增",
        code:"ADDRULE",
        icon: "&#xe62a;",
        onClick: "add"              //可以是方法引用，也可以是方法字符串名称
    },
    {
        id: "edit",
        name: "修改",
        code:"EDITRULE",
        icon: "&#xe605;",
        onClick: "edit"
    },
    {
        id: "del",
        name: "删除",
        code:"DELRULE",
        icon: "&#xe606;",
        onClick: "del"
    }
];
var buttonsJson = {
    pageCode:"ruleList",     //当前页面code
    buttons: buttonArr
};
//搜索部分配置
var SRuleJson = {
    SRule: {
        RULE_NAME: {
            tagName: "规则名称",
            maxLength: 50
        },
        GZLX: {
            type: "dict",
            dictConfig: {
                dictCode: "GZLX"
            },
            tagName: "规则类型"
        }
    }
};
//配置动态加载属性
var ModelRuleList_Propertys = {
    ModelName: "ModelRuleList", //模型名称
    url: "/rule/getAuthRuleList",  //请求列表数据的url 已自动添加了random不需要在加random
    limit: 10,            //分页页码
    searchJson: SRuleJson,
    SearchModelName: "SRule"
};
//规定表头
var columns = [
    {title: '规则名称', id: 'RULE_NAME', width: '40%', align: 'center', renderer: "String"},
    {title: '实现方式', id: 'SXFS', width: '30%', align: 'center', renderer: "String" },
    {
        title: '最后修改时间',
        id: 'XGSJ',
        width: '30%',
        align: 'center',
        renderer: "Date",
        format: "yyyy-MM-dd"
    }
];

