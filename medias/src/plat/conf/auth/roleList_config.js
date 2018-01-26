//搜索部分配置
var SRoleJson = {
    SRole: {
        roleName: {
            tagName: "角色名称",
            canClear: true,
            maxLength: 50
        },
        roleCode: {
            tagName: "角色编码",
            canClear: true,
            maxLength: 20
        },
        roleType: {
            type: "dict",
            dictConfig: {
                dictCode: "JSLX"
            },
            tagName: "角色类型",
            canClear: true,
            maxLength: 50
        }
    }
};
//规定表头
var columns = [
    {title: '角色名称', id: 'ROLE_NAME', width: '30%', align: 'center', renderer: "String"},
    {title: '角色编码', id: 'ROLE_CODE', width: '15%', align: 'center', renderer: "String"},
    {title: '角色类型', id: 'ROLE_TYPE_NAME', width: '15%', align: 'center', renderer: "String"},
    {
        title: '最后修改时间',
        id: 'XGSJ',
        width: '20%',
        align: 'center',
        renderer: "Date",
        format: "yyyy-MM-dd"
    },
    {title: '操作', id: 'OPERS', width: '20%', align: 'center', renderer: function (v, rowData, rowIndex, showPro) {
        var rhtml = "";
        showPro.ifSetTitle = true;
        showPro.sTitle = "";
        showPro.replaceSymbols = false;
        if(isPlatAdmin){
            if(rowData.LEVELS == "1"){
                rhtml = "<a onclick='editRow("+rowData.ID+")'>修改</a> <a onclick='delRow("+rowData.ID+")'>删除</a>"
            }else{
                rhtml = "<a onclick='editRow("+rowData.ID+")'>修改</a> <a onclick='delRow("+rowData.ID+")'>删除</a> <a onclick='resourceRow("+rowData.ID+")'>关联资源</a>"
            }
        }else{
            if(rowData.LEVELS != "1" && rowData.LEVELS != "2"){
                rhtml = "<a onclick='editRow("+rowData.ID+")'>修改</a> <a onclick='delRow("+rowData.ID+")'>删除</a> <a onclick='resourceRow("+rowData.ID+")'>关联资源</a>"
            }
        }
        return rhtml;
    }}
];
//角色列表主配置
var ModelRoleList_Propertys = {
    ModelName: "ModelRoleList", //模型名称
    url: "/role/getRoleList",  //请求列表数据的url 已自动添加了random不需要在加random
    columns: columns,
    searchJson: SRoleJson,
    SearchModelName: "SRole"
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
    }
];
//存在默认配置
var buttonsJson = {
    buttons:buttonArr
};
