var func = GetQueryString("func");     //回调函数
var modelName = GetQueryString("modelName");     //model名称
var filterLx = GetQueryString("filterLx");    //过滤类型
var filterId = GetQueryString("filterId");    //过滤id
var treeType = GetQueryString("treeType");    //树的类型 1：机构树，2：机构岗位树，3：机构用户树，4：机构岗位用户树
var hasNoOrgan = GetQueryString("hasNoOrgan");   //是否有 无机构要素  默认为否,true or false
var id = GetQueryString("id");       //第一次树展开的数据id
var lx = GetQueryString("lx");       //第一次树展开的数据类型    机构（jg）、岗位（gw）、用户（ry）
var filterTypeOnTree = GetQueryString("filterTypeOnTree"); //返回到前台数据进行过滤的类型
var multiTag = false || GetQueryString("multiTag"); //多选标志
var cascadeSel = GetQueryString("cascadeSel");//  Y:级联选择  N:非级联选择  默认：Y
var mainTree;      //树
var selectType = GetQueryString("selectType"); //选择类型  （备注：选用户时加上的，可以考虑代码重构，具有三个（选择用户、岗位、或三者都可以选））
var multiType = GetQueryString("multiType");  //多选类型 ("ry",只能选择用户，“jg”只能机构多选，“gw”只能岗位多选)
$(function () {
    //初始化尺寸
    resizeForm();
    //注册请求中msg
    pageAjax();
    //打开加载中标志
    pageAjax();

    function config() {
        var url = "/tree/organTree?hasTop=false";
        if (treeType) {
            url += "&type=" + treeType;
        }
        if (filterLx) {
            url += "&filterLx=" + filterLx;
        }
        if (filterId && filterId != "null") {
            url += "&filterId=" + filterId;
        }
        if (hasNoOrgan) {
            url += "&hasNoOrgan=" + hasNoOrgan;
        }
        if (id) {
            url += "&tid=" + id;
        }
        if (lx) {
            url += "&tlx=" + lx;
        }
        if (multiType) {
            url += "&multiType=" + multiType;
        }
        var asyncConfig = {
            enable: true, type: "post", url: url,
            autoParam: ["id", "lx"]
        };
        if (filterTypeOnTree || multiType) {
            asyncConfig.dataFilter = ajaxDataFilter;
        }
        var setting = {
            data: {
                simpleData: {
                    enable: true,
                    idKey: "handleId",
                    pIdKey: "pId",
                    rootPId: 0
                }
            },
            async: asyncConfig,
            callback: {
                onAsyncSuccess: zTreeOnAsyncSuccess,
                onCheck: zTreeOnCheck
            },
            view: {
                expandSpeed: "",
                selectedMulti: false
            }
        };
        if (multiTag) {
            if (cascadeSel == "N") {
                setting.check = {
                    enable: true,
                    chkboxType: {"Y": "", "N": ""}
                };
            } else {
                setting.check = {
                    enable: true
                };
            }

            setting.view.notShowClass = true;
        }
        return setting;
    }

    mainTree = $.fn.zTree.init($("#tree"), config());

    //数据过滤
    function ajaxDataFilter(treeId, parentNode, childNodes) {
        var filterData = [];
        if (childNodes) {
            for (var i = 0; i < childNodes.length; i++) {
                if (filterTypeOnTree) {
                    if (childNodes[i].lx == filterTypeOnTree && childNodes[i].id != id) {
                        continue;
                    } else {
                        if (multiType && childNodes[i].lx != multiType) {
                            childNodes[i].nocheck = true;
                        }
                    }
                } else if (multiType && childNodes[i].lx != multiType) {
                    childNodes[i].nocheck = true;
                }
                filterData.push(childNodes[i]);
            }
        }
        return filterData;
    }

    //保存按钮事件
    $("#confirm").click(function () {
        var userFlag = GetQueryString("userFlag");
        var nodes = mainTree.getSelectedNodes();
        if (multiTag) {
            nodes = mainTree.getCheckedNodes();
        }
        if (userFlag) {
            if (nodes.length > 0) {
                if (nodes[0].id == 0) {
                    layer.alert("该机构不能选择");
                    return;
                }
                var jgName;
                var jgId;
                var gwName;
                var gwId;
                if (nodes.length > 0) {
                    if (nodes[0].lx == "jg") {
                        jgName = nodes[0].name;
                        jgId = nodes[0].id;
                    }
                    if (nodes[0].lx == "gw") {
                        gwName = nodes[0].name;
                        gwId = nodes[0].id;
                        var jgNode = getJgNode(nodes[0]);
                        jgName = jgNode.name;
                        jgId = jgNode.id;
                    }
                }
                var evalFunc = eval("getPrevWin()." + func);
                result = evalFunc(jgName, jgId, gwName, gwId);
                if (result || typeof(result) == "undefined") {
                    closeWin();
                }
            } else {
                layer.alert("请选择相应机构");
            }
        } else {
            if (nodes.length > 0) {
                if (nodes[0].id == 0) {
                    layer.alert("该机构不能选择");
                    return;
                }
                if (nodes[0].lx == filterTypeOnTree) {
                    layer.alert("请选择一个岗位");
                    return;
                }
                if (selectType && selectType != nodes[0].lx) {
                    if (selectType == "jg") {
                        layer.alert("请选择一个机构")
                    } else if (selectType == "gw") {
                        layer.alert("请选择一个岗位");
                    } else if (selectType == "ry") {
                        layer.alert("请选择一个用户");
                    }
                    return;
                }
                var name = [], id = [];
                for (var i = 0; i < nodes.length; i++) {
                    name.push(nodes[i].name);
                    id.push(nodes[i].id);
                }
                var evalFunc = eval("getPrevWin()." + func);
                var parentNode = nodes[0].getParentNode();
                result = evalFunc(modelName, name.join(","), id.join(","), nodes[0].lx);
                if (result || typeof(result) == "undefined") {
                    closeWin();
                }
            } else {
                layer.alert("请选择相应机构");
            }
        }
    });
});

function zTreeOnCheck(event, treeId, treeNode) {
    if (treeNode.isParent) {
        mainTree.reAsyncChildNodes(treeNode, "refresh");
    }
}

//获取机构子节点的第一个机构父节点
function getJgNode(node) {
    var parentNode = node.getParentNode();
    if (parentNode.lx == 'jg') {
        return parentNode;
    } else {
        return getJgNode(parentNode);
    }
}

//异步加载树默认展开节点
var firstAsyncSuccessFlag = 0;

function zTreeOnAsyncSuccess(event, treeId, msg) {
    if (firstAsyncSuccessFlag == 0) {
        try {
            //调用默认展开第一个结点
            var nodes = mainTree.getNodes();
            if (nodes.length == 0) {
                layer.alert("数据不存在", function (index) {
                    layer.close(index);
                    closeWin();
                });
            } else {
                mainTree.expandNode(nodes[0], true);
                firstAsyncSuccessFlag = 1;
                closeLoading();
            }
        } catch (err) {
        }
    }
}
