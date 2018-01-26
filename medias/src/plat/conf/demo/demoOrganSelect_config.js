//搜索框部分

var SDemoOrganSelectJson = {
    SDemoOrganSelect: {
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
var ModelDemoOrganSelect_Propertys = {
    ModelName: "DemoOrganSelect", //模型名称
    url: "/demoOrgan/getDemoOrganList?hasDelData=true",  //请求列表数据的url 已自动添加了random不需要在加randon
    columns: columns,
    searchJson: SDemoOrganSelectJson,
    SearchModelName: "SDemo",
    colSetting: [60, 160, 60, 160, 60, 160]
};
