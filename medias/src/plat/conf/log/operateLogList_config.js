
//搜索框部分

var SOperateLogJson = {
    SOperateLog: {
        startTime: {
            type:"date",
            tagName: "操作时间",
            spanShow: false
        },
        endTime: {
            type:"date",
            tagName: "至",
            spanShow: false
        },
        logName:{
            tagName:"日志名称"
        }
    }
};
//规定表头
var columns = [
    {title: '日志类型', id: 'LOG_TYPE', width: '100', align: 'center', renderer: "String"},
    {title: '日志名称', id: 'LOG_NAME', width: '100', align: 'center', renderer: "String"},
    {title: '操作用户', id: 'USER_NAME', width: '100', align: 'center', renderer: "String"},
    {title: '日志信息', id: 'MESSAGE', width: '100', align: 'center', renderer: "String"},
    {title: '操作时间', id: 'CREATE_TIME', width: '100', align: 'center',renderer: "Date",format: "yyyy-MM-dd  hh:mm:ss"}
];
//用户列表主配置
var ModelOperateLogList_Propertys = {
    ModelName: "OperateLogList", //模型名称
    url: "/log/getOperateLogPage",  //请求列表数据的url 已自动添加了random不需要在加randon
    columns: columns,
    searchJson: SOperateLogJson,
    SearchModelName: "SOperateLog",
    colSetting: [60, 160, 60, 160, 60, 160]
};
