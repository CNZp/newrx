/*****************************************************************
 * RX.Form-0.1
 * 工具：表单管理，表单接口实现与默认操作
 * 最后更新时间：2018-01-29
 * 最后更新人：Zp
 * 更新内容：初步实现新版表单管理控制流，需要补充细节
 *
 * 最后更新时间：2018-01-29
 * 最后更新人：Zp
 * 更新内容：考虑控制窗口管理相关实现的作用域，将Form类移入本作用域
 ******************************************************************/
(function () {
    //注册别名：window
    var root = this;

    RX.getFormId = function (win){
        if(win === _top){
            return win.name || "*top";
        }else{
            return RX.getFormId(win.parent) + "_" + win.name;
        }
    }

    if(root === _top){
        //自动加载：顶层加载layer与遮蔽层相关文件
        RX.loadCssBlocked([].concat(["layer", "/medias/plugin/loading/msgbox.css"]));
        RX.loadScriptBlocked(["layer", "/medias/lib/plat/layerManager.js", "msgbox"]);

        //注册闭包变量：顶层表单池
        var _formPool = {};

        //FIXME：调试用临时代码：表单池
        RX._formPool = _formPool;

        //表单基础对象，继承自Base
        var Form = RX.Form = RX.Base.extend({
            id:null,
            window:null,
            type:null,
            param:null,
            history:null,
            prev:null,
            next:null,
            child:null,
            parent:null,
            initialize:function(targetWin,type,openWin,param){
                //表单初始化
                this.window = targetWin = targetWin || _top;
                this.type = type = type || "frame";
                this.id = targetWin.id || RX.getFormId(targetWin);
                this.param = param || {};
                this.history = [];
                this.next = [];
                this.child = [];

                RX.log(this.id+"_initialize");

                if(_top.name === targetWin.name){
                    return this;
                }

                if (type === "frame" ) {
                    var openForm = RX.getForm(RX.getFormId(openWin || targetWin.parent));
                    if (openForm) {
                        this.parent = openForm;
                        openForm.child.push(this);
                    }
                } else if (type === "stack") {
                    var openForm = RX.getForm(RX.getFormId(openWin));
                    if (openForm) {
                        this.prev = openForm;
                        openForm.next.push(this);
                    }
                }
                //解析url
                //整合param
                return this;
            },
            register:function(targetWin){
                RX.log(this.id+"_register");
                this.window = targetWin;
                this.history.push(targetWin.document.location.href);
            },
            resize:function(){
            },
            destory:function(){
                RX.log(this.id+"_destory");
                var form = this;
                //step_1:按情况清除对外关系
                //case_1_prev:存在上层
                if(form.prev){
                    //step_1_prev_1:清除上层中本层的关系
                    $.each(form.prev.next,function(i,t){
                        if(t.id === form.id){
                            form.prev.next.splice(i, 1);
                            return false;
                        }
                    })
                    //case_1_prev_next:存在下层
                    if(form.next.length){
                        //step_1_prev_next_1:将本层的下层关系赋予上层
                        $.each(form.next,function(i,t){
                            t.prev = form.prev;
                            form.prev.next.push(t);
                        })
                    }
                }else{  //case_1_!prev:不存在上层
                    //case_1_!prev_next:存在下层
                    if(form.next.length){
                        //step_1_!prev_next_1:销毁本层的下层
                        //(因本层已不存在，且无上层可以赋予关系，可以直接销毁下层)
                        $.each(form.next,function(i,t){
                            t.destory();
                        })
                    }
                }
                //case_1_child:存在子层
                if(form.child.length){
                    //step_1_children:销毁本层的子层
                    //(父层控制子层生命周期，父层销毁，子层html销毁，子层无效)
                    $.each(form.child,function(i,t){
                        t.destory();
                    })
                }
                //case_1_parent:存在父层
                if(form.parent){
                    //step_1_parent_1:销毁父层中本层的关系
                    $.each(form.parent.child,function(i,t){
                        if(t.id === form.id){
                            form.parent.child.splice(i, 1);
                            return false;
                        }
                    })
                }
                //step_2:从表单池中删除自身
                delete _formPool[form.id];
            }
        });

        /**
         * 顶层表单方法：通过id获取表单实例
         * @param id 表单实例的id
         * @returns {*} 表单实例
         */
        RX.getForm = function(id){
            return _formPool[id];
        };

        /**
         * 顶层表单方法：新增表单实例
         * @param targetWin 待新增表单关联的window
         * @returns {*} 表单实例
         */
        RX.addForm = function(targetWin) {
            targetWin = targetWin || root;
            var form = RX.getForm(RX.getFormId(targetWin)) || new RX.Form(targetWin);
            _formPool[form.id] = form;
            return form;
        }

        /**
         * 顶层表单方法：打开弹出层
         * @param options 弹出参数
         * @returns {*} 弹出层index
         */
        //原版窗口管理参数 RX.openStack = function (win, title, areaType, url, param, callBacks, offset) {
        RX.openStack = function (options) {
            options = $.extend(true,{openWin:root},options);
            var areaType = options.areaType,area;
            if (areaType === "small") {
                area = ['450px', '350px'];
            } else if (areaType === "medium") {
                area = ['700px', '500px'];
            } else if (areaType === "big") {
                area = ['900px', '600px'];
            } else if (areaType === "tree") {
                area = ['400px', '600px'];
            } else {
                area = areaType;
            }
            var targetForm = null;
            var openSettings = {
                type: 2,
                title: options.title,
                area: area,
                maxmin: true,
                content: RX.handlePath(options.url),
                success: function (layero, index) {
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    targetForm = RX.getForm(RX.getFormId(iframeWin));
                },
                end:function(){
                    if(targetForm){
                        targetForm.destory();
                    }
                }
            };
            if (options.offset) {
                openSettings.offset = options.offset;
            }
            if (typeof(options.shade) !== "undefined") {
                openSettings.shade = options.shade;
            }
            if (typeof(options.id) !== "undefined") {
                openSettings.id = options.id;
            }
            var index = _top.layer.open(openSettings);

            var form = new RX.Form(
                {id:(_top.name || "*top")+"_"+"layui-layer-iframe"+index},
                "stack",options.openWin,options.param);
            _formPool[form.id] = form;
            return index;
        };

    }else {

        //注册别名：顶层RX命名空间
        var tRX = _top.RX;

        root.layer = _top.layer;

        /**
         * 子层表单方法：通过id获取表单实例
         * @param id 表单实例的id
         * @returns {*} 表单实例
         */
        RX.getForm = function (id) {
            return tRX.getForm(id);
        };

        /**
         * 子层表单方法：新增表单实例
         * @returns {*} 表单实例
         */
        RX.addForm = function () {
            return tRX.addForm(root);
        }

        /**
         * 子层表单方法：打开弹出层
         * @param options 弹出参数
         * @returns {*} 弹出层index
         */
        RX.openStack = function (options) {
            options = $.extend(true,{openWin:root},options);
            return tRX.openStack(options);
        }

        /**
         * 私有方法：向父层表单查找弹出层表单
         * @param childForm 子层表单
         */
        var _findParentStack = function(childForm){
            var parentForm = childForm.parent;
            while(parentForm){
                if(parentForm.type === "stack"){
                    return parentForm;
                }else{
                    parentForm = parentForm.parent;
                }
            }
            return null;
        }

        /**
         * 子层表单方法：关闭弹出层
         * @param num 关闭层数，默认为1
         * @param reloadPrevTag 是否调用刷新方法
         */
        RX.closeStack = function(num,reloadPrevTag){
            if(typeof(reloadPrevTable) === "undedined"){
                reloadPrevTable = true;
            }
            num = num || 1;
            var closeStack = [],targetForm = root.RX.form,prevestForm = targetForm.prev;
            for(var i = 0; i < num; i++){
                if(!targetForm){
                    break;
                }
                if(targetForm.type === "stack"){
                    closeStack.push(targetForm.window.name);
                    prevestForm = targetForm.prev;
                    targetForm = _findParentStack(targetForm);
                }else if(targetForm.type === "frame"){
                    var targetForm = _findParentStack(targetForm);
                    if(!targetForm){
                        break;
                    }
                    closeStack.push(targetForm.window.name);
                    prevestForm = targetForm.prev;
                    targetForm = _findParentStack(targetForm);
                }
            }
            $.each(closeStack,function(i,t){
                layer.close(layer.getFrameIndex(t))
            })
            if(reloadPrevTag && prevestForm && prevestForm.window.reloadTable){
                prevestForm.window.reloadTable();
            }
        }

        RX.closeAllStack = function(){

        }

        RX.goto = function(){

        }

        RX.back = function(){

        }

        RX.fresh = function(){

        }
    }

    //默认操作：创建本层表单实例
    RX.form = RX.addForm();
    //默认操作：注册本层表单实例
    RX.form.register(root);

}).call(this);