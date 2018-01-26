/**
 * 初次启动流程接口
 * @param obj {flowCode:流程编码,type:页面状态类型,toTag:返回URL,title:弹出层窗口标题,wfTitle:指定的流程实例标题}
 */
function confirmWorkflowStart(obj) {
    obj = obj || {};
    obj.toTag = obj.toTag || getToTagUrl(window);
    openWorkflow("/workflow/instance/taskHandle", obj);

}

/**
 * 通过流程编码和业务数据ID办理流程
 * @param dataId 业务数据ID
 * @param flowCode 流程编码
 * @param obj 参数
 */
function handleWorkflowByCodeAndDataId(dataId, flowCode, obj) {
    if (!obj.toTag) {
        obj.toTag = getToTagUrl(window);
    }
    $.ajax({
        type: "post",
        url: "/workflow/instance/getNewestTaskId",
        data: {flowCode: flowCode, dataId: dataId},
        async: false,
        success: function (ar) {
            if (ar.success) {
                obj.taskId = ar.data;
                if (obj.taskId) {
                    openWorkflow("/workflow/instance/taskHandle", obj);
                }
            } else {
                _top.layer.alert(ar.msg);
            }
        }
    });
}

/**
 * 通过流程实例ID办理流程
 * @param wiId 流程实例ID
 * @param obj 参数
 */
function handleWorkflowByWiId(wiId, obj) {
    obj = obj || {};
    obj.toTag = obj.toTag || getToTagUrl(window);
    $.ajax({
        type: "post",
        url: "/workflow/instance/getNewestTaskIdByWiId",
        data: {wiId: wiId},
        async: false,
        success: function (ar) {
            if (ar.success) {
                obj.taskId = ar.data;
                if (obj.taskId) {
                    openWorkflow("/workflow/instance/taskHandle", obj);
                }
            } else {
                _top.layer.alert(ar.msg);
            }
        }
    });
}

/**
 * 根据任务ID办理任务
 * @param taskId 任务ID
 * @param obj 参数对象
 */
function handleWorkflowByTaskId(taskId, obj) {
    if (!taskId) {
        _top.layer.alert("没有任务ID");
        return;
    }
    obj = obj || {};
    obj.toTag = obj.toTag || getToTagUrl(window);
    obj.taskId = taskId;
    openWorkflow("/workflow/instance/taskHandle", obj);
}

var targetWin = null;
//流程办理
function openWorkflow(url, obj) {
    _top.winData(_top, "flowParam", obj);
    //工作流弹出风格
    if (_top.getWorkflowType() == "layer") {
        _top.layer.open({
            type: 2, // 代表iframe
            closeBtn: 1,
            title: obj.title,
            maxmin: true,
            parentWin: window,
            area: ["1000px", "640px"],
            content: RX.handlePath(url),
            success: function (layero, index) {
                var iframeWin = _top.window[layero.find('iframe')[0]['name']];
                _top.pushStackWin(iframeWin, window);
                if (window.successCallback) {
                    window.successCallback();
                }
            },
            end: function () {
                if (typeof(reloadIndex) != "undefined") {
                    if (typeof(eval(reloadIndex)) == "function")  //回调首页刷新
                        reloadIndex();
                }
                _top.closeLayerWin();
            },
            cancel: function () {
                var cwin = _top.getUpperestWin();
                if (cwin != null) {
                    if (cwin.cancelCheck) {
                        if (!cwin.cancelCheck()) {
                            return false;
                        }
                    }
                }
                return true;
            }
        });
    } else {
        if (targetWin) {
            _top._gotoLocation(targetWin, url);
        } else {
            _top._gotoLocation(findWorkflowFrameWin(), url);
        }
    }
}

//查看流程图
function showStatus(id, title, buildParam) { //缺少title参数报错，已添加  wcy17/2/24
    var url = "/workflow/instance/workflowView?id=" + id;
    _top.openStack(window, title, ["850px", "550px"], url, buildParam);
}

var baseOpinionView;
function buildAutoOpinion(oid, param) {
    RX.load({
        module: "opinionView",
        callback: function () {
            baseOpinionView = new OpinionView({
                collection: new OpinionCollection,
                el: $("#" + oid),
                wiId: param.wId,
                npId: param.npId,
                spId: param.spId,
                lookflg: param.lookflg
            });
            baseOpinionView.render();
        }
    })
}

function getFrameOpinion() {
    if (baseOpinionView) {
        var obj = $(".flowEditOpinion");
        if (obj.length > 0) {
            return {npId: obj.attr("npId"), opinion: obj.val()};
        }
    }
}