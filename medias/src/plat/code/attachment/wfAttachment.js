/**
 * 附件编辑页面
 * Created by admin on 2017-2-16.
 */
$(function () {
    var type = GetQueryString("type");
    //初始化尺寸
    resizeForm();
    //注册请求中msg
    pageAjax();

    //依据参数确定选择的状态配置
    var stateJson;
    if (type === "ck") {
        stateJson = CkState;
    } else {
        stateJson = XzState;
    }
    //创建主model对象
    var Modelfj = DetailModel.extend({
        className: "Modelfj",
        initJson: ModelfjJson,
        stateJson: stateJson,
        state: "xz"
    });
    //获取初值
    var uuid = GetQueryString("fj_id");
    var fj = {};   //供初始化的Zhsq数据对象
    if (uuid) {
        fj.fj_id = uuid;
    }
    //依据初值创建主model实例
    var modelFj = new Modelfj(fj);
    //触发主model渲染
    modelFj.render();

});




