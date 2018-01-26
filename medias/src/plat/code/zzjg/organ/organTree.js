/**
 * 异步机构树
 */
var func = GetQueryString("func");            //回调函数
var modelName = GetQueryString("modelName");  //供回调函数使用
var type = GetQueryString("type");         //操作类型    xz:按钮显示
var kind = GetQueryString("kind");         //树的种类   o:机构树 ou:机构用户树  默认：o
var selectType = GetQueryString("selectType"); //选择方式，单选多选。 "sin":单选 "mul:多选  默认：sin
var cascadeSel = GetQueryString("cascadeSel");//  Y:级联选择  N:非级联选择  默认：Y

var mainTree;    //机构树
$(function () {
    //初始化尺寸
    resizeTable();
    //注册请求中msg
    pageAjax();
    //同步树
    setMenuTree();

    var zTree = $.fn.zTree.getZTreeObj("tree");  //获取树对象

    //判断是否级联选择
    if (cascadeSel === 'N') {
        var selType = {"Y": "ps", "N": "s"};
        zTree.setting.check.chkboxType = selType;
    }

    //判断操作类型
    if (type == "xz") {
        $("#confirm").show();
    }

    $("#confirm").click(function () {
        var nodes = mainTree.getSelectedNodes();
        var evalFunc = eval("getPrevWin()." + func);
        var ids = "", names = '';
        $.each(nodes, function (i, t) {
            if (!i == nodes.length - 1) {
                ids += t.id + ",";
                names += t.name + ",";
            } else {
                ids += t.id;
                names += t.name;
            }

        });
        evalFunc(modelName, ids, names);
        closeWin();
    });
});

//菜单树配置
function setMenuTree() {
    var url = "/tree/getOrganTree?kind=" + kind;
    var setting = {
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: 0
            }
        },
        edit: {
            enable: true,
            drag: {
                isCopy: false,    //是否允许复制节点，true时拖动节点变成复制该节点，按ctrl拖动表示复制
                isMove: true
            },
            showRenameBtn: false,
            showRemoveBtn: false
        },
        async: {
            enable: true, type: "post", url: url,
            autoParam: ["id", "lx"]
        },
        view: {
            dblClickExpand: false
        },
        callback: {
            //beforeClick: beforeClick,        //点击前
            onClick: onClick,                //点击后
            onAsyncSuccess: zTreeOnAsyncSuccess
        }
    };

//多选框cheakBox
    if (selectType == "mul") {
        setting.check = {
            enable: true
        }
    }

    mainTree = $.fn.zTree.init($("#tree"), setting);
}

//树单击事件
function onClick(event, treeId, treeNode, clickFlag) {

}

/**
 *
 * @param event
 * @param treeId
 * @param msg
 */
var firstAsyncSuccessFlag = 0;

function zTreeOnAsyncSuccess(event, treeId, msg) {
    if (firstAsyncSuccessFlag == 0) {
        try {
            //调用默认展开第一个结点
            var nodes = mainTree.getNodes();
            mainTree.expandNode(nodes[0], true);
            firstAsyncSuccessFlag = 1;
            closeLoading();
        } catch (err) {
        }
    }
}