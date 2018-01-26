//var modelName = GetQueryString("modelName");
var func = GetQueryString("func");

$(function () {
    //初始化尺寸
    resizeForm();
    var ModelOrganLeader = DetailModel.extend({
        className: "ModelOrganLeader",
        initJson: ModelOrganLeaderJson
    });

    var organleader = {};   //供初始化的数据对象
    var modelOrganLeader = new ModelOrganLeader(organleader);
    modelOrganLeader.render();

    $("#save").click(function () {
        var result;
        if (modelOrganLeader.ruleValidate()) {
            var evalFunc = eval("getPrevWin()." + func);
            result = evalFunc(ModelOrganLeader, modelOrganLeader.getJson());
            if (result == "2") {
                layer.alert("领导姓名已存在");
            } else if (result == "3") {
                layer.alert("审批顺序已存在");
            } else {
                closeWin();
            }
        }
    });
});

function bmldSelectCallback(modelName, name, id) {
    $.getEle(modelName, "user_id").val(id);
    $.getEle(modelName, "user_name").val(name);
}

//清空分管领导
function emptyBmld() {
    $.getEle("ModelOrganLeader", "user_name").val("");
}