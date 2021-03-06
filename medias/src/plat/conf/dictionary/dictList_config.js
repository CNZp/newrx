//搜索部分配置
var SDictJson = {
    SDict: {
        dictName: {
            canClear: true,
            tagName: "字典名称"
        },
        dictCode: {
            canClear: true,
            tagName: "字典编码"
        },
        dictType: {
            type: "dict",     //字典项
            dictConfig: {
                dictCode: "DICTLX"
            },
            canClear: true,
            tagName: "字典类型"
        }
    }
};
//规定表头  id需与Dao层中查出的字段名一致
var columns = [
    {title: '字典名称', id: 'DICT_NAME', width: '220', align: 'left', renderer: "String"},
    {title: '字典编码', id: 'DICT_CODE', width: '220', align: 'center', renderer: "String"},
    {title: '描述', id: 'DESCRIPTION', width: '220', align: 'center', renderer: "String"},
    {title: '最后修改时间', id: 'XGSJ', width: '', align: 'center', renderer: "Date", format: "yyyy-MM-dd"}
];
//配置动态加载属性
var ModelDictList_Propertys = {
    ModelName: "ModelDictList", //模型名称
    url: "/dict/getDictList",    //请求列表数据的url 已自动添加了random不需要在加random
    columns: columns,
    searchJson: SDictJson,   //搜索区域json
    SearchModelName: "SDict"    //搜索modelName
};
