/*****************************************************************
 * RX.button-0.1
 * RX按钮组件
 * 最后更新时间：2017-09-22
 * 最后更新人：Zp
 *
 * 更新时间： 2017-10-23
 * 更新人：mrq
 * 更新内容：在zp的基础上完善button控件
 *
 * 更新时间： 2017-11-01
 * 更新人：mrq
 * 更新内容：增加功能权限控制
 * 配置控制显示逻辑，比如：权限控制，状态控制  功能权限  其它设置
 *****************************************************************/

(function (global) {
    //注册RX空间
    window.RX = window.RX || {};

    //组件池声明
    var widgetPool = {};

    //内部方法，执行配置回调
    function callFunction(obj, func) {
        var result = true;
        if (typeof(func) == "function" && arguments.length >= 2) {
            result = func.apply(obj, Array.prototype.slice.call(arguments, 2));
        }
        if (typeof(result) != "boolean" || result != false) {
            return true;
        }
        return false;
    }

    var defaultButtonJson = {
        id: "",                  //button对应的标识，唯一
        code: "",                //页面配置的code，如果配置了则由功能权限配置，无则按照自己的配置显示隐藏
        name: "新增",             //显示名称
        icon: null,             //图标，目前支持iconfont的设置
        display: true,          //是否显示，默认显示
        beforeClick: null,      //点击按钮前触发的事件，return false时onClick事件不触发
        onClick: null           //按钮点击事件
        //提供渲染布局模板？？？？，只需增加配置即可
    };
    //buttongroup默认配置
    var defaults = {
        tag: "._rx_grid_control",
        tpl: null,                      //使用模板实现布局，暂未实现
        param: {},                      //可以个性添加的参数等，用于扩展功能
        title: null,
        className: "action_button",  //样式
        buttons: [                      //配置的button数组
            defaultButtonJson
        ],
        pageCode: "",                    //页面id，功能权限使用，配置了则查找相应页面的功能权限
        beforeInit: function (param) {    //初始化事件
            return true
        },
        onInit: function (param) {
        }
    };

    //Button对象类构造声明
    var Button = function (el, json) {
        //填充默认值
        this.hadleJson = $.extend(true, {}, defaultButtonJson, json);
        this.el = el;
        this.init();
    };

    //Button对象类属性声明
    Button.prototype = {
        //初始化
        init: function () {
            var button = this;
            var json = button.hadleJson;
            //该节点是否显示
            this.ifShow = json.display;
            //创建dom
            var $dom = $('<li style="' + (json.display ? "" : "display:none;") + '"><a href="javascript:void(0)" id="' + json.id + '"><i class="iconfont">' + json.icon + '</i>' + json.name + '</a></li>');
            button.dom = $dom;
            $dom.bind("click", function () {
                var buttonJson = json;
                if (buttonJson.beforeClick) {
                    if ((typeof buttonJson.beforeClick === "function" && buttonJson.onClick() === false) || (typeof buttonJson.onClick === "string" || buttonJson.onClick + "()" === false)) {
                        return;
                    }
                }
                if (buttonJson.onClick) {
                    if (typeof buttonJson.onClick === "function") {
                        buttonJson.onClick();
                    } else if (typeof buttonJson.onClick === "string") {
                        eval(buttonJson.onClick + "()");
                    }
                }
            });
            button.el.append($dom);
        },
        //显示
        show: function () {
            this.dom.show();
        },
        //隐藏
        hide: function () {
            this.dom.hide();
        },
        //移除
        remove: function () {
            this.dom.remove();
        }
    };

    //ButtonGroup对象类构造声明
    var ButtonGroup = function ($obj, options) {
        //1、注册容器
        this.$obj = $obj;
        //2、注册参数
        this.options = $.extend(true, {}, options);
        //3、注册gridId：容器dom的Id，不在则为"_grid"+8位随机数
        this.id = $obj.attr("id");
        if (!this.id) {
            this.id = "_button_group_" + Math.floor(Math.random() * 100000000);
            $obj.attr("id", this.id);
        }
        //初始化当前group中的button对象
        this.buttonPool = {};
        //4、向组件池中注册
        widgetPool[this.id] = this;
        //初始显示的buttons
        this.initShowNum = 0;
        //5、布局初始化
        this.init();
    };

    //ButtonGroup对象类属性声明
    ButtonGroup.prototype = {
        init: function () {
            var buttonGroup = this,
                buttonPool = buttonGroup.buttonPool,
                $obj = buttonGroup.$obj, options = buttonGroup.options, param = options.param,
                buttons = options.buttons;
            //处理buttons数据
            buttonGroup.handleButtons(buttons, options.pageCode);
            if (callFunction(buttonGroup, options.beforeInit, param)) {
                $obj.empty();
                //使用模板创建
                if (options.tpl) {
                    $obj.append(options.tpl(buttons));
                } else {
                    //记录子行插入的位置
                    buttonGroup.insertEL = $("<ul class='" + options.className + "'></ul>");
                    if (buttons && buttons.length > 0) {
                        var newButton;
                        $.each(buttons, function (i, t) {
                            newButton = new Button(buttonGroup.insertEL, t);
                            buttonPool[t.id] = newButton;
                            newButton.ifShow && buttonGroup.initShowNum++;
                        })
                    }
                    $obj.append(buttonGroup.insertEL);
                }
                callFunction(buttonGroup, options.onInit, param);
            }
        },
        //处理buttons数据，和功能权限对比
        handleButtons: function (buttons, pageCode) {
            //后期通用接口，可以处理功能权限，状态，自定义处理等数据
            this.hanldeButtonsByAuth(buttons, pageCode);
        },
        //功能权限控制
        hanldeButtonsByAuth: function (buttons, pageCode) {
            var buttonAuths = this.getSysAuthByPage(pageCode), maxLength = buttonAuths.length,
                button, buttonLength = buttons.length;
            for (var i = 0; i < buttonLength; i++) {
                button = buttons[i];
                //资源控制
                if (button.code) {
                    var flag = false;
                    for (var j = 0; j < maxLength; j++) {
                        if (button.code == buttonAuths[j].code) {
                            flag = true;
                            //删除
                            buttonAuths.splice(j, 1);
                            maxLength--;
                            break;
                        }
                    }
                    if (!flag) {
                        buttons.splice(i, 1);
                        buttonLength--;
                        i--;
                    }
                }
            }
        },
        getSysAuthByPage: function (pageCode) {
            //先直接从后台获取，之后可以考虑从前端缓存中获取，登录时缓存权限等信息
            var sysAuth = [];
            if (pageCode) {
                $.ajax({
                    type: "get",
                    url: "/resource/getUserResource?type=func&parentCode=" + pageCode,
                    async: false,
                    success: function (ar) {
                        if (ar.success) {
                            sysAuth = ar.data;
                        } else {
                            layer.alert(ar.msg);
                        }
                    }
                });
            }
            return sysAuth;
        },
        //显示
        //无参显示全部 配置的ids，以逗号隔开
        showButtons: function (ids) {
            var buttonGroup = this;
            var buttonPool = buttonGroup.buttonPool;
            if (ids) {
                var codeArr = ids.split(",");
                for (var i = 0, maxLength = codeArr.length; i < maxLength; i++) {
                    buttonPool[codeArr[i]] && buttonPool[codeArr[i]].show();
                }
            } else {
                for (var button in buttonPool) {
                    buttonPool[button].show();
                }
            }
        },
        //隐藏
        //无参隐藏全部 配置的ids，以逗号隔开
        hideButtons: function (ids) {
            var buttonGroup = this;
            var buttonPool = buttonGroup.buttonPool;
            if (codeArr) {
                var codeArr = ids.split(",");
                for (var i = 0, maxLength = codeArr.length; i < maxLength; i++) {
                    buttonPool[codeArr[i]] && buttonPool[codeArr[i]].hide();
                }
            } else {
                for (var button in buttonPool) {
                    buttonPool[button].hide();
                }
            }
        },
        //添加新的button
        //模板创建的需要知道el，普通不需要传入el
        addButton: function (json, el) {
            var buttonGroup = this;
            if (!el) {
                el = buttonGroup.insertEL;
            }
            if (json) {
                //数组
                if (Object.prototype.toString.apply(json) == "[object Array]") {
                    for (var i = 0, maxLength = json.length; i < maxLength; i++) {
                        buttonGroup.buttonPool[t.id] = new Button(el, json[i]);
                    }
                } else {
                    //字符串
                    buttonGroup.buttonPool[t.id] = new Button(el, json);
                }
            }
        },
        //移除
        removeAll: function () {
            var buttonPool = this.buttonPool;
            for (var i = 0, maxLength = buttonPool.length; i < maxLength; i++) {
                buttonPool[i].remove();
            }
        },
        //初始显示的button数目
        showButtonsNum: function () {
            return this.initShowNum;
        }
    };

    RX.button = {
        //ButtonGroup构建方法
        //参数：$obj （Jquery元素）button的dom容器， options （Json）构建参数
        //返回值：group
        //添加对全部buttongroup的操作
        init: function ($obj, options) {
            if (!$obj) {
                return null;
            }
            if (!options) {
                options = {};
            }
            return new ButtonGroup($obj, $.extend(true, {}, defaults, options));
        },
        //ButtonGroup获取方法
        //参数：buttonGroupId （String）ButtonGroup的dom容器的id
        //返回值：ButtonGroup buttonGroup对象
        get: function (id) {
            return widgetPool[id];
        },
        //ButtonGroup销毁方法
        //参数：buttonGroupId （String）ButtonGroup的dom容器的id
        destroy: function (id) {
            if (widgetPool[id] != undefined) {
                //清除buttons控件
                widgetPool[id].removeAll();
                //存在
                delete widgetPool[id];
            }
        }
    }
})(this);