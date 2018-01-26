/**
 * Created by Pitcher on 2017/5/18.
 */
var type = GetQueryString("type") || "xz";
var demo;
$(function () {
    //初始化尺寸
    pageAjax();

    resizeForm();

    var stateJson;
    if(type === "xz"){
        stateJson = xzStateJson;
    } else if(type === "xg"){
        stateJson = xgStateJson;
    } else {
        stateJson = ckStateJson;
    }
    var ModelDemo = DetailModel.extend({
        className: "ModelDemo",
        initJson: ModelDemoJson,
        stateJson: stateJson
    });

    demo = {num:10,type:1,date:"2017-01-11"};
    var modelDemo = new ModelDemo(demo);
    modelDemo.render();

    $("#vali").click(function () {
        if (modelDemo.ruleValidate()) {
           rxMsg(RxMsgType.SUCCESS,"验证成功");
        }
    });
    $("#view").click(function () {
        gotoLocation("/demo/textFormDemo?type=ck");
    });
});
