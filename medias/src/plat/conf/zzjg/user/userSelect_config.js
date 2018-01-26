//搜索部分配置
var SUserJson = {
    SUser: {
        user_name: {
            type: "normal",
            tagName: "用户名称"
        }
    }
};
var columns = [
    {title: '用户名称', id: 'USER_NAME', width: '100', align: 'center', renderer: "String"},
    {title: '登录账号', id: 'LOGIN_NAME', width: '100', align: 'center', renderer: "String"},
    {title: '默认机构', id: 'DEFAULT_ORGAN_NAME', width: '100', align: 'left', renderer: "String"}
];
//配置动态加载属性
var TcUserList_Propertys = {
    ModelName: "TcUserList", //模型名称
    columns: columns,         //表头
    url: "/user/getUserPageList",  //请求列表数据的url 已自动添加了random不需要在加random
    searchJson: SUserJson,
    SearchModelName: "SUser",
    allPageChose:true,
    mulchose:true, //是否多选
    checkbox:true, //是否显示checkbox
    limit: 9
};