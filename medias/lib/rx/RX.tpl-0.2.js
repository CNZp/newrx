/*****************************************************************
 * RX.tpl-0.2
 * RX前端模板引擎,基于underscore.template()
 * 最后更新时间：2017-09-14
 * 最后更新人：Zp
 *****************************************************************/
//tpl工具实现在独立的域中，保证内部实现的作用域独立
(function(global){
    //注册RX命名空间
    window.RX = window.RX || {};

    //内部变量：注册模板池
    var tplPool = {};

    /**
     * 内部方法：模板编译方法
     * @param str 模板字符串
     * @param tplName 模板名称
     * @returns {*} Function 模板渲染方法
     */
    function compileTpl(str,tplName){
        var tpl = null;
        try{
            tpl = tplPool[tplName] = _.template(str,null,null,tplName);
        }catch(e){
            tpl = "";
            if(console && console.error){
                console.error("RX: template compile error, \""+tplName+"\".");
            }else{
                throw e;
            }
        }
        return tpl;
    }

    /**
     * 公共接口：模板使用主方法
     * @param tplName 模板名称
     * @param data 渲染数据
     * @returns {*} String 模板加数据运行得出的字符串
     */
    RX.tpl = function(tplName, data){
        if(!tplName){
            //调用渲染自定义标签接口
            RX.tplAllTag(data);
            return;
        }else if (typeof(tplName) != "string"){
            //调用渲染单个标签接口
            RX.tplTag(tplName, data);
            return;
        }
        data = data || {};
        //若模板函数已编译，直接使用编译函数
        if(tplPool[tplName]){
            return tplPool[tplName](data);
        }else{   //若模板函数未编译，编辑函数后使用编译函数
            //优先获取页面模板
            var tpl = RX.loadDomTpl(tplName);
            if(tpl){
                return tpl(data);
            }else{   //若页面模板不存在，获取文件模板
                tpl = RX.loadFileTpl(tplName);
                if(tpl){
                    return tpl(data);
                }
            }
            if(tpl !== null && console && console.error){
                console.error("RX: template is not exist, \""+tplName+"\".");
            }
            return "";
        }
    }

    /**
     * 公共接口：页面中模板预编译
     * @param tplName 模板名称
     * @param data 渲染数据
     * @returns {*} Function 模板函数
     */
    RX.loadDomTpl = function(tplName){
        var doms = $("*[tmplName="+tplName+"]");
        if(doms.length>0){
            var tdom = doms.eq(doms.length - 1);
            return compileTpl(tdom.html(),tplName);
        }
        return null;
    }

    /**
     * 公共接口：文件模板预编译
     * @param tplName 模板名称
     * @param data 渲染数据
     * @returns {*} Function 模板函数
     */
    RX.loadFileTpl = function(tplName){
        var tpl = null;
        $.ajax({
            type: "post",
            url: "/template/getTemplate",
            async: false,
            data: {tplPath: tplName},
            success: function (ar) {
                tpl = compileTpl(ar[tplName],tplName);
            }
        });
        return tpl;
    }

    /**
     * 公共接口：渲染页面所有自定义标签
     * @param data 待渲染数据
     */
    RX.tplAllTag = function(data){
        var tags = $(window.document).find("tdom");
        if(tags.length){
            for(var i = 0; i < tags.length; i++){
                RX.tplTag(tags[i],data);
            }
        }
    }

    /**
     * 公共接口：渲染自定义标签
     * @param obj dom/JQuery元素
     * @param data 待渲染数据
     */
    RX.tplTag = function(obj,data){
        var t = obj instanceof jQuery ? obj[0] : obj;
        if(t.attributes && t.attributes.tpl){
            var tdata = {};
            for(var i = 0; i < t.attributes.length; i++){
                tdata[t.attributes[i].name] = t.attributes[i].value;
            }
            tdata = $.extend(true,{}, tdata, data);
            var $nt = $(RX.tpl(t.attributes.tpl.value, tdata));
            for(key in tdata){
                if(typeof(tdata[key]) !== "undefined"){
                    if(key == "class"){
                        $nt.attr(key,tdata[key] +" "+ $nt.attr(key));
                    }else if(key == "style"){
                        $nt.attr(key,tdata[key] +";"+ $nt.attr(key));
                    }else{
                        $nt.attr(key,tdata[key]);
                    }
                }
            }
            $(t).replaceWith($nt);
        }
    }
})(this);
