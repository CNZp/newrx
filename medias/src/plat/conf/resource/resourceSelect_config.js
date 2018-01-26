//搜索部分资源
var SResourceJson = {
    SResource: {
        name: {
            tagName: "名称",
            maxLength: 20,
            canClear:true
        },
        code: {
            tagName: "编码",
            maxLength: 20,
            canClear:true
        },
        type: {
            display:false,
            defaultValue:resourceType
        }
    }
};

//表头
var columns = [
    {title: '资源名称', id: 'NAME', width: '25%', align: 'center', renderer: "String"},
    {title: '资源编码', id: 'CODE', width: '25%', align: 'center', renderer: "String"},
    {title: '修改时间', id: 'XGSJ', width: '25%', align: 'center', renderer: "Date", format: "yyyy-MM-dd"}
];
//资源动态加载属性
var ModelResourceList_Propertys = {
    ModelName: "ModelResourceList", //模型名称
    url: "/resource/getResourceList",  //请求列表数据的url 已自动添加了random不需要在加random
    limit: 10,            //分页页码
    columns: columns,
    searchJson: SResourceJson,
    SearchModelName: "SResource"
};