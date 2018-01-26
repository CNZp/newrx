var modelName = GetQueryString("modelName");
var func = GetQueryString("func");
var parentId = GetQueryString("parentId");
var modelPageList;
$(function () {
    //注册请求中msg
    pageAjax();
    //初始化尺寸
    resizeForm();
    //规定表头
    var columns = [
        {title: '表单名称', id: 'NAME', width: '30%', align: 'left', renderer: "String"},
        {title: '表单编码', id: 'CODE', width: '30%', align: 'left', renderer: "String"},
        {title: '表单路径', id: 'URL', width: '40%', align: 'left', renderer: "String"}
    ];
    //搜索部分配置
    var SModelSheetJson = {
        SModelPage: {
            name: {        //主键ID
                type: "normal",
                tagName: "表单名称",
                maxLength: 20
            },
            parentId:{
                display:false
            }
        }
    };
    //列表配置
    var modelPageList_Propertys = {
        ModelName: "ModelPageList", //模型名称
        SearchModelName: "SModelPage",   //搜索模型名称
        columns: columns,         //表头配置
        searchJson: SModelSheetJson,        //搜索区配置
        url: "/resource/getMenuUrlList",  //请求列表数据的url
        limit:8
    };

    //实例列表模型
    var modelPageList = new BaseGridModel(modelPageList_Propertys);

    //设置双击事件
    modelPageList.set("onRowDblClick", function (rowIndex, rowData, isSelected, event) {
        $("#confirm").click();
    });

    //渲染搜索区
    modelPageList.buildSearchView({parentId:parentId});

    //渲染页面
    modelPageList.render();

    //保存按钮事件
    $("#confirm").click(function () {
        var sel = modelPageList.getSelect();
        if (sel.length > 0) {
            var evalFunc = getPrevWin()[func];
            result = evalFunc(modelName, sel[0].ID, sel[0].NAME, sel[0].URL);
            if (result || typeof(result) === "undefined") {
                _top.closeLayer(window);
            }
        } else {
            _top.layer.alert("请选择一条数据");
        }
    });
});
function reloadTable(param) {
    modelPageList.reloadGrid(param);
}