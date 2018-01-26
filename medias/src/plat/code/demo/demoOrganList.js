/**
 * Created by Administrator on 2017/5/18.
 */
var demoOrganList;
var func = GetQueryString("func");
var type = GetQueryString("type");
var modelName = GetQueryString("modelName");
$(function () {
    //打开加载中标志
    if (type == "ck") {
        $(".w_button_box").show();
    }
    //初始化按钮
    buttons = RX.button.init($("#operate"), buttonsJson);
    pageAjax();
    demoOrganList = new BaseGridModel(ModelDemoOrganList_Propertys);

    //设置单击事件
    demoOrganList.set("onRowDblClick", onRowDblClick);

    demoOrganList.render();


    //弹出层按钮
    $("#confirm").click(function () {
        var rows = demoOrganList.getSelect();
        if (rows.length > 0) {
            var organName = rows[0].ORGAN_NAME;
            var organId = rows[0].ID;
            var evalFunc = eval("getPrevWin()." + func);
            var result = evalFunc(modelName, organName, organId);
            if (result || typeof(result) == "undefined") {
                closeWin();
            }
        } else {
            rxMsg(RxMsgType.WARNNING,"请至少选择一条数据");
        }
    })

    //模板的下载
    $("#excelDownload").click(function () {
        window.location.href = RX.handlePath("/demoOrgan/exportTemplate?filename=") + encodeURI(encodeURI("demoUser.xls"));
    });
    //excel导入
    $("#excelImp").click(function () {
        $("#excel").click();
        $("#excel").change(function () {
            var filePath = $("#excel").val();
            var idx = filePath.lastIndexOf(".");
            var suffix = filePath.substring(idx + 1).toLowerCase();
            if (suffix != "xls" && suffix != "xlsx") {
                layer.alert("请导入Excel文档!");
            } else {
                $("#form").ajaxSubmit({
                    success: function (ar) {
                        if (ar.success) {
                            layer.alert("导入成功");
                            reloadTable();
                        } else {
                            layer.alert(ar.msg);
                        }
                    }
                })
            }
        })
    });

    //Prompt功能
    $("#Prompt").click(
        function () {
            layer.prompt({
                formType: 2,
                value: '初始值',
                title: '请输入值'
            }, function (value, index, elem) {
                if (value == "请输入值") {
                    alert(value); //得到value
                    layer.close(index);
                } else {
                    layer.alert("不可为空");
                }

            });
        })
});

function add() {
    openStack(window, "新增示例企业", "medium", "/demo/demoOrganEdit?type=xz&city=" + encode('上海'));
}

function del() {
    var rowData = demoOrganList.getSelect();
    if (rowData == null || rowData == undefined || rowData[0] == null) {
        rxMsg(RxMsgType.WARNNING,"请选择一条待删除的数据");
    } else {
        layer.confirm("确定要删除所选记录吗？", function (index) {
            $.ajax({
                url: "/demoOrgan/deleteDemoOrgan?id=" + rowData[0].ID,
                success: function (ar) {
                    if (ar.success) {
                        rxMsg(RxMsgType.WARNNING,"请选择一条待删除的数据");
                        reloadTable();
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            })
        })
    }
}

function edit() {
    //编辑
    var rowData = demoOrganList.getSelect();
    if (rowData.length == 1) {
        openStack(window, "修改示例组织", "medium", "/demo/demoOrganEdit?id=" + rowData[0].ID + "&type=xg");
    } else {
        rxMsg(RxMsgType.WARNNING,"请选择一条数据进行修改");
    }
}

//验证管理
function validate() {
    openStack(window, "验证管理", "medium", "/demo/demoValidate");
}

//刷新全局接口
function reloadTable(param) {
    if (param) {
        demoOrganList.set("postData", param);
    }
    demoOrganList.reloadGrid();
}

//双击事件
function onRowDblClick(rowIndex, rowData, isSelected, event) {
    openStack(window, "查看用户", "medium", "/demo/demoOrganEdit?type=ck&id=" + rowData.ID);
}
