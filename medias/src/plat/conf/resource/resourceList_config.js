//搜索部分资源
var SResourceJson = {
    SResource: {
        parentName:{
            tagName: "上级资源",
            disabled: true,
            ifForm: false,
            spanShow: false,
            canClear:true
        },
        parentId:{
            display: false,
            canClear:true
        },
        parentType:{
            display: false,
            canClear:true
        },
        name: {
            tagName: "资源名称",
            maxLength: 20,
            canClear:true
        },
        code: {
            tagName: "资源编码",
            maxLength: 20,
            canClear:true
        },
        type: {
            tagName: "资源类型",
            type:"dict",
            dictConfig:{
                dictCode:resourceDict
            },
            canClear:true
        }
    }
};

//表头
var columns = [
    {title: '资源名称', id: 'NAME', width: '25%', align: 'center', renderer: function (v, rowData, rowIndex, showPro) {
        var rhtml = v;
        if(rowData.UTYPE == 1){
            showPro.ifSetTitle = true;
            showPro.replaceSymbols = false;
            rhtml = "<img src='"+RX.handlePath("/medias/style/plat/image/resource/home_resource.png")+"'" +
                " style='margin:-4px 5px 0px 0px;' align='absmiddle'/>"+rhtml;
        }
        return rhtml;
    }},
    {title: '资源编码', id: 'CODE', width: '25%', align: 'center', renderer: "String"},
    {title: '资源类型', id: 'TYPE', width: '25%', align: 'center', renderer: "Dict",dictCode:resourceDict},
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


//初始化buttongroup
//按钮区配置
//默认显示
//个性控制的，比如组织机构中，点击删除的数据是恢复，点击未删除的数据是删除等.....
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
    }
];
//存在默认配置
var buttonsJson = {
    buttons:buttonArr
};
