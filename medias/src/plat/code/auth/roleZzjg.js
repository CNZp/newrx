/**
 *
 * @param saveAddUserPool
 * @param saveNotUserPool
 * @param saveAddPostPool
 * @param saveNotPostPool
 * @param saveBasePostPool
 * @param basePostGxPost
 * @param saveOrgans
 */
function chooseOrganPostUser(saveAddUserPool, saveNotUserPool, saveAddPostPool, saveNotPostPool, saveBasePostPool, basePostGxPost, saveOrgans) {
//数据对象，存储着交互使用的所有数据
    var dataPool = {
        //记录本次个性操作的数据
        gxAddUserPool: {},   //个性添加的用户数据
        gxNotUserPool: {},   //个性排除的用户数据
        gxAddPostPool: {},      //个性岗位的数据 是机构为key
        gxNotPostPool: {},       //个性岗位排除的数据
        gxAddBasePostPool: {},   //个性增加的基础岗位数据

        //已经保存的数据
        saveAddUserPool: saveAddUserPool || {},
        saveNotUserPool: saveNotUserPool || {},

        saveAddPostPool: saveAddPostPool || {},    //已经保存的包含个性岗位
        saveNotPostPool: saveNotPostPool || {},
        saveBasePostPool: saveBasePostPool || {},

        //辅助操作
        basePostGxPost: basePostGxPost || [],

        //已经保存的organs
        saveOrgans: saveOrgans || [],
        //本次操作的organs，需要进行保存的
        gxOrgans: []
        //
        // saveAddUserPool: {      //已经保存的包含用户数据
        //     "459gw": [{id: 1097, organId: 122}]
        // },
        // saveNotUserPool: {            //已经保存的排除用户数据
        //     "122jg": [{id: 1096}, {id: 1076}]
        // },
        //
        // saveAddPostPool: {},    //已经保存的包含个性岗位
        // saveNotPostPool: {        //已经保存的排除个性岗位
        //     "122jg": [{id: 459, basePostId: 2001, organId: 122}]
        // },
        // saveBasePostPool: {         //已经保存的基础岗位数据
        //     "1601": {id: 1601},
        //     "2001": {id: 2001}
        // },
        //
        // //辅助操作
        // basePostGxPost: {         //根据基础岗位id快速定位个性岗位数据，清除下面的个性用户数据，个性岗位数据
        //     "2001jcgw": [{id: 459, basePostId: 2001, organId: 122}]
        // }
    };
    var leftOrganZtree;
    var rightChildZtree;
    var basePostZtree;
    var showChooseObj;
    //工具对象，提供一系列便捷操作
    //不与业务相关
    var objUtils = {
        /**
         * ztree的配置生成
         * @param param:zreee的配置，onClick，onCheck
         * @returns
         */
        zTreeConfig: function (param) {
            return {
                check: {
                    enable: true,
                    chkboxType: {"Y": "s", "N": "s"}
                },
                callback: {
                    onClick: param.onClick,
                    onCheck: param.onCheck
                },
                view: {
                    expandSpeed: "",
                    selectedMulti: false
                }
            };
        },
        /**
         *  是否存在，后一个对象根据biz配置比较属性（默认为id），返回arr中的index位置
         * @param arr：比较数组
         * @param obj：比较对象
         * @param biz：比较属性（默认为id）
         * @returns {number}返回数组中的位置，-1表示未找到
         */
        isCheck: function (arr, obj, biz) {
            //biz默认为id
            var checkFlag = -1;
            if (arr) {
                if (!biz) {
                    biz = "id";
                }
                var bizArr = biz.split(","), bizLength = bizArr.length, j = 0, flag,
                    i = 0, maxLength = arr.length, arrObj;
                for (; i < maxLength; i++) {
                    arrObj = arr[i];
                    flag = true;
                    for (j = 0; j < bizLength; j++) {
                        if (arrObj[bizArr[j]] != obj[bizArr[j]]) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        checkFlag = i;
                        break;
                    }
                }
            }
            return checkFlag;
        },
        /**
         * 清除对象中制定的key数据，原方法名：clearGxData
         * @param emptyObjArr:数组，数据满足key的清空
         * @param changeBzwObjArr：数组，数据满足key的改变标标志位
         * @param treeNode
         */
        clearData: function (emptyObjArr, changeBzwObjArr, key) {
            if (emptyObjArr && emptyObjArr.length > 0) {
                for (var i = 0, maxLength = emptyObjArr.length; i < maxLength; i++) {
                    if (emptyObjArr[i] && emptyObjArr[i][key]) {
                        emptyObjArr[i][key] = [];
                    }
                }
            }
            if (changeBzwObjArr && changeBzwObjArr.length > 0) {
                for (var i = 0, maxLength = changeBzwObjArr.length; i < maxLength; i++) {
                    if (changeBzwObjArr[i] && changeBzwObjArr[i][key]) {
                        for (var j = 0, bizLength = changeBzwObjArr[i][key].length; j < bizLength; j++)
                            changeBzwObjArr[i][key][j].saveValue = "1";
                    }
                }
            }
        }
    };
    var utils = {
        //也算整合的工具方法
        //存不存在个性数据，存在删除
        aaa: function (saveAddPostPool, gxAddPostPool, parentNode, treeNode) {
            var nextFlagh = true;
            if (saveAddPostPool[parentNode.handleId]) {
                var index = objUtils.isCheck(saveAddPostPool[parentNode.handleId], treeNode);
                if (index > -1) {
                    saveAddPostPool[parentNode.handleId][index].saveValue = "1";
                    nextFlagh = false;
                }
            }
            if (nextFlagh) {
                //删除个性排除的数据
                if (gxAddPostPool[parentNode.handleId]) {
                    var index = objUtils.isCheck(gxAddPostPool[parentNode.handleId], treeNode);
                    if (index > -1) {
                        nextFlagh = false;
                        gxAddPostPool[parentNode.handleId].splice(index, 1);
                        if (treeNode.lx === "gw") {
                            index = objUtils.isCheck(dataPool.basePostGxPost[treeNode.basePostId + "jcgw"], treeNode);
                            if (index > -1) {
                                dataPool.basePostGxPost[treeNode.basePostId + "jcgw"].splice(index, 1);
                            }
                        }
                    }
                }
            }
            return !nextFlagh;
        },
        //存不存add的数据，存在save标志位恢复2，增加个性数据
        bbb: function (saveAddPostPool, gxAddPostPool, parentNode, treeNode) {
            var nextFlag = true;
            if (saveAddPostPool[parentNode.handleId]) {
                var index = objUtils.isCheck(saveAddPostPool[parentNode.handleId], treeNode);
                if (index > -1) {
                    saveAddPostPool[parentNode.handleId][index].saveValue = "2";
                    nextFlag = false;
                }
            }
            if (nextFlag) {
                //新增个性数据
                if (!gxAddPostPool[parentNode.handleId]) {
                    gxAddPostPool[parentNode.handleId] = []
                }
                gxAddPostPool[parentNode.handleId].push(treeNode);
                if (treeNode.lx === "gw") {
                    //增加数据
                    if (!dataPool.basePostGxPost[treeNode.basePostId + "jcgw"]) {
                        dataPool.basePostGxPost[treeNode.basePostId + "jcgw"] = [];
                    }
                    dataPool.basePostGxPost[treeNode.basePostId + "jcgw"].push(treeNode)
                }
            }
        }
    };

    /**
     * 左侧机构用户对象
     * @constructor
     */
    function LeftOrganZtree() {
        // this.parentTree;     //左侧机构树
        // this.parentTreeNodeA;  //当前点击的左侧机构树节点，也就是右侧机构岗位用户树的顶级节点
        var parentOrganTree = this;
        var parentUtil = {};
        //左侧机构树的点击事件函数
        var parentZTreeFunc = {
            /**
             * 树勾选事件
             * @param event
             * @param treeId
             * @param treeNode
             */
            onCheck: function (event, treeId, treeNode) {
                var par = this;
                _top.ZENG.msgbox.show("处理中……", 6, 0, null, window);
                setTimeout(function () {
                    //树节点check的相关处理
                    par._handleZtreeCheck(treeNode);
                    _top.ZENG.msgbox.hide(20, window);
                }, 24);
            },
            /**
             * 数据点击事件
             * @param event
             * @param treeId
             * @param treeNode
             */
            onClick: function (event, treeId, treeNode) {
                //记录当前的子树节点
                parentOrganTree.parentTreeNodeA = treeNode;
                //创建右侧联动树
                rightChildZtree.createZtree(treeNode);
            },
            /**
             * 节点勾选处理
             * @param treeNode：勾选的节点
             * @private
             */
            _handleZtreeCheck: function (treeNode) {
                var checkFlag = treeNode.checked;
                //对于已经保存的数据改变saveValue
                //没保存的数据改变checkFlag，勾选状态
                //处理当前节点，即机构节点
                if (treeNode.saveFlag) {
                    treeNode.saveValue = checkFlag ? "2" : "1";
                    var index = objUtils.isCheck(dataPool.saveOrgans, treeNode);
                    if (index > -1) {
                        dataPool.saveOrgans[index].saveValue = checkFlag ? "2" : "1";
                    } else {
                        RXLog("树节点显示已经保存的机构数据和查出来的数据不一致");
                    }
                } else {
                    treeNode.checkFlag = checkFlag;
                    if (checkFlag) {
                        //先判断存不存在数据池中，不存在添加
                        var index = objUtils.isCheck(dataPool.gxOrgans, treeNode);
                        if (index === -1) {
                            dataPool.gxOrgans.push(treeNode);
                        }
                    } else {
                        var index = objUtils.isCheck(dataPool.gxOrgans, treeNode);
                        if (index > -1) {
                            //删除
                            dataPool.gxOrgans.splice(index, 1);
                        } else {
                            RXLog("添加数据出错");
                        }
                    }
                }
                //清除机构下的个性数据，机构下岗位的个性数据在生成树的时候清除
                //处理数据，清除当前机构下的个性数据   无法清除岗位下的用户数据
                //清除个性操作数据
                parentOrganTree.clearGxData(treeNode);
                //如果当前子节点展开的顶级节点和勾选节点相同，重新绘制树
                if (treeNode === parentOrganTree.parentTreeNodeA) {
                    //创建子树
                    rightChildZtree.createZtree(treeNode);
                }
                //处理子节点
                if (treeNode.children && treeNode.children.length) {
                    for (var i = 0, maxLength = treeNode.children.length; i < maxLength; i++) {
                        this._handleZtreeCheck(treeNode.children[i]);
                    }
                }
            },
            bindSearchEvent: function () {
                //绑定搜索事件
                $("#treeSearch").bind("click", function () {
                    var nodes = parentOrganTree.ztree.getNodesByParamFuzzy("name", "test", null);
                });
            }
        };
        //构建树
        $.ajax({
            type: "post",
            url: "/tree/tbOrganTree?roleId=" + roleId,
            success: function (ar) {
                new ZTreeSearch($("#tree2").parent(), "tree2");
                //个性处理逻辑，关闭遮罩
                $.MyCommon.hideLoading();
                if (ar && ar[0].children) {
                    ar[0].open = true;
                }
                //机构树由于数据可能会比较庞大，故在后端处理已经保存的数据，并记录saveFlag,
                parentOrganTree.ztree = $.fn.zTree.init($("#tree2"), objUtils.zTreeConfig({
                    onCheck: function (event, treeId, treeNode) {
                        parentZTreeFunc.onCheck(event, treeId, treeNode);
                    },
                    onClick: parentZTreeFunc.onClick
                }), ar);
                if (rightChildZtree) {
                    var firstNode = parentOrganTree.ztree.getNodes()[0];
                    parentOrganTree.parentTreeNodeA = firstNode;
                    //创建右侧联动树
                    rightChildZtree.createZtree(firstNode);
                }
            }
        });

        //绑定搜索事件
        parentZTreeFunc.bindSearchEvent();

    }

    LeftOrganZtree.prototype = {
        /**
         * 根据节点清除当前树节点相关的个性树
         * @param treeNode
         */
        clearGxData: function (treeNode) {
            //清除个性岗位数据
            objUtils.clearData([dataPool.gxAddPostPool, dataPool.gxNotPostPool], [dataPool.saveAddPostPool, dataPool.saveNotPostPool], treeNode.handleId);
            //清除个性用户数据
            this._clearGxUserData(treeNode);
        },
        /**
         * 清除个性用户数据
         * @Param treeNode：当前节点
         * @private
         */
        _clearGxUserData: function (treeNode) {
            var gxArr = [dataPool.gxAddUserPool, dataPool.gxNotUserPool],          //本次个性操作的用户数据
                saveArr = [dataPool.saveAddUserPool, dataPool.saveNotUserPool];   //已经保存的用户数据
            if (gxArr && gxArr.length) {
                for (var i = 0, maxLength = gxArr.length; i < maxLength; i++) {
                    this._clearUser(gxArr[i], treeNode, true);
                }
            }
            if (saveArr && saveArr.length) {
                for (var i = 0, maxLength = saveArr.length; i < maxLength; i++) {
                    this._clearUser(saveArr[i], treeNode);
                }
            }
        },
        /**
         *清除当前节点下的用户，私有方法
         * @param dataPool：清除的本次操作的数据池
         * @param treeNode：当前节点
         * @param emptyFlag:数据全清除，否则为改变标志位
         * @private
         */
        _clearUser: function (dataPool, treeNode, emptyFlag) {
            for (var key in dataPool) {
                var handleFlag = false;
                if (key === treeNode.handleId) {
                    handleFlag = true;
                } else {
                    if (dataPool[key] && dataPool[key].length) {
                        for (var i = 0, maxLength = dataPool[key].length; i < maxLength; i++) {
                            //找到数据池中，organId和当前节点id的数据池
                            if (dataPool[key][i].organId == treeNode.id) {
                                handleFlag = true;
                            }
                            break;
                        }
                    }
                }
                if (handleFlag) {
                    var emptyObjArr, changeBzwObjArr;
                    if (emptyFlag) {
                        emptyObjArr = [dataPool];
                    } else {
                        changeBzwObjArr = [dataPool];
                    }
                    objUtils.clearData(emptyObjArr, changeBzwObjArr, key);
                }
            }
        }
    };

    //将接口进行暴露，这样修改者不需要读取全部逻辑即可进行简单的维护

    /**
     * 右侧机构岗位用户树，子树
     * @constructor
     */
    function RightChildZtree() {
        var rightTree = this;
        this.treeFunc = {
            handleChildData: function (treeData, checkFlag) {
                for (var i = 0, maxLength = treeData.length; i < maxLength; i++) {
                    //第一级节点肯定只有一个，顶级节点
                    treeData[i].checked = checkFlag;
                    if (treeData[i].children && treeData[i].children.length) {
                        _handleChild(treeData[i], treeData[i].children);
                    }
                }
            },
            handleChildCheck: function (treeNode, parentNode, flag) {
                var checkFlag = treeNode.checked;
                //初始展开的逻辑可以整合
                if (treeNode.lx === "jg") {
                    //顶级节点操作，更新父tree节点状态
                    parentNode.checked = checkFlag;
                    if (parentNode.saveFlag) {
                        //保存的点，改变状态
                        parentNode.saveValue = checkFlag ? "2" : "1";
                        //对数据池进行操作
                        var index = objUtils.isCheck(dataPool.saveOrgans, treeNode);
                        if (index > -1) {
                            dataPool.saveOrgans[index].saveValue = checkFlag ? "2" : "1";
                        }
                    } else {
                        parentNode.checkFlag = checkFlag;
                        //true - > false
                        if (checkFlag) {
                            //增加数据
                            dataPool.gxOrgans.push(treeNode);
                        } else {
                            //删除数据
                            //true -? false
                            var index = objUtils.isCheck(dataPool.gxOrgans, treeNode);
                            if (index > -1) {
                                dataPool.gxOrgans.splice(index, 1);
                            }
                        }
                    }
                    leftOrganZtree.ztree.updateNode(parentNode);
                    //获取父节点，刷新父节点状态，对数据进行处理，saveFlag等
                    //处理子节点
                    if (treeNode.children && treeNode.children.length) {
                        for (var i = 0, maxLength = treeNode.children.length; i < maxLength; i++) {
                            this.handleChildCheck(treeNode.children[i], treeNode, true);
                        }
                    }
                } else if (treeNode.lx === "gw") {
                    _handleChildCheckObj(treeNode, parentNode, dataPool.saveNotPostPool, dataPool.gxNotPostPool, dataPool.saveAddPostPool, dataPool.gxAddPostPool, flag);
                } else if (treeNode.lx === "yh") {
                    _handleChildCheckObj(treeNode, parentNode, dataPool.saveNotUserPool, dataPool.gxNotUserPool, dataPool.saveAddUserPool, dataPool.gxAddUserPool, flag);
                }
            }
        };
        //处理机构下的节点，先分开处理，之后考虑整合
        //初始展开数据的处理
        function _handleChild(parentNode, childNodes) {
            for (var i = 0, maxLength = childNodes.length; i < maxLength; i++) {
                var childNode = childNodes[i];
                if (childNode.lx === "yh") {
                    //处理人员点
                    _handleInitUserNode(childNode, parentNode);
                } else if (childNode.lx === "gw") {
                    //处理岗位点
                    _handleInitPostNode(childNode, parentNode);
                }
            }
        }

        //初始树时处理用户节点
        //标记初始数据来源
        //以个性数据为准，没有判断上级节点状态
        function _handleInitUserNode(node, parentNode) {
            var czFlag = true;
            //父节点为勾选状态，子节点的状态
            if (parentNode.checked) {
                //先从个性排除的数据中查找
                if (dataPool.gxNotUserPool[parentNode.handleId]) {
                    //存在数据
                    var notUserArr = dataPool.gxNotUserPool[parentNode.handleId];
                    //验证是否存在其中
                    if (objUtils.isCheck(notUserArr, node) > -1) {
                        node.checked = false;
                        czFlag = false;
                    }
                }
                if (czFlag) {
                    //验证已经保存的数据中是否存在
                    notUserArr = dataPool.saveNotUserPool[parentNode.handleId];
                    //主要已经保存的数据中，需要判断saveValue是否改变，没改变或者为1才是有效的数据
                    var index = objUtils.isCheck(notUserArr, node);
                    if (index > -1 && (!notUserArr[index].saveValue || notUserArr[index].saveValue === "2")) {
                        node.checked = false;
                    } else {
                        node.checked = true;
                    }
                }
            } else {
                //先从个性增加的数据中查找
                if (dataPool.gxAddUserPool[parentNode.handleId]) {
                    //存在数据
                    var addUserArr = dataPool.gxAddUserPool[parentNode.handleId];
                    if (objUtils.isCheck(addUserArr, node) > -1) {
                        node.checked = true;
                        czFlag = false;
                    }
                }
                if (czFlag) {
                    //验证已经保存的数据中是否存在
                    addUserArr = dataPool.saveAddUserPool[parentNode.handleId];
                    //主要已经保存的数据中，需要判断saveValue是否改变，没改变或者为1才是有效的数据
                    var index = objUtils.isCheck(addUserArr, node);
                    if (index > -1 && (!addUserArr[index].saveValue || addUserArr[index].saveValue === "2")) {
                        node.checked = true;
                    } else {
                        node.checked = false;
                    }
                }
            }
        }

        //初始树时处理岗位数据
        //先不考虑基础岗位的问题，只后添加逻辑
        //如果存在基础岗位的话，还要判断基础岗位的状态
        /*
        * 1、判断个性数据存不存在，以个性数据为准
        * 2、个性数据不存在，判断基础岗位或者上级点是不是勾选状态
        *
        * 处理逻辑问题，ps：先勾选基础岗位，个性岗位反勾，父亲节点没勾，这是应该再次刷新 数据，个性岗位还是勾的，  个性排除数据是存在的，但展示错误
        * */
        function _handleInitPostNode(node, parentNode) {
            var czFlag = true;
            if (parentNode.checked) {
                /**
                 * 父节点勾选   ，不用查看basepost的数据，判断存不存在个性排除的数据
                 */
                //先从个性排除的数据中查找
                if (dataPool.gxNotPostPool[parentNode.handleId]) {
                    //存在数据
                    var notPostArr = dataPool.gxNotPostPool[parentNode.handleId];
                    //验证是否存在其中
                    if (objUtils.isCheck(notPostArr, node) > -1) {
                        node.checked = false;
                        czFlag = false;
                    }
                }
                if (czFlag) {
                    //岗位中个性数据大于一切
                    //验证已经保存的数据中是否存在
                    var notPostArr = dataPool.saveNotPostPool[parentNode.handleId];
                    //主要已经保存的数据中，需要判断saveValue是否改变，没改变或者为1才是有效的数据
                    var index = objUtils.isCheck(notPostArr, node);
                    if (index > -1 && (!notPostArr[index].saveValue || notPostArr[index].saveValue === "2")) {
                        node.checked = false;
                    } else {
                        node.checked = true;
                    }
                }
            } else {
                /**
                 * 父节点不是勾选，需要判断基础岗位的状态
                 *          1、勾选   ，判断是否存在个性排除的数据
                 *          2、反勾   查看是否存在个性增加的数据
                 *
                 */
                    //查看对应的基础岗位状态  父节点不是勾选
                    //先查找个性数据，以个性数据为准，之后查看父节点以及基础岗位点的状态
                var basePostNode = basePostZtree.ztree.getNodeByParam("id", node.basePostId);
                if (basePostNode && basePostNode.checked) {
                    var czFlag = true;
                    //从个性排除的数据中查找
                    if (dataPool.gxNotPostPool[parentNode.handleId]) {
                        //存在数据
                        var notPostArr = dataPool.gxNotPostPool[parentNode.handleId];
                        if (objUtils.isCheck(notPostArr, node) > -1) {
                            node.checked = false;
                            czFlag = false;
                        }
                    }
                    if (czFlag) {
                        //岗位的话需要判断基础岗位状态，在父节点没勾选状态时
                        //验证已经保存的数据中是否存在
                        notPostArr = dataPool.saveNotPostPool[parentNode.handleId];
                        //主要已经保存的数据中，需要判断saveValue是否改变，没改变或者为1才是有效的数据
                        var index = objUtils.isCheck(notPostArr, node);
                        if (index > -1 && (!notPostArr[index].saveValue || notPostArr[index].saveValue === "2")) {
                            node.checked = false;
                        } else {
                            //不存在个性数据中，以基础岗位为准
                            node.checked = true;
                        }
                    }
                } else {
                    // 父节点不是勾选，基础岗位特不是勾选的，查看add的数据
                    var czFlag = true;
                    //从个性排除的数据中查找
                    if (dataPool.gxAddPostPool[parentNode.handleId]) {
                        //存在数据
                        var addPostArr = dataPool.gxAddPostPool[parentNode.handleId];
                        if (objUtils.isCheck(addPostArr, node) > -1) {
                            node.checked = true;
                            czFlag = false;
                        }
                    }
                    if (czFlag) {
                        //岗位的话需要判断基础岗位状态，在父节点没勾选状态时
                        //验证已经保存的数据中是否存在
                        addPostArr = dataPool.saveAddPostPool[parentNode.handleId];
                        //主要已经保存的数据中，需要判断saveValue是否改变，没改变或者为1才是有效的数据
                        var index = objUtils.isCheck(addPostArr, node);
                        if (index > -1 && (!addPostArr[index].saveValue || addPostArr[index].saveValue === "2")) {
                            node.checked = true;
                        } else {
                            node.checked = false;
                        }
                    }
                }
            }
            //遍历子节点
            if (node.children && node.children.length) {
                for (var i = 0, maxLength = node.children.length; i < maxLength; i++) {
                    if (node.children[i].lx === "yh") {
                        _handleInitUserNode(node.children[i], node);
                    } else if (node.children[i].lx === "gw") {
                        _handleInitPostNode(node.children[i], node);
                    }
                }
            }

        }

        /*
        * flag ->为true是不是由点击引起的check事件
        * 增加个性岗位数据，需要多做处理，如放到   {个性岗位：[]}   数据中，无论增加还是排除
        * */
        function _handleChildCheckObj(treeNode, parentNode, saveNotPostPool, gxNotPostPool, saveAddPostPool, gxAddPostPool, flag) {
            //处理当前节点    目前先不考虑岗位的上下级
            //当前节点的状态，是否存在个性数据中，已经保存的数据中
            //如果初始化的时候标志状态了，可以准确从pool中获取数据

            //并不一定是true -》 false，也可能是true -》 true
            if (treeNode.checked) {
                //节点状态可能是勾选基础岗位选择的   勾选，增加一条勾选的数据，反勾，增加一条过滤的数据
                if (parentNode.checked) {
                    //父节点以及当前节点是勾选的，去除个性数据  去除排除的数据
                    //肯定存在排除的数据，去除
                    //本来就是为checked=true时，数据可能存在一条个性的
                    if (flag) {
                        // //可能存在一条个性add的数据
                        //不是自己触发的，删除个性增加的数据
                        utils.aaa(saveAddPostPool, gxAddPostPool, parentNode, treeNode);
                    } else {
                        //是自己触发的，删除排除的数据
                        utils.aaa(saveNotPostPool, gxNotPostPool, parentNode, treeNode);
                    }
                } else {
                    // //父节点没有勾选，当前节点勾选了，就是新增个性数据，判断已经保存的数据池中存不存在
                    //判断基础岗位有没有勾选，勾选的话不增加个性数据
                    var handleFlag = true;
                    if (treeNode.lx === "gw") {
                        var basePostNode = basePostZtree.ztree.getNodeByParam("id", treeNode.basePostId);
                        //基础岗位勾选，个性岗位自己手动勾选，不增加个性数据
                        if (basePostNode.checked) {
                            handleFlag = false;
                        }
                    }
                    if (handleFlag) {
                        utils.bbb(saveAddPostPool, gxAddPostPool, parentNode, treeNode);
                    }
                }
            } else {          //当前节点没有勾选
                if (parentNode.checked) {
                    // //父节点勾选了 增加个性排除的数据
                    utils.bbb(saveNotPostPool, gxNotPostPool, parentNode, treeNode);
                } else {
                    //父节点没勾，子节点没勾，可能   ture -》 false，也可能是false ->fasle
                    //父节点也没余勾选  去除add的数据
                    if (flag) {
                        //如果这是基础岗位为true，增加个性排除的数据，不存在增加，存在不管
                        var handleFlag = true;
                        if (treeNode.lx === "gw") {
                            var basePostNode = basePostZtree.ztree.getNodeByParam("id", treeNode.basePostId);
                            //基础岗位勾选，个性岗位自己手动勾选，不增加个性数据
                            if (basePostNode.checked) {
                                //肯定存在个性岗位数据
                                handleFlag = false;
                            }
                        }
                        if (handleFlag) {
                            utils.aaa(saveNotPostPool, gxNotPostPool, parentNode, treeNode);
                        }
                    } else {
                        //自己手动点击的,true -> false
                        var nextFlag = true;
                        if (treeNode.lx === "gw") {
                            var basePostNode = basePostZtree.ztree.getNodeByParam("id", treeNode.basePostId);
                            //基础岗位勾选，个性岗位自己手动勾选，不增加个性数据
                            if (basePostNode.checked) {
                                //增加个性排除的数据
                                utils.bbb(saveNotPostPool, gxNotPostPool, parentNode, treeNode);
                                nextFlag = false;
                            }
                        }
                        if (nextFlag) {
                            //删除add数据
                            utils.aaa(saveAddPostPool, gxAddPostPool, parentNode, treeNode);
                        }
                    }
                }
            }
            //处理子节点
            if (treeNode.children && treeNode.children.length) {
                for (var i = 0, maxLength = treeNode.children.length; i < maxLength; i++) {
                    rightTree.treeFunc.handleChildCheck(treeNode.children[i], treeNode, true);
                }
            }
        }
    }

    RightChildZtree.prototype = {
        /**
         * 子树提供的创建ztree的方法
         * @param parentTreeNode
         */
        createZtree: function (parentTreeNode) {
            var rightChildZtree = this;
            $.ajax({
                type: "post",
                url: "/tree/organTree?type=5&tid=" + parentTreeNode.id,
                success: function (ar) {
                    new ZTreeSearch($("#tree21").parent(), "tree21");
                    //先进行数据的处理
                    rightChildZtree.treeFunc.handleChildData(ar, parentTreeNode.checked);
                    //根据父级树构建子级机构岗位用户树
                    rightChildZtree.ztree = $.fn.zTree.init($("#tree21"), objUtils.zTreeConfig({
                        onCheck: function (event, treeId, treeNode) {
                            var parentNode;
                            if (treeNode.lx === "jg") {
                                parentNode = parentTreeNode;
                            } else {
                                parentNode = treeNode.getParentNode();
                            }
                            rightChildZtree.treeFunc.handleChildCheck(treeNode, parentNode);
                        }
                    }), ar);
                }
            })
        }
    };

    /**
     * 基础岗位区
     * @constructor
     */
    function BasePostZtree() {
        var basePostTree = this;
        var basePostFunc = {
            /**
             * 生成树的初始数据处理
             * @param ar
             */
            handleBasePostData: function (ar) {
                for (var i = 0, maxLength = ar.length; i < maxLength; i++) {
                    if (dataPool.saveBasePostPool[ar[i].id]) {
                        ar[i].checked = true;
                        ar[i].saveFlag = true;
                        ar[i].saveValue = 2;
                    }
                    if (ar[i].children && ar[i].children.length) {
                        this.handleBasePostData(ar[i].children);
                    }
                }
            },
            /**
             * 根据当前节点checked处理数据池
             * @param treeNode
             */
            handlePoolByNode: function (treeNode) {
                //本条数据的处理，已经保存的点改变状态，未保存的点根据checked增加或者删除数据
                if (treeNode.saveFlag) {
                    dataPool.saveBasePostPool[treeNode.id].saveValue = treeNode.checked ? 2 : 1;
                } else {
                    if (treeNode.checked) {
                        dataPool.gxAddBasePostPool[treeNode.id] = treeNode;
                    } else {
                        if (dataPool.gxAddBasePostPool[treeNode.id]) {
                            delete dataPool.gxAddBasePostPool[treeNode.id];
                        }
                    }
                }
            },
            _ifCanClear: function (treeNode, organId) {
                //是否需要清除个性数据
                //清除的数据类型
                var oragnNode = leftOrganZtree.ztree.getNodeByParam("id", organId);
                //1、父节点或者子节点为true，则是清除个性增加的点，
                if (treeNode.checked) {
                    return "add";
                } else {
                    return treeNode.checked === oragnNode.checked ? "not" : "add"
                }
            }
        };
        $.ajax({
            type: "post",
            url: "/tree/basePostTree?roleId=" + roleId,
            success: function (ar) {
                new ZTreeSearch($("#tree3").parent(), "tree3");
                //机构树由于数据可能会比较庞大，故在后端处理已经保存的数据，并记录saveFlag,
                basePostFunc.handleBasePostData(ar);
                basePostTree.ztree = $.fn.zTree.init($("#tree3"), objUtils.zTreeConfig({
                    onCheck: function (event, treeId, treeNode) {
                        //数据处理，本条数据的处理，以及删除由此基础岗位生成的个性数据
                        basePostFunc.handlePoolByNode(treeNode);
                        //清除数据
                        basePostTree.clearData(treeNode);
                        //重新绘制右边树
                        rightChildZtree.createZtree(leftOrganZtree.parentTreeNodeA);
                    }
                }), ar);
            }
        });
    }

    BasePostZtree.prototype = {
        /**
         * 1、本条数据的处理
         * 2、清除基础岗位对应的个性岗位s（多个）的个性数据，包括用户岗位
         * @param treeNode
         */
        clearData: function (treeNode) {
            //清除基础岗位对应的个性岗位s（多个）的个性数据，包括用户岗位
            if (dataPool.basePostGxPost[treeNode.id + "jcgw"]) {
                var postArr = dataPool.basePostGxPost[treeNode.id + "jcgw"], i = 0, maxLength = postArr.length;
                for (; i < maxLength; i++) {
                    // var clearLx = this._ifCanClear(treeNode, postArr[i].organId);
                    // if (clearLx === "add") {
                    //目前来看是基础岗位和上级机构checked不一致时才会清除个性数据，并不是统一清除
                    postArr[i].handleId = postArr[i].id + "gw";
                    //用户数据，岗位下的个性用户数据
                    //清除的前置条件，满足条件清除
                    objUtils.clearData([dataPool.gxAddUserPool, dataPool.gxNotUserPool], [dataPool.saveAddUserPool, dataPool.saveNotUserPool], postArr[i].handleId, treeNode.checked);
                    //岗位数据。机构下的当前岗位数据
                    var organId = postArr[i].organId;
                    //找到对应的岗位个性数据删除
                    utils.aaa(dataPool.saveAddPostPool, dataPool.gxAddPostPool, {handleId: organId + "jg"}, postArr[i], treeNode.checked);
                    utils.aaa(dataPool.saveNotPostPool, dataPool.gxNotPostPool, {handleId: organId + "jg"}, postArr[i], treeNode.checked);
                }
                // }else if(clearLx === "out"){
                //     postArr[i].handleId = postArr[i].id + "gw";
                //     // objUtils.clearData([dataPool.gxNotUserPool], [dataPool.saveNotUserPool], postArr[i].handleId, treeNode.checked);
                //     //岗位数据。机构下的当前岗位数据
                //     var organId = postArr[i].organId;
                //     utils.aaa(dataPool.saveNotPostPool, dataPool.gxNotPostPool, {handleId: organId + "jg"}, postArr[i], treeNode.checked);
                // }
                // }
            }
        }
    };

    //第四部分显示已经关联的要素信息，可以进行快捷操作，提供render方法
    function ShowChooseObj() {
        var showObj = this;
        //根据dataPool中的数据渲染表单
        $(".glinfo_title").on("click", function () {
            showObj.showOrHideView(this);
        });

        $(".glinfo_left_item").on("click", function () {
            $(".glinfo_left_item").removeClass("glinfo_left_select");
            $(this).addClass("glinfo_left_select");
        });

        var renderGlxx = initGrid();
        showObj._renderGlxx = renderGlxx;
//
        $("#glinfoOrgan").on("click", function () {
            showObj.renderOrgans();
        });
        // $("#glinfoOrgan").trigger("click");

        $("#glinfoBasePost").on("click", function () {
            showObj.renderBasePosts();
        });

        $("#glinfoInPost").on("click", function () {
            showObj.renderInPosts();
        });

        $("#glinfoOutPost").on("click", function () {
            showObj.renderOutPosts();
        });

        $("#glinfoInUser").on("click", function () {
            showObj.renderInUsers();
        });

        $("#glinfoOutUser").on("click", function () {
            showObj.renderOutUsers();
        });

        //删除
        $(".tableUl").on("click", "li a", function () {
            var _index = $(this).attr("_index");
            layer.confirm("确定删除？", function (index) {
                layer.close(index);
                // $(this).remove();
                var selData = showObj.renderData[_index];
                var area = showObj._renderArea;
                var treeNode;
                var renderFunc;
                if (area === "inOrgan") {
                    renderFunc = showObj.renderOrgans;
                    //从数据中获取  dataPool.saveOrgans,dataPool.gxOrgans.
                    //数组
                    var index = objUtils.isCheck(dataPool.saveOrgans, selData);
                    if (index > -1) {
                        dataPool.saveOrgans[index].saveValue = "1";
                        treeNode = leftOrganZtree.ztree.getNodeByParam("handleId", dataPool.saveOrgans[index].handleId);
                        treeNode.checked = false;
                    } else {
                        index = objUtils.isCheck(dataPool.gxOrgans, selData);
                        if (index > -1) {
                            treeNode = leftOrganZtree.ztree.getNodeByParam("handleId", dataPool.gxOrgans[index].handleId);
                            treeNode.checked = false;
                            treeNode.checkFlag = false;
                            dataPool.gxOrgans.splice(index, 1);
                        } else {
                            RXLog("删除数据出错！！！");
                            return;
                        }
                    }
                    //数据联动修改，去除相关个性数据，去除机构话，个性排除的数据可能要清除
                    //去除机构的话，个性排除用户数据需要清除，机构下的岗位？？？？
                    //考虑清除数据类型，是和点击机构树一样全部清除个性数据？？还是。。。。
                    //如果是清除个性数据的话，可以和父节点点击事件整合
                    leftOrganZtree.ztree.updateNode(treeNode);
                    leftOrganZtree.clearGxData(treeNode);
                } else if (area === "basePost") {
                    renderFunc = showObj.renderBasePosts;
                    //从数据中获取  dataPool.saveBasePostPool,dataPool.gxAddBasePostPool
                    if (dataPool.saveBasePostPool[selData.id]) {
                        dataPool.saveBasePostPool[selData.id].saveValue = "1";
                        treeNode = basePostZtree.ztree.getNodeByParam("id", dataPool.saveBasePostPool[selData.id].id);
                        treeNode.checked = false;
                    } else if (dataPool.gxAddBasePostPool[selData.id]) {
                        treeNode = basePostZtree.ztree.getNodeByParam("id", dataPool.gxAddBasePostPool[selData.id].id);
                        treeNode.checked = false;
                        treeNode.checkFlag = false;
                        delete dataPool.gxAddBasePostPool[selData.id];
                    } else {
                        RXLog("删除数据出错！！！");
                        return;
                    }
                    basePostZtree.ztree.updateNode(treeNode);
                    basePostZtree.clearData(treeNode);
                } else if (area === "inPost") {
                    renderFunc = showObj.renderInPosts;
                    //从数据中获取  dataPool.saveAddPostPool,dataPool.gxAddPostPool
                    //清除自身数据
                    if (dataPool.saveAddPostPool[selData.organId + "jg"]) {
                        var index = objUtils.isCheck(dataPool.saveAddPostPool[selData.organId + "jg"], selData);
                        if (index > -1) {
                            dataPool.saveAddPostPool[selData.organId + "jg"][index].saveValue = "1";
                            treeNode = dataPool.saveAddPostPool[selData.organId + "jg"][index];
                        }
                    } else if (dataPool.gxAddPostPool[selData.organId + "jg"]) {
                        var index = objUtils.isCheck(dataPool.gxAddPostPool[selData.organId + "jg"], selData);
                        if (index > -1) {
                            treeNode = dataPool.gxAddPostPool[selData.organId + "jg"][index];
                            //删除数据
                            dataPool.gxAddPostPool[selData.organId + "jg"].splice(index, 1);
                        }
                    }
                    //清除岗位下面个性用户数据
                    if (treeNode) {
                        objUtils.clearData([dataPool.gxAddUserPool, dataPool.gxNotUserPool], [dataPool.saveAddUserPool, dataPool.saveNotUserPool], treeNode.handleId);
                    } else {
                        RXLog("包含岗位数据不一致");
                    }

                } else if (area === "outPost") {
                    renderFunc = showObj.renderOutPosts;
                    //从数据中获取  dataPool.saveNotPostPool,dataPool.gxNotPostPool
                    //清除自身数据
                    if (dataPool.saveNotPostPool[selData.organId + "jg"]) {
                        var index = objUtils.isCheck(dataPool.saveNotPostPool[selData.organId + "jg"], selData);
                        if (index > -1) {
                            dataPool.saveNotPostPool[selData.organId + "jg"][index].saveValue = "1";
                            treeNode = dataPool.saveNotPostPool[selData.organId + "jg"][index];
                        }
                    } else if (dataPool.gxNotPostPool[selData.organId + "jg"]) {
                        var index = objUtils.isCheck(dataPool.gxNotPostPool[selData.organId + "jg"], selData);
                        if (index > -1) {
                            treeNode = dataPool.gxNotPostPool[selData.organId + "jg"][index];
                            //删除数据
                            dataPool.gxNotPostPool[selData.organId + "jg"].splice(index, 1);
                        }
                    }
                    //清除岗位下面个性用户数据
                    if (treeNode) {
                        objUtils.clearData([dataPool.gxAddUserPool, dataPool.gxNotUserPool], [dataPool.saveAddUserPool, dataPool.saveNotUserPool], treeNode.handleId);
                    } else {
                        RXLog("包含岗位数据不一致");
                    }
                } else if (area === "inUser") {
                    renderFunc = showObj.renderInUsers;
                    //从数据中获取  dataPool.saveAddUserPool dataPool.gxAddUserPool
                    //直接删除数据即可
                    var key;
                    if (selData.postId) {
                        key = selData.postId + "gw";
                    } else if (selData.organId) {
                        key = selData.organId + "jg";
                    } else {
                        RXLog("用户无所属机构以及岗位");
                    }
                    if (dataPool.saveAddUserPool[key]) {
                        var index = objUtils.isCheck(dataPool.saveAddUserPool[key], selData);
                        if (index > -1) {
                            dataPool.saveAddUserPool[key][index].saveValue = "1";
                        }
                    } else if (dataPool.gxAddUserPool[key]) {
                        var index = objUtils.isCheck(dataPool.gxAddUserPool[key], selData);
                        if (index > -1) {
                            dataPool.gxAddUserPool[key].splice(index, 1);
                        }
                    } else {
                        RXLog("包含的用户找不到");
                    }
                } else if (area === "outUser") {
                    renderFunc = showObj.renderOutUsers;
                    //从数据中获取  dataPool.saveNotUserPool dataPool.gxNotUserPool
                    var key;
                    if (selData.postId) {
                        key = selData.postId + "gw";
                    } else if (selData.organId) {
                        key = selData.organId + "jg";
                    } else {
                        RXLog("用户无所属机构以及岗位");
                    }
                    if (dataPool.saveNotUserPool[key]) {
                        var index = objUtils.isCheck(dataPool.saveNotUserPool[key], selData);
                        if (index > -1) {
                            dataPool.saveNotUserPool[key][index].saveValue = "1";
                        }
                    } else if (dataPool.gxNotUserPool[key]) {
                        var index = objUtils.isCheck(dataPool.gxNotUserPool[key], selData);
                        if (index > -1) {
                            dataPool.gxNotUserPool[key].splice(index, 1);
                        }
                    } else {
                        RXLog("排除的用户找不到");
                    }
                } else {
                    RXLog("数据没找到区域");
                }
                if (renderFunc) {
                    renderFunc.call(showObj);
                }
                //先不管，全部重新构建子树
                rightChildZtree.createZtree(leftOrganZtree.parentTreeNodeA);
            });
        });

        function initGrid() {
            var glinfoGrid = {
                data: [],
                searchData: [],
                searchName: "",
                total: 0,
                limit: 12,
                pageMax: 1,
                pageNum: 1
            }
            var $ul = $(".tableUl"), $paging = $(".rx-paging");

            function renderPageData() {
                $ul.empty();
                var handleData = glinfoGrid.searchName ? glinfoGrid.searchData : glinfoGrid.data;
                showObj.renderData = handleData;
                for (var i = (glinfoGrid.pageNum - 1) * glinfoGrid.limit; i < (glinfoGrid.pageNum) * glinfoGrid.limit && i < glinfoGrid.allTotal; i++) {
                    handleData[i]._index = i;
                    handleData[i].saveObj = {
                        saveValue: (handleData[i].saveFlag ? (handleData[i].saveValue ? handleData[i].saveValue : "2") : "2"),
                        info: handleData[i].info
                    };
                    $ul.append(RX.tpl("glinfoLi", handleData[i]));
                }
                $(".paged").text(glinfoGrid.pageNum);
            }

            function renderGrid(searchName) {
                var handleData = glinfoGrid.data;
                $ul.empty();
                $paging.empty();
                if (searchName) {
                    if (searchName != glinfoGrid.searchName) {
                        glinfoGrid.searchName = searchName;
                        glinfoGrid.searchData = [];
                        $.each(glinfoGrid.data, function (i, t) {
                            if (t.name.indexOf(searchName) >= 0) {
                                glinfoGrid.searchData.push(t);
                            }
                        })
                    }
                    handleData = glinfoGrid.searchData;
                } else {
                    glinfoGrid.searchName = "";
                    glinfoGrid.searchData = [];
                }
                var totlaLength = 0, alllength = 0;
                for (var i = 0, maxLength = handleData.length; i < maxLength; i++) {
                    if (!handleData[i].saveValue || handleData[i].saveValue === "2") {
                        totlaLength++;
                    }
                    alllength++;
                }
                glinfoGrid.total = totlaLength;
                glinfoGrid.allTotal = alllength;
                glinfoGrid.pageNum = 1;
                glinfoGrid.pageMax = Math.floor(glinfoGrid.total / glinfoGrid.limit) + 1;
                $paging.append(RX.tpl("paging", {
                    total: glinfoGrid.total,
                    pageMax: glinfoGrid.pageMax, pageNum: glinfoGrid.pageNum
                }));
                if (handleData.length > 0) {
                    renderPageData();
                }
                if (!glinfoGrid.total) {
                    $ul.append('<div style="width:100%;text-align:center;">无数据</div>');
                }
            }

            $("#search").on("click", function () {
                renderGrid($("#searchName").val() || "");
            })
            $paging.on("click", ".rx-frist", function () {
                if (glinfoGrid.pageNum === 1) {
                    return;
                }
                glinfoGrid.pageNum--;
                renderPageData();
            })
            $paging.on("click", ".rx-last", function () {
                if (glinfoGrid.pageNum === glinfoGrid.pageMax) {
                    return;
                }
                glinfoGrid.pageNum++;
                renderPageData();
            })
            return function (data) {
                $("#searchName").val("");
                glinfoGrid.data = data || [];
                glinfoGrid.pageNum = 1;
                glinfoGrid.searchName = "";
                glinfoGrid.searchData = [];
                renderGrid();
                renderGrid();
            }
        }

        //遮罩事件
        $("#msgShade1").bind("click", function () {
            showObj.showOrHideView();
        })
    }

    ShowChooseObj.prototype = {
        renderOrgans: function () {
            //dataPool.saveOrgans,dataPool.gxOrgans.
            //处理渲染数据
            // var arr = this._handleRenderObj([dataPool.saveOrgans, dataPool.gxOrgans])
            //根据数据渲染
            //点击事件，标志位等，方便查找处理数据
            //记录上层key，方便处理value中的数据
            var arr = dataPool.gxOrgans.concat(dataPool.saveOrgans);
            this._renderArea = "inOrgan";
            this._renderGlxx(arr);
        },
        renderBasePosts: function () {
            //dataPool.saveBasePostPool,dataPool.gxAddBasePostPool
            var arr = this._handleRenderObj([dataPool.saveBasePostPool, dataPool.gxAddBasePostPool]);
            this._renderArea = "basePost";
            this._renderGlxx(arr);
        },
        renderInPosts: function () {
            //dataPool.saveAddPostPool,dataPool.gxAddPostPool
            var arr = this._handleRenderObj([dataPool.saveAddPostPool, dataPool.gxAddPostPool]);
            this._renderArea = "inPost";
            this._renderGlxx(arr);
        },
        renderOutPosts: function () {
            //dataPool.saveNotPostPool,dataPool.gxNotPostPool
            var arr = this._handleRenderObj([dataPool.saveNotPostPool, dataPool.gxNotPostPool]);
            this._renderArea = "outPost";
            this._renderGlxx(arr);
        },
        renderInUsers: function () {
            //dataPool.saveAddUserPool dataPool.gxAddUserPool
            var arr = this._handleRenderObj([dataPool.saveAddUserPool, dataPool.gxAddUserPool]);
            this._renderArea = "inUser";
            this._renderGlxx(arr);
        },
        renderOutUsers: function () {
            //dataPool.saveNotUserPool dataPool.gxNotUserPool
            var arr = this._handleRenderObj([dataPool.saveNotUserPool, dataPool.gxNotUserPool]);
            this._renderArea = "outUser";
            this._renderGlxx(arr);
        },
        _handleRenderObj: function (renderObjArr) {
            var arr = [];
            for (var j = 0, objMaxLength = renderObjArr.length; j < objMaxLength; j++) {
                var renderObj = renderObjArr[j];
                for (var key in renderObj) {
                    var objArr = renderObj[key];
                    if (Object.prototype.toString.apply(objArr) === "[object Array]") {
                        for (var i = 0, maxLength = objArr.length; i < maxLength; i++) {
                            // if (!objArr[i].saveValue || objArr[i].saveValue === "2") {
                            arr.push(objArr[i]);
                            // }
                        }
                    } else {
                        arr.push(objArr);
                    }
                }
            }
            return arr;
        },
        showOrHideView: function (el) {
            var $content = $(".glinfo_content");
            var $el = el ? $(el) : $(".glinfo_title");
            var $frameShade = $("#msgShade1");
            if ($content.is(":hidden")) {
                $content.show("slow");
                $el.text("点击收起已关联要素信息");
                var $organ = $("#glinfoOrgan");
                if (!$organ.hasClass("glinfo_left_select")) {
                    $(".glinfo_left_item").removeClass("glinfo_left_select");
                    $("#glinfoOrgan").addClass("glinfo_left_select");
                }
                this.renderOrgans();
                $frameShade.show();
                //增加遮罩
            } else {
                $content.hide("slow");
                $frameShade.hide();
                $el.text("点击展开已关联要素信息");
                //移除遮罩
            }
        }
    };


    rightChildZtree = new RightChildZtree();
    leftOrganZtree = new LeftOrganZtree();

    basePostZtree = new BasePostZtree();
    showChooseObj = new ShowChooseObj();

    return {
        /**
         * 放回需要保存的数据对象
         */
        getSaveOrganData: function () {
            //获取需要删除的数据，包含的变成排除的
            var delOrganArr = [];
            for (var i = 0, maxLength = dataPool.saveOrgans.length; i < maxLength; i++) {
                if (dataPool.saveOrgans[i].saveValue === "1") {
                    delOrganArr.push(dataPool.saveOrgans[i].id);
                }
            }
            //获取本次新增的organ数据
            var addOrganArr = [];
            for (var i = 0, maxLength = dataPool.gxOrgans.length; i < maxLength; i++) {
                addOrganArr.push(dataPool.gxOrgans[i].id);
            }

            //基础岗位暂不考虑
            //post
            //本次增加的岗位
            var addPostArr = [];
            for (var value in dataPool.gxAddPostPool) {
                for (var i = 0, maxLength = dataPool.gxAddPostPool[value].length; i < maxLength; i++) {
                    addPostArr.push(dataPool.gxAddPostPool[value][i].id);
                }
                // addPostArr = addPostArr.concat(gxAddPostPool[value]);
            }
            //本次排除的岗位
            var removePostArr = [];
            for (var value in dataPool.gxNotPostPool) {
                for (var i = 0, maxLength = dataPool.gxNotPostPool[value].length; i < maxLength; i++) {
                    removePostArr.push(dataPool.gxNotPostPool[value][i].id);
                }
                // removePostArr = removePostArr.concat(gxNotPostPool[value]);
            }
            //删除的岗位数据
            var delPostArr = [];
            var saveAddPostArr = [];
            for (var value in dataPool.saveAddPostPool) {
                saveAddPostArr = saveAddPostArr.concat(dataPool.saveAddPostPool[value])
            }
            for (var value in dataPool.saveNotPostPool) {
                saveAddPostArr = saveAddPostArr.concat(dataPool.saveNotPostPool[value]);
            }
            var delPostData = [];
            for (var i = 0, maxLength = saveAddPostArr.length; i < maxLength; i++) {
                if (saveAddPostArr[i].saveValue === "1") {
                    //删除
                    delPostData.push(saveAddPostArr[i].id);
                }
            }

            //基础岗位
            var addBasePost = [];
            for (var key in dataPool.gxAddBasePostPool) {
                // for (var i = 0, maxLength = dataPool.gxAddBasePostPool[key].length; i < maxLength; i++) {
                addBasePost.push(dataPool.gxAddBasePostPool[key].id);
                // }
            }

            //删除的个性岗位数据
            var delBaseData = [];  //为saveValue=1的
            for (var key in dataPool.saveBasePostPool) {
                // for (var i = 0, maxLength = dataPool.saveBasePostPool[key].length; i < maxLength; i++) {
                if (dataPool.saveBasePostPool[key].saveValue == "1") {
                    delBaseData.push(dataPool.saveBasePostPool[key].id);
                }
                // }
            }

            //个性增加的用户数据
            var gxAddUser = [];
            for (var key in dataPool.gxAddUserPool) {
                for (var i = 0, maxLength = dataPool.gxAddUserPool[key].length; i < maxLength; i++) {
                    gxAddUser.push(dataPool.gxAddUserPool[key][i].id);
                }
            }
            //个性排除的用户数据
            var gxNotUser = [];
            for (var key in dataPool.gxNotUserPool) {
                for (var i = 0, maxLength = dataPool.gxNotUserPool[key].length; i < maxLength; i++) {
                    gxNotUser.push(dataPool.gxNotUserPool[key][i].id);
                }
            }

            //删除的用户数据
            var delUserArr = [];
            for (var value in dataPool.saveAddUserPool) {
                delUserArr = delUserArr.concat(dataPool.saveAddUserPool[value]);
            }
            for (var value in dataPool.saveNotUserPool) {
                delUserArr = delUserArr.concat(dataPool.saveNotUserPool[value]);
            }
            var delUser = [];
            for (var i = 0, maxLength = delUserArr.length; i < maxLength; i++) {
                if (delUserArr[i].saveValue === "1") {
                    delUser.push(delUserArr[i].id);
                }
            }
            return {
                addOrganStr: addOrganArr.join(","),
                delOrganStr: delOrganArr.join(","),

                addPostStr: addPostArr.join(","),
                removePostStr: removePostArr.join(","),
                delPostStr: delPostData.join(","),

                addBasePostStr: addBasePost.join(","),
                delBasePost: delBaseData.join(","),

                gxAddUserStr: gxAddUser.join(","),
                gxNotUserStr: gxNotUser.join(","),
                delUserStr: delUser.join(",")
            }
        },
        getParentTree: function () {
            return leftOrganZtree.ztree;
        }
    }
}