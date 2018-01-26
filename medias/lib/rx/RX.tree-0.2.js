/*
* 对ztree进行一层封装，易于使用
* */
(function (global) {
    //注册RX空间
    global.RX = global.RX || {};
    //工具方法
    var treeUtil = {
        //是否为数组
        isArray: function (b) {
            return Object.prototype.toString.apply(b) === "[object Array]"
        },
        expandFirstTreeNode: function (handleFunc, func) {
            var firstAsyncSuccessFlag = 0;
            return (function (event, treeId, msg) {
                var tree = this.getZTreeObj(treeId);
                if (firstAsyncSuccessFlag == 0)
                    try {
                        //调用默认展开第一个结点
                        var nodes = tree.getNodes();
                        tree.expandNode(nodes[0], true);
                        firstAsyncSuccessFlag = 1;
                        closeLoading();
                        if (handleFunc && typeof handleFunc == "function") {
                            handleFunc(treeId, nodes[0]);
                        }
                    } catch (err) {
                        RX.log("获取不到ztree，检查设置id");
                    }
                //异步加载成功执行的函数
                if (func && typeof func === "function") {
                    func(tree, msg);
                }
            })
        }
    };
    //ztree池
    var treePool = {};
    //ztree的树实例
    var rxZtree = {
        //使用主配置
        defaultConfig: {
            idKey: "id",     //主键名称
            pId: "pId",        //父节点标志
            async: true,                //同步/异步
            asyncConfig: {
                autoParam: ["id"],         //每次向后台传入的参数，默认为id
                otherParam: {},             //
                isFirstExpand: true,     //初次加载是否展开第一个节点
                onAsyncSuccess: null      //异步加载正常结束的事件
            },
            type: "post",               //请求方式
            url: "",                      //请求url     非异步加载数据时，异步请求用什么配置项

            //多选方式
            chkStyle: "",   //勾选框类型  checkBox，radio  ,无值时默认不能多选
            chkboxType: {"Y": "ps", "N": "ps"},   //勾选节点的影响
            radioType: "level",    //radio 的分组范围，默认为level：在每一级节点范围内当做一个分组，all：在整棵树范围内当做一个分组

            //事件
            event: {
                onCheck: null,           //选中事件
                onClick: null,            //点击节点事件  可以为function或者为字符串
                onDblClick: null         //双击事件   默认双击展开父节点，设置了双击事件默认不展开
                //.....多个和ztree结合，选着事件
            },

            //编辑配置，为true是开启默认编辑功能
            canEdit: false,
            //编辑操作
            editConfig: {
                //拖动配置
                dragConfig: {
                    beforeDrag: null,    //选中的节点是否可以移动，方法参数（treeId, treeNodes），注意可以选择多个
                    beforeDrop: null,    //判断是否可以移至目标节点，方法参数（treeId, treeNodes, targetNode, moveType），moveType ："inner"：成为子节点，"prev"：成为同级前一个节点，"next"：成为同级后一个节点
                    onDrop: null          //拖曳结束后，数据处理，方法参数（event, treeId, treeNodes, targetNode, moveType）
                },
                //编辑配置,系统提供两种默认图标功能，1、节点移除 2、节点名称修改
                //是否显示remove标志
                showRemove: false,
                removeConfig: {
                    title: "删除",
                    beforeRemove: null,
                    onRemove: null
                },
                //是否显示rename标志
                showRename: false,
                renameConfig: {
                    title: "修改",
                    beforeRename: null,
                    onRename: null
                }
            },

            //辅助操作，如：为节点末尾多图标辅助操作等
            viewConfig: {
                //显示的图标受节点类型控制，有业务控制
                addHoverDom: null,  //节点后增加图标，移到对应节点显示，移除消失，使用class设置图标位置，func事件
                // 如果为数组，则节点统一处理。如果为func则返回处理之后的图标数组：[{class: "", title:"",func: null}]，
                addDiyDom: null    //用于在节点上固定显示用户自定义控件
            }
        },
        //处理rxConfig —> ztreeConfig
        hanleConfig: function (rxconfig) {
            var config = {setting: {}, url: "", type: ""};
            var conf = $.extend(true, {}, this.defaultConfig, rxconfig);
            //处理config，转化为ztreeConfig
            var setting = {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: conf.idKey,
                        pIdKey: conf.pId,
                        rootPId: 0
                    }
                },
                check: {},
                async: {},
                callback: {},
                edit: {},
                view: {}
            };
            //多选、单选等
            if (conf.chkStyle) {
                var checkConfig = {
                    enable: true,
                    chkStyle: conf.chkStyle
                };
                if (conf.chkStyle == "radio") {
                    checkConfig.radioType = conf.radioType;
                } else {
                    checkConfig.chkboxType = conf.chkboxType;
                }
                setting.check = checkConfig;
            } else {
                setting.view.selectedMulti = false;
            }

            //事件
            setting.callback = $.extend(true, {}, conf.event);
            if (setting.callback.onDblClick) {
                setting.view.dblClickExpand = false;
            }

            //编辑
            if (conf.canEdit) {
                //可编辑
                var edit = {
                    enable: true
                };
                var c = conf.editConfig;
                if (c.showRemove) {
                    edit.showRemoveBtn = true;
                    edit.removeTitle = c.removeConfig.title;
                    setting.callback.beforeRemove = c.removeConfig.beforeRemove;
                    setting.callback.onRemove = c.removeConfig.onRemove;
                } else {
                    edit.showRemoveBtn = false;
                }
                if (c.showRename) {
                    edit.showRenameBtn = true;
                    edit.renameTitle = c.renameConfig.title;
                    setting.callback.beforeRename = c.renameConfig.beforeRename;
                    setting.callback.onRname = c.removeConfig.onRname;
                } else {
                    edit.showRenameBtn = false;
                }
                setting.callback.beforeDrag = c.dragConfig.beforeDrag;
                setting.callback.beforeDrop = c.dragConfig.beforeDrop;
                setting.callback.onDrop = c.dragConfig.onDrop;
                setting.edit = edit;
            }
            if (conf.viewConfig.addDiyDom) {
                setting.view.addDiyDom = conf.viewConfig.addDiyDom;
            }
            if (conf.viewConfig.addHoverDom) {
                setting.view.addHoverDom = this.addHoverDom(conf.viewConfig.addHoverDom);
                setting.view.removeHoverDom = this.removeHoverDom(conf.viewConfig.addHoverDom);
            }
            //同步/异步加载数据（async）
            if (conf.async) {
                //异步加载
                setting.async = {
                    enable: true,
                    type: conf.type,
                    url: conf.url,
                    autoParam: conf.asyncConfig.autoParam,
                    otherParam: conf.asyncConfig.otherParam
                };
                if (conf.asyncConfig.isFirstExpand) {
                    if (conf.asyncConfig.onAsyncSuccess) {
                        setting.callback.onAsyncSuccess = treeUtil.expandFirstTreeNode(null, conf.asyncConfig.onAsyncSuccess);
                    }
                } else if (conf.asyncConfig.onAsyncSuccess) {
                    setting.callback.onAsyncSuccess = conf.asyncConfig.onAsyncSuccess;
                }

            } else {
                //同步加载
                config.url = conf.url;
                config.type = conf.type;
            }
            config.setting = setting;
            return config;
        },
        addHoverDom: function (addHoverDomConf) {
            return function (treeId, treeNode) {
                var conf = addHoverDomConf;
                var addArr = [];
                if (conf) {
                    if (treeUtil.isArray(conf)) {
                        addArr = conf;
                    } else {
                        addArr = conf(treeNode);
                    }
                }
                //前置判断，是否已经添加
                var canAdd = true;
                if (!treeNode.editNameFlag) {
                    for (var i = 0, maxLength = addArr.length; i < maxLength; i++) {
                        if ($("#" + addArr[i].class + "Btn_" + treeNode.id).length > 0) {
                            canAdd = false;
                            break;
                        }
                    }
                } else {
                    canAdd = false;
                }
                if (canAdd) {
                    var sObj = $("#" + treeNode.tId + "_span");
                    for (var i = 0; i < maxLength; i++) {
                        var addObj = addArr[i];
                        var ableStr = "<span class='button " + addObj.class + "' id='" + addObj.class + "Btn_" + treeNode.id
                            + "' title='" + addObj.title + "' onfocus='this.blur();'></span>";
                        sObj.append(ableStr);
                        var ableBtn = $("#ableBtn_" + treeNode.id);
                        if (ableBtn) {
                            ableBtn.bind("click", function () {
                                if (addObj && typeof addObj.func === "function") {
                                    addObj.func(treeNode);
                                }
                            });
                        }
                    }
                }
            }
        },
        removeHoverDom: function (addHoverDomConf) {
            return function (treeId, treeNode) {
                var conf = addHoverDomConf;
                var addArr = [];
                if (conf) {
                    if (treeUtil.isArray(conf)) {
                        addArr = conf;
                    } else {
                        addArr = conf(treeNode);
                    }
                }
                var i = 0, maxLength = addArr.length;
                for (; i < maxLength; i++) {
                    $("#" + addArr[i].class + "Btn_" + treeNode.id).unbind().remove();
                }
            };
        }
    };

    //Ztree
    function Ztree($dom, cof) {
        this.$dom = $dom;
        this.cof = cof;
    }

    Ztree.prototype = {
        init: function () {
            var ztree = this, $dom = ztree.$dom, conf = ztree.cof;
            var config = rxZtree.hanleConfig(conf);
            if (config.url) {
                //同步加载
                $.ajax({
                    type: config.type,
                    url: config.url,
                    async: false,   //先默认为false
                    success: function (ar) {
                        ztree.ztreeObj = $.fn.zTree.init($dom, config.setting, ar);
                    }
                })
            } else {
                ztree.ztreeObj = $.fn.zTree.init($dom, config.setting);
            }
        },
        //获取选择的节点
        getSelectNodes: function () {
            //结合配置项，给出数据
            var conf = this.cof, selNodes;
            var treeObj = this.getZtreeObj();
            if (conf.chkStyle) {
                selNodes = treeObj.getCheckedNodes();
            } else {
                selNodes = treeObj.getSelectNodes();
            }
            return selNodes;
        },
        //获取ztree对象
        getZtreeObj: function () {
            return this.ztreeObj;
        },
        /*
        * funName : 方法名称
        * param : 参数
        * 。。。。。
        * 多个参数一直在后面写
        * */
        method: function (funName, param) {
            var arguArr = [].slice.call(arguments), length = arguments.length;
            if (this[funName]) {
                return this[funName].apply(this, arguments.slice(1, length));
            } else {
                return this.ztreeObj[funName].apply(this.ztreeObj, arguArr.slice(1, length));
            }
        }
    };

    /*
     * 生成ztree的位置必须用id标识
     * */
    RX.tree = {
        //生成ztree
        init: function ($obj, conf) {
            var ztree = new Ztree($obj, conf);
            ztree.init();
            if ($obj.attr("id")) {
                treePool[$obj.attr("id")] = ztree;
            }
            return ztree;
        },
        //获取ztree对象,id不存在放回所有ztree
        get: function (id) {
            //对ztree的对象进行简单的封装，封装基本的操作方法
            if (id) {
                return treePool[id];
            } else {
                return treePool;
            }
        },
        //销毁ztree
        destroy: function (ids) {

        }
    }
})(window);