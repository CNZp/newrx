/*****************************************************************
 * _Form-0.1
 * 工具：表单管理，表单接口实现与默认操作
 * 最后更新时间：2018-01-29
 * 最后更新人：Zp
 * 更新内容：初步实现新版表单管理控制流，需要补充细节
 *
 * 最后更新时间：2018-01-29
 * 最后更新人：Zp
 * 更新内容：考虑控制窗口管理相关实现的作用域，将Form类移入本作用域
 *
 * 最后更新时间：2018-01-30
 * 最后更新人：Zp
 * 更新内容：实现表单管理与表单基本操作
 ******************************************************************/
(function () {
    //注册别名：window/global
    var root = this;

    /**
     * 私有方法：获取表单id
     * @param win 获取层window
     * @returns {string} 表单id
     * @private
     */
    var _getFormId = function (win) {
        if (win === _top) {
            return win.name || "*top";
        } else {
            return _getFormId(win.parent) + "_" + win.name;
        }
    }

    /**
     * 窗口管理体系定义
     */
    //引入页为顶层
    if (root === _top) {

        //自动加载：顶层加载layer与遮蔽层相关文件
        RX.loadCssBlocked([].concat(["layer", "/medias/plugin/loading/msgbox.css"]));
        RX.loadScriptBlocked(["layer", "/medias/lib/plat/layerManager.js", "msgbox"]);

        //注册闭包变量：顶层表单池
        var _formPool = {};

        //FIXME：调试用临时代码：表单池
        RX._formPool = _formPool;

        /**
         * 表单类声明，继承自基础类
         */
        var _Form = RX.Base.extend({
            //表单基础属性
            id: null,   //id
            window: null,   //对应window
            type: null,     //表单层次类型："frame"嵌套层，"stack"弹出层
            url: null,   //当前url
            param: {},    //表单参数,object型数据
            history: [],    //表单url历史

            //表单关系属性
            prev: null, //上层表单
            next: [],   //下层表单
            parent: null,   //父层表单
            child: [],  //子层表单
            /**
             * 初始化方法
             * @param targetWin 表单对应window
             * @param type  表单层次类型
             * @param openWin   打开该层的window
             * @param param  表单参数
             * @returns {_Form} 表单实例
             */
            initialize: function (targetWin, type, openWin, param) {
                //表单基础属性初始化
                this.window = targetWin = targetWin || _top;
                this.id = targetWin.id || _getFormId(targetWin);
                this.type = type = type || "frame";
                this.param = param || {};
                this.history = [];
                this.next = [];
                this.child = [];

                RX.log(this.id + "_initialize");

                //若当前层为顶层，无需构建关系
                if (_top.name === targetWin.name) {
                    return this;
                }

                //依据表单层次类型，进行表单关系属性初始化
                //Case_frame:嵌套层
                if (type === "frame") {
                    //Step_frame:获取嵌套父层，实现父子关系
                    var openForm = RX.getForm(_getFormId(openWin || targetWin.parent));
                    if (openForm) {
                        this.parent = openForm;
                        openForm.child.push(this);
                    }
                } else if (type === "stack") {  //Case_stack:弹出层
                    //Step_frame:获取弹出上层，实现上下关系
                    var openForm = RX.getForm(_getFormId(openWin));
                    if (openForm) {
                        this.prev = openForm;
                        openForm.next.push(this);
                    }
                }

                return this;
            },
            /**
             * 注册方法（计划表单页面运行时执行，更新关联窗口实例，插入实际对应窗口）
             * @param targetWin
             * @returns {_Form} 表单实例
             */
            register: function (targetWin) {
                RX.log(this.id + "_register");

                this.window = targetWin;
                this.url = targetWin.document.location.href;
                this.history.push(this.url);
                //TODO：解析url，整合param

                this.afterRegister.apply(this, arguments);
                return this;
            },
            /**
             * 注册方法后置
             */
            afterRegister: function () {
            },
            /**
             * 表单布局自适应
             * @returns {_Form} 表单实例
             */
            resize: function () {
                return this;
            },
            /**
             * 子页传参方法
             * （若子页表单实例存在，则调整其表单参数；若子页表单实例不存在，则初始化子页表单实例）
             * @param childWin
             * @param param
             * @returns {*}
             */
            addChildParam: function(childWin,param){
                var childId = childWin.id || (this.id + "_" + childWin.name),
                    form = _formPool[childId];
                if(form){
                    form.param = $.extend(true, {}, param);
                }else{
                    form = new _Form(
                        {id: childId},
                        "frame", this.window, param);
                    _formPool[form.id] = form;
                }
                return form;
            },
            /**
             * 获取某个子层
             * @param index 下标
             * @returns {*} 表单实例
             */
            getChild:function(index) {
                var index = parseInt(index || 0);
                //若下标有效,则获取下标位的子层
                if(!index.isNaN() && index >= 0 && index < this.child.length){
                    return this.child[index];
                }else{
                    return null;
                }
            },
            /**
             * 获取某个兄弟层
             * @param index 下标
             * @returns {*} 表单实例
             */
            getBrother:function(index) {
                if(!this.parent){
                    return null;
                }
                //若本层为弹出层，则获取上层的下层作为备选组；若本层为嵌套层，则获取父层的子层作为备选组
                var targetArr = this.type === "stack" ? this.prev.next : this.parent.child,
                    index = parseInt(index || 0);
                //若下标有效,则获取备选组中下标位对应的层
                if(!index.isNaN() && index >= 0 && index < targetArr.length){
                    return targetArr[index];
                }else{
                    return null;
                }
            },
            /**
             * 打开弹出层
             * @param options 弹出参数
             * @returns {*} 弹出层index
             */
            open: function (options) {
                options = $.extend(true, {}, options);
                options.openWin = this.window;
                var areaType = options.areaType, area;
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
                        targetForm = RX.getForm(_getFormId(iframeWin));
                    },
                    end: function () {
                        if (targetForm) {
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

                var form = new _Form(
                    {id: (_top.name || "*top") + "_" + "layui-layer-iframe" + index},
                    "stack", options.openWin, options.param);
                _formPool[form.id] = form;
                return index;
            },
            /**
             * 跳转路径
             * @param url 待跳转地址
             */
            goto: function (url) {
                if (url) {
                    this.window.location.href = url;
                }
            },
            /**
             * 回退路径
             * @param num 回退次数，默认为1
             */
            back: function (num) {
                num = num || 1;
                var history = this.history, backUrl = null;
                for (var i = 0; i <= num; i++) {
                    if (history.length) {
                        backUrl = history.pop();
                    }
                }
                if (backUrl) {
                    this.window.location.href = backUrl;
                }
            },
            /**
             * 刷新
             */
            refresh: function () {
                var backUrl = null;
                if (this.history.length) {
                    backUrl = this.history.pop();
                }
                if (backUrl) {
                    this.window.location.href = backUrl;
                }
            },
            /**
             * 关闭弹出层（本层开始）
             * @param num 关闭层数，默认为1
             * @param reloadPrevTag 是否调用关闭上层刷新方法，默认为true
             */
            close: function (num, reloadPrevTag) {
                /**
                 * 私有方法：向父层表单查找弹出层表单
                 * @param childForm 子层表单
                 */
                var _findParentStack = function (childForm) {
                    var parentForm = childForm.parent;
                    while (parentForm) {
                        if (parentForm.type === "stack") {
                            return parentForm;
                        } else {
                            parentForm = parentForm.parent;
                        }
                    }
                    return null;
                }
                if (typeof(reloadPrevTag) === "undedined") {
                    reloadPrevTag = true;
                }
                num = num || 1;
                var closeStack = [], targetForm = this, prevestForm = targetForm.prev;
                for (var i = 0; i < num; i++) {
                    if (!targetForm) {
                        break;
                    }
                    if (targetForm.type === "stack") {
                        closeStack.push(targetForm.window.name);
                        prevestForm = targetForm.prev;
                        targetForm = _findParentStack(targetForm);
                    } else if (targetForm.type === "frame") {
                        var targetForm = _findParentStack(targetForm);
                        if (!targetForm) {
                            break;
                        }
                        closeStack.push(targetForm.window.name);
                        prevestForm = targetForm.prev;
                        targetForm = _findParentStack(targetForm);
                    }
                }
                $.each(closeStack, function (i, t) {
                    layer.close(layer.getFrameIndex(t))
                })
                if (reloadPrevTag && prevestForm && prevestForm.window.reloadTable) {
                    prevestForm.window.reloadTable();
                }
            },
            /**
             * 关闭所有弹出层
             */
            closeAll: function () {
                layer.closeAll();
            },
            /**
             * 销毁表单实例
             */
            destory: function () {
                RX.log(this.id + "_destory");
                var form = this;
                //step_1:按情况清除对外关系
                //case_1_prev:存在上层
                if (form.prev) {
                    //step_1_prev_1:清除上层中本层的关系
                    $.each(form.prev.next, function (i, t) {
                        if (t.id === form.id) {
                            form.prev.next.splice(i, 1);
                            return false;
                        }
                    })
                    //case_1_prev_next:存在下层
                    if (form.next.length) {
                        //step_1_prev_next_1:将本层的下层关系赋予上层
                        $.each(form.next, function (i, t) {
                            t.prev = form.prev;
                            form.prev.next.push(t);
                        })
                    }
                } else {  //case_1_!prev:不存在上层
                    //case_1_!prev_next:存在下层
                    if (form.next.length) {
                        //step_1_!prev_next_1:销毁本层的下层
                        //(因本层已不存在，且无上层可以赋予关系，可以直接销毁下层)
                        $.each(form.next, function (i, t) {
                            t.destory();
                        })
                    }
                }
                //case_1_child:存在子层
                if (form.child.length) {
                    //step_1_children:销毁本层的子层
                    //(父层控制子层生命周期，父层销毁，子层html销毁，子层无效)
                    $.each(form.child, function (i, t) {
                        t.destory();
                    })
                }
                //case_1_parent:存在父层
                if (form.parent) {
                    //step_1_parent_1:销毁父层中本层的关系
                    $.each(form.parent.child, function (i, t) {
                        if (t.id === form.id) {
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
        RX.getForm = function (id) {
            return _formPool[id];
        };

        /**
         * 顶层表单方法：新增表单实例
         * @param targetWin 待新增表单关联的window，默认为本层window
         * @returns {*} 表单实例
         */
        RX.addForm = function (targetWin) {
            //默认为本层
            targetWin = targetWin || root;
            //获取或创建初始化的表单实例
            var form = RX.getForm(_getFormId(targetWin)) || new _Form(targetWin);
            //
            _formPool[form.id] = form;
            return form;
        }

    } else {    //引入页非顶层

        //注册别名：顶层RX命名空间
        var tRX = _top.RX;

        //继承顶层：本层layer由顶层layer继承
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
    }

    //默认操作：创建本层表单实例
    RX.form = RX.addForm();
    //默认操作：装饰本层表单实例
    RX.form.makeup({
        resize: function () {
            //TODO：根据RX配置，设置页面resize方法
            RX.log(this.id + " resize");
        },
        afterRegister: function () {
            var form = this;
            $(function () {
                form.resize();
            })
        }
    });
    //默认操作：注册本层表单实例
    RX.form.register(root);


}).call(this);