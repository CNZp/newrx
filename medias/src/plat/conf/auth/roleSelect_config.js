//表头配置
var columns = [
    {title: '角色名称', id: 'ROLE_NAME', width: '220', align: 'center', renderer: "String"},
    {title: '角色编码', id: 'ROLE_CODE', width: '220', align: 'center', renderer: "String"},
    {
        title: '操作', id: '', width: '', align: 'center', renderer: function (v, rowData, rowIndex, showPro) {
        showPro.ifSetTitle = true;
        showPro.replaceSymbols = false;
        return "<a  class='viewElement'>查看角色元素</a>";
    }
    }
];
//搜索部分配置
var SModelRoleJson = {
    SModelRole: {
        roleName: {        //主键ID
            tagName: "角色名称",
            maxLength: 40
        },
        roleType: {
            display: false,
            disabled: true
        }
    }
};
//列表参数设置
var ModelRoleList_Propertys = {
    ModelName: "ModelRoleList", //模型名称
    SearchModelName: "SModelRole", //搜索区模型名称
    columns: columns,         //表头载入
    searchJson: SModelRoleJson,     //搜索区渲染json载入
    url: "/role/getRoleList",//请求列表数据的url 已自动添加了random不需要在加random
    limit: 8
};