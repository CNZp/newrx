var modelTeacherList;
$(function () {

    //初始化尺寸
    resizeTable();
    pageAjax();
    var buttonArr = [
        {
            id: "startFlow",
            name: "发起请假流程",
            icon: "&#xe62a;",
            onClick: startFlow              //可以是方法引用，也可以是方法字符串名称
        }
    ];
    var buttonsJson = {
        buttons: buttonArr
    };
    RX.button.init($("#operation"), buttonsJson);
    var columns = [
        {title: '标题', id: 'TITLE', width: '160', align: 'center', renderer: "String"},
        {title: '流程状态', id: 'STATUS', width: '160', align: 'center', renderer: "Dict", dictCode: "QJLCZT"},
        {title: '最后办理人', id: 'USER_NAME', width: '160', align: 'center', renderer: "String"},
        {title: '最后修改时间', id: 'XGSJ', width: '160', align: 'center', renderer: "Date", format: "yyyy-MM-dd HH:mm"}
    ];

    var SModelTeacherJson = {
        SModelTeacher: {
            title: {        //主键ID
                type: "normal",
                tagName: "标题",
                canClear: true,
                maxLength: 20
            }
        }
    };
    //配置动态加载属性
    var ModelHtbaList_Propertys = {
        ModelName: "ModelTeacherList", //模型名称
        SearchModelName: "SModelTeacher",
        columns: columns,         //表头
        searchJson: SModelTeacherJson,
        url: "/teacher/getTeacherList",  //请求列表数据的url 已自动添加了random不需要在加random
        mulchose: true, //是否多选
        allPageChose: true //是否开启全页选择，未完全实现
    };

    //创建列表模型类
    modelTeacherList = new BaseGridModel(ModelHtbaList_Propertys);

    modelTeacherList.buildSearchView();

    //设置双击事件
    modelTeacherList.set("onRowDblClick", function onRowDblClick(rowIndex, rowData, isSelected, event) {
        //办理流程 第二个参数对象用以传递参数到办理表单页面
        handleWorkflowByWiId(rowData.WF_INS_ID, null);
    });

    //渲染页面
    modelTeacherList.render();
});

/**
 * 载入数据表格
 * @param param
 */
function reloadTable(param) {
    modelTeacherList.reloadGrid(param);
}

function startFlow(){
    //启动流程 参数对象中必须包括流程编码flowCode，其它参数根据业务需要传递（如：此处可以指定流程实例标题wfTitle）
    confirmWorkflowStart({title: "请假流程", flowCode: "QJLC", type: "xz"});
}