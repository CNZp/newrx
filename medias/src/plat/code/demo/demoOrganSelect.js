/**
 * Created by Administrator on 2017/5/18.
 */
var demoOrganSelect;
var func = GetQueryString("func")
var modelName = GetQueryString("modelName")
$(function () {
    //打开加载中标志
    pageAjax();

    demoOrganSelect = new BaseGridModel(ModelDemoOrganSelect_Propertys);
    demoOrganSelect.render();

    $("#confirm").click(function () {
        var rows = demoOrganSelect.getSelect();
        if (rows.length > 0) {
            var organName = rows[0].ORGAN_NAME;
            var organId = rows[0].ID;
            var evalFunc = eval("getPrevWin()." + func);
            var result = evalFunc(modelName, organName, organId)
            if (result || typeof(result) == "undefined") {
                closeWin();
            }
        } else {
            rxMsg(RxMsgType.WARNNING,"请至少选择一条数据");
        }
    })

})
