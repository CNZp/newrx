/**
 * Created by Pitcher on 2017/5/18.
 */

var ModelDemoValidate;
var modelDemoValidate;
$(function () {

//主模型类
    ModelDemoValidate = DetailModel.extend({
        className: "ModelDemoValidate",
        initJson: ModelDemoValidateJson,
        stateJson: StateJson
    });

    modelDemoValidate = new ModelDemoValidate();
    modelDemoValidate.render();

    $("#save").click(function () {
        if (modelDemoValidate.ruleValidate()) {
        layer.alert("验证成功")
        }

    })

})


