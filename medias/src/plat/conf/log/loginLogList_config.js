
//搜索框部分
var SLoginLogJson = {
    SLoginLog: {
        startTime: {
            type:"date",
            tagName: "登录时间",
            spanShow: false
        },
        endTime: {
            type:"date",
            tagName: "至",
            spanShow: false
        },
        userName:{
            tagName:"用户名"
        }
    }
};
//规定表头
var columns = [
    {title: '日志名称', id: 'LOG_NAME', width: '', align: 'center', renderer: "String"},
    {title: '操作用户', id: 'USER_NAME', width: '', align: 'center', renderer: "String"},
    {title: '日志信息', id: 'MESSAGE', width: '', align: 'center', renderer: "String"},
    {title: 'IP地址', id: 'IP', width: '', align: 'center', renderer: "String"},
    {title: '登录时间', id: 'LOGIN_TIME', width: '', align: 'center', renderer: "Date",format: "yyyy-MM-dd  hh:mm:ss"}
];
//登录日志列表主配置
var ModelLoginLogList_Propertys = {
    ModelName: "LoginLogList", //模型名称
    url: "/log/getLoginLogPage",  //请求列表数据的url 已自动添加了random不需要在加randon
    columns: columns,
    searchJson: SLoginLogJson,
    SearchModelName: "SLoginLog",
    colSetting: [60, 160, 60, 160, 60, 160]
};
