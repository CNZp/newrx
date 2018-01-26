/*****************************************************************
 * RX.Form-0.1
 * 表单-基础结构
 * 最后更新时间：2018-01-24
 * 最后更新人：Zp
 * 更新内容：创建文件
 ******************************************************************/
(function () {
    // 创建一个全局对象, 在浏览器中表示为window对象, 在Node.js中表示global对象
    var root = this;

    //表单基础对象，继承自Base
    var Form = RX.Form = RX.Base.extend({
        window:null,
        top:null,
        prev:null,
        next:null,
        brother:null,
        child:null,
        parent:null,
        initialize:function(window){
            this.window = window;
            //解析url
            //整合param
            //调用afterInitialize
            this.afterInitialize.apply(this, arguments);
        },
        afterInitialize:function(){
            this.resize();
        },
        resize:function(){
            RX.log(this.window.name+"_resize run");
        },
        destory:function(){

        }
    });

}).call(this);