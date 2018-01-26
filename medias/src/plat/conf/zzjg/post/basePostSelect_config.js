//搜索部分配置
var SBasePostJson = {
    SBasePost: {
        post_name: {
            tagName: "岗位名称",
            maxLength: 50
        }
        // isWhole: {
        //     tagName: "岗位类型",
        //     type: "dict",
        //     dictConfig: {
        //         dictCode: [{code: 1, value: "全局岗位"}, {code: 0, value: "局部岗位"}]
        //     },
        //     maxLength: 50
        // }
    }
};
//规定表头
var columns = [
    {
        title: '岗位名称', id: 'NAME', width: '200', align: 'center', renderer: function (v, rowData, rowIndex, showPro) {
        showPro.replaceSymbols = false;
        showPro.ifSetTitle = true;
        // if (rowData.IS_WHOLE == 1) {
        //     return "<span style='color: #1ca5eb'>(全)</span>" + v;
        // } else {
        return v;
        // }
    }
    },
    {title: '岗位编码', id: 'CODE', width: '200', align: 'center', renderer: "String"}
];
//岗位列表主配置
var ModelBasePostList_Propertys = {
    ModelName: "ModelBasePostList", //模型名称
    url: "/basePost/getBasePostPage",  //请求列表数据的url 已自动添加了random不需要在加random
    columns: columns,
    searchJson: SBasePostJson,
    SearchModelName: "SBasePost",
    mulchose: true, //是否多选
    checkbox: true, //是否显示checkbox
    colSetting: [60, 160, 60, 160, 60, 160]
};
