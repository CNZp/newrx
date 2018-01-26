//搜索部分配置
//model渲染方案配置
var SRuleJson = {
    SRule: {
        RULE_NAME: {
            tagName: "规则名称",
            maxLength: 50
        }
    }
};
//规定表头
var columns = [
    {title: '规则名称', id: 'RULE_NAME', width: '200', align: 'center', renderer: "String"},
    {title: '规则实现方式', id: 'SXFS', width: '200', align: 'center', renderer: "String" } ,
    {
        title: '最后修改时间',
        id: 'XGSJ',
        width: '',
        align: 'center',
        renderer: "Date",
        format: "yyyy-MM-dd"
    }
];
//配置动态加载属性
var ModelRuleList_Propertys = {
    ModelName: "ModelRuleList", //模型名称
    url: "/rule/getAuthRuleList",  //请求列表数据的url 已自动添加了random不需要在加random
    columns: columns,
    searchJson: SRuleJson,
    SearchModelName: "SRule",
    limit: 9
};
