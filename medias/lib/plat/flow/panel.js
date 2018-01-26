function Panel(canvas) {
    //当前绘制的画布元素
    this.canvas = canvas;

    this.initHeight = canvas.height();

    this.initWidth = canvas.width();

    //绘图工具
    this.paper = new Raphael(canvas.attr("id"), canvas.width(), canvas.height());

    //当前画布上的元素
    this.flow = null;

    //当前的操作状态
    this.status = new Status();

    this.focusRect = new Array();

    //this._dragging=false;

    //this._moving=false;

    this._hasStartNode = false;

    /* 绘制当前画板中的流程 */
    this.drawFlow = function () {
        var maxHeight = 0, maxWidth = 0;
        var shapes = this.flow.shapes;
        //绘制流程节点
        for (var i = 0; i < shapes.length; i++) {
            shapes[i].drawShape(this);
            this.setShapeEvent(shapes[i]);

            if (shapes[i].constructor == StartNode)
                this._hasStartNode = true;

            if (shapes[i].property.y > maxHeight)
                maxHeight = shapes[i].property.y;

            if (shapes[i].property.x > maxWidth)
                maxWidth = shapes[i].property.x;
        }

        this.resizeCanvas(maxHeight, maxWidth);

        var routers = this.flow.routers;
        //绘制流程路由
        for (var i = 0; i < routers.length; i++) {
            routers[i].drawRouter(this);
            this.setRouterEvent(routers[i]);
        }
    };

    this.destroyFlow = function () {
        if (this.flow != null) {
            this.flow.destroy();
            this.flow = null;
        }

        this._hasStartNode = false;

        var count = this.focusRect.length;
        for (var i = 0; i < count; i++) {
            this.focusRect[i].hide();
        }

        this.canvas.height(this.initHeight);
        this.canvas.width(this.initWidth);
        this.paper.setSize(this.initWidth, this.initHeight);
    };

    this.resizeCanvas = function (newHeight, newWidth) {
        var heightChanged = false;
        var height = panel.canvas.height();
        if (newHeight + 100 > height) {
            if (newHeight > height) height = newHeight;
            //增加画布的高度
            height += 50;
            panel.canvas.height(height);
            heightChanged = true;
            //panel.paper.setSize(panel.canvas.width(), height);
        }
        var width = panel.canvas.width();
        if (newWidth + 200 > width) {
            if (newWidth > width) width = newWidth;
            //增加画布的宽度
            width += 100;
            panel.canvas.width(width);
            panel.paper.setSize(width, height);
        }
        else {
            if (heightChanged)
                panel.paper.setSize(width, height);
        }
    };

    /* 设置每个节点的事件 */
    this.setShapeEvent = function (shape) {
        //设置每个节点可拖动、可调节大小
        //shape.domObj().draggable();
        //shape.obj().resizable();
        //设置每个节点在拖动和调节大小时所触发的事件
        //shape.domObj().bind('drag', {panel: this}, this.dragShapeEvent);

        var robj = shape.obj();
        robj.data("panel", this);
        robj.drag(moveShape, dragShape, upShape);

        var rtext = robj.data("enclosedText");
        rtext.drag(moveText, dragText, upText);

        var dom = shape.domObj();
        dom.bind('click', {panel: this}, this.clickShapeEvent);
        dom.bind('dblclick', {panel: this}, this.dblclickShapeEvent);
        dom.bind("contextmenu", {shape: shape}, this.contextmenuShapeEvent);
//        dom.bind('keydown', {shape:shape}, shapeKeyDownEvent);

        var textDom = $(rtext.node);
        textDom.bind('click', {panel: this, obj: dom, shape: shape}, this.clickTextEvent);
        textDom.bind('dblclick', {panel: this, obj: dom}, this.dblclickTextEvent);
        textDom.bind("contextmenu", {shape: shape}, this.contextmenuTextEvent);
//        textDom.bind('keydown', {shape:shape}, shapeKeyDownEvent);
    };

    /* 设置每个路由的事件 */
    this.setRouterEvent = function (router) {
        var dom = router.domObj();
        dom.bind('click', {panel: this, obj: router}, this.clickRouterEvent);
        dom.bind('dblclick', {panel: this, obj: router}, this.dblclickRouterEvent);
        dom.bind("contextmenu", {obj: router}, this.contextmenuRouterEvent);
    };

    var shapeKeyDownEvent = function (event) {
        var shape = event.data.shape;
        if (shape != null) {
            var x = shape.property.x;
            var y = shape.property.y;
            switch (event.which) {
                case 37:  // 左
                    x = x - 1;
                    moveShape.call(shape, x, y);
                    break;
                case 38: // 上
                    y = y - 1;
                    moveShape.call(shape, x, y);
                    break;
                case 39: // 右
                    x = x + 1;
                    moveShape.call(shape, x, y);
                    break;
                case 40: // 下
                    y = y + 1;
                    moveShape.call(shape, x, y);
                    break;
            }
        }
    };

    /* 移动节点所执行的事件 */
    var dragShape = function () {
        var panel = this.data("panel");

        var shape = panel.flow.findShapeById(this.node.id);
        if (shape != null) {
            var robj = shape.obj();
            robj.attr("cursor", "move");

            var rtext = robj.data("enclosedText");
            rtext.attr("cursor", "move");
            panel.resizeCanvas(shape.property.y, shape.property.x);
        }

        this.odx = 0;
        this.ody = 0;
        //panel._dragging=true;
    };

    var dragText = function () {
        dragShape.call(this.data("parentShape"));
    };

    var moveShape = function (dx, dy) {
        var panel = this.data("panel");

        //panel._moving=true;
        //if(!panel._dragging) return;

        var ddx = dx - this.odx;
        var ddy = dy - this.ody;
        this.translate(ddx, ddy);
        this.odx = dx;
        this.ody = dy;

        var text = this.data("enclosedText");
        if (text != null)
            text.translate(ddx, ddy);

        var l = this.data("extraLine");
        if (l != null)
            l.translate(ddx, ddy);

    };

    var moveText = function (dx, dy) {
        moveShape.call(this.data("parentShape"), dx, dy);
    };

    var upShape = function () {
        var panel = this.data("panel");

        //if(panel._dragging && panel._moving)
        //{

        var shape = panel.flow.findShapeById(this.node.id);

        if (shape != null) {
            var bbox = this.getBBox();
            shape.property.x = parseInt(bbox.x);
            shape.property.y = parseInt(bbox.y);

            var robj = shape.obj();
            robj.attr("cursor", "pointer");

            var rtext = robj.data("enclosedText");
            rtext.attr("cursor", "pointer");


            //重新路由刷新位置
            var fromRouters = shape.fromRouters;
            var toRouters = shape.toRouters;

            if (fromRouters != null) {
                for (var i = 0; i < fromRouters.length; i++) {
                    var fromRouter = fromRouters[i];
                    fromRouter.flush();
                }
            }

            if (toRouters != null) {
                for (var i = 0; i < toRouters.length; i++) {
                    var toRouter = toRouters[i];
                    toRouter.flush();
                }
            }

            panel.resizeCanvas(shape.property.y, shape.property.x);

        }
        //}

        //panel._moving=false;
        //panel._dragging=false;
    }

    var upText = function () {
        upShape.call(this.data("parentShape"));
    };

    /* 点击节点所执行的事件 */
    this.clickShapeEvent = function (event) {
        var panel = event.data.panel;

        var shape = panel.flow.findShapeById($(this).attr("id"));

        panel.status.curShape = shape;
        panel.status.curShapeType = Status.SHARPTYPE_NODE;

        if (panel.status.control == Status.RELATE) {
            //如果画布是关联操作，则绘制路由
            var startShape = panel.status.startShape;
            if (startShape == null) {
                panel.status.startShape = shape;
            }
            else {
                if (shape.constructor == StartNode) {
                    rxMsg(RxMsgType.ERROR,"开始环节不能作为流入环节");
                    return;
                }
                if (startShape.constructor == EndNode) {
                    rxMsg(RxMsgType.ERROR,"结束环节不能作为流出环节");
                    return;
                }
                if (startShape.constructor == CirculationNode) {
                    rxMsg(RxMsgType.ERROR,"传阅环节不能作为流出环节");
                    return;
                }
                if (shape.constructor == DecisionNode) {
                    /*if (startShape.constructor == DecisionNode) {
                        alert("\"决策环节\"之后不能直接连接\"决策环节\"。");
                        return;
                    }*/

                    var toRouters = startShape.toRouters;
                    for (var i = 0; i < toRouters.length; i++) {
                        if (toRouters[i].getEndShape().constructor == DecisionNode) {
                            rxMsg(RxMsgType.ERROR,"流出环节已经指向另一个决策环节");
                            return;
                        }

                    }

                }
                if (startShape.constructor == StartNode) {
                    if (shape.constructor != ActivityNode && shape.constructor != ClusterNode) {
                        rxMsg(RxMsgType.ERROR,"开始环节之后的环节必须是活动环节");
                        return;
                    }

                    if (startShape.toRouters.length == 1) {
                        rxMsg(RxMsgType.ERROR,"开始环节之后只能有一个活动环节");
                        return;
                    }
                }

                if ($(this).attr("id") != startShape.property.domid) {
                    var fromRouters = shape.fromRouters;
                    var toRouters = shape.toRouters;

                    if (fromRouters != null) {
                        for (var i = 0; i < fromRouters.length; i++) {
                            if (fromRouters[i].getStartShape() == startShape) {
                                rxMsg(RxMsgType.WARNNING,"流向已存在");
                                return;
                            }
                        }
                    }

                    if (toRouters != null) {
                        for (var i = 0; i < toRouters.length; i++) {
                            if (toRouters[i].getEndShape() == startShape) {
                                rxMsg(RxMsgType.WARNNING,"流向已存在");
                                return;
                            }

                        }

                    }

                    panel.status.endShape = shape;

                    var obj = eval(panel.status.draw);
                    var router = obj.create(panel.flow, startShape, shape, true);

                    router.drawRouter(panel);
                    panel.setRouterEvent(router);

                    panel.status.startShape = shape;
                    panel.status.endShape = null;
                }
                else {
                    rxMsg(RxMsgType.WARNNING,"不能建立流向");
                    return;
                }
            }
        }


        if (panel.focusRect.length == 0) {
            for (var i = 0; i < 4; i++) {
                var rect = panel.paper.rect(0, 0, 6, 6, 0);
                rect.attr("fill", "#fff");
                rect.attr("stroke", "#000");
                panel.focusRect.push(rect);
            }

        }

        var obj = shape.obj();
        var box1 = obj.getBBox();
        var w = box1.width;
        var h = box1.height;
        var x = box1.x;
        var y = box1.y;
        var xarr = [x - 3, x + w - 3, x - 3, x + w - 3];
        var yarr = [y - 3, y - 3, y + h - 3, y + h - 3];

        for (var i = 0; i < 4; i++) {
            panel.focusRect[i].attr({x: xarr[i], y: yarr[i]}).toFront().show();
        }


        event.stopPropagation();

    };

    this.clickTextEvent = function (event) {
        var panel = event.data.panel;
        var obj = event.data.obj;

        panel.status.curShape = event.data.shape;
        panel.status.curShapeType = Status.SHARPTYPE_NODE;

        obj.trigger("click", panel);

        event.stopPropagation();
    };

    /* 双击节点形状所执行的事件 */
    this.dblclickShapeEvent = function (event) {
        var panel = event.data.panel;

        if (panel.status.control != Status.SELECT) return;

        //得到所双击的节点
        var shape = panel.flow.findShapeById($(this).attr("id"));
        shape.dblclickEvent(event);
        event.stopPropagation();
    };
    /*双击节点文字所执行的事件*/
    this.dblclickTextEvent = function (event) {
        var panel = event.data.panel;
        var obj = event.data.obj;

        obj.trigger("dblclick", panel);

        event.stopPropagation();
    };

    /* 右击节点形状所执行的事件 */
    this.contextmenuShapeEvent = function (event) {
        var shape = event.data.shape;

        panel.status.curShape = shape;
        panel.status.curShapeType = Status.SHARPTYPE_NODE;

        shape.contextmenuEvent(event);
        event.stopPropagation();
    };
    /*右击节点文字所执行的事件*/
    this.contextmenuTextEvent = function (event) {
        $("#menu_node").show();
        var shape = event.data.shape;

        panel.status.curShape = shape;
        panel.status.curShapeType = Status.SHARPTYPE_NODE;

        shape.contextmenuEvent(event);
        event.stopPropagation();
    };

    /* 单击流向所执行的事件 */
    this.clickRouterEvent = function (event) {
        var panel = event.data.panel;
        if (panel.focusRect.length == 0) return;

        var route = event.data.obj;
        panel.status.curShape = route;
        panel.status.curShapeType = Status.SHARPTYPE_ROUTE;

        var arr = route.points[2].split(",");
        var xc = parseFloat(arr[0]);
        var yc = parseFloat(arr[1]);
        panel.focusRect[0].attr({x: xc - 3, y: yc - 3}).toFront().show();

        arr = route.points[3].split(",");
        xc = parseFloat(arr[0]);
        yc = parseFloat(arr[1]);
        panel.focusRect[1].attr({x: xc - 3, y: yc - 3}).toFront().show();

        arr = route.points[4].split(",");
        xc = parseFloat(arr[0]);
        yc = parseFloat(arr[1]);
        panel.focusRect[2].attr({x: xc - 3, y: yc - 3}).toFront().show();

        panel.focusRect[3].hide();

        event.stopPropagation();
    };

    /* 双击流向所执行的事件 */
    this.dblclickRouterEvent = function (event) {
        var panel = event.data.panel;
        if (panel.status.control != Status.SELECT) return;

        //得到所双击的环节
        var router = event.data.obj;
        var startNode = router.getStartShape();
        //判断是否为决策环节
        if (startNode.constructor == DecisionNode) {
            router.dblclickEvent(event);
        }

        event.stopPropagation();

    };

    /* 右击流向所执行的事件 */
    this.contextmenuRouterEvent = function (event) {

        $("#menu_router").show();
        var router = event.data.obj;

        panel.status.curShape = router;
        panel.status.curShapeType = Status.SHARPTYPE_ROUTE;

        router.contextmenuEvent(event);
        event.stopPropagation();
    };


    /* 点击画布所执行的事件 */
    this.clickPanelEvent = function (event) {
        var panel = event.data.panel;

        for (var i = 0; i < panel.focusRect.length; i++) {
            panel.focusRect[i].hide();
        }

        panel.status.curShape = null;
        panel.status.curShapeType = Status.SHARPTYPE_NONE;

        panel.status.startShape = null;
        panel.status.endShape = null;

        if (panel.status.control == Status.SELECT) {
        }
        else if (panel.status.control == Status.DRAW) {
            if (panel.status.draw == "StartNode" && panel._hasStartNode) {
               rxMsg(RxMsgType.WARNNING,"一个流程只能有一个开始环节");
                return;
            }

            var obj = eval(panel.status.draw);
            var shape = obj.create(panel.flow, event.pageX, event.pageY, true);
            //shape.style = Elements.getPositionStyleCode(event.pageX, event.pageY);
            shape.drawShape(panel);

            panel.setShapeEvent(shape);

            if (shape.constructor == StartNode)
                panel._hasStartNode = true;

            panel.resizeCanvas(event.pageY, event.pageX);

        }

    };
    /*双击画布事件*/
    this.dblclickPanelEvent = function (event) {
        var panel = event.data.panel;

        if (panel.status.control != Status.SELECT) return;

        panel.flow.dblclickEvent(event);
        event.stopPropagation();
    };

    this.triggerKeydownPanelEvent = function () {
        var e = jQuery.Event("keydown");
        e.keyCode = 46;
        this.canvas.trigger(e, panel);
    };
    /*键盘删除键点击事件*/
    this.keydownPanelEvent = function (event) {
        if (event.keyCode == 46) {
            var panel = event.data.panel;

            var shape = panel.status.curShape;
            if (shape != null) {
                if (panel.status.curShapeType == Status.SHARPTYPE_NODE) {
                    layer.confirm("确认删除选中的环节"+shape.property.name+"吗",function (index) {
                        panel.flow.removeNode(shape);
                        layer.close(index);
                    });

                    if (shape.constructor == StartNode)
                        panel._hasStartNode = false;
                }
                else if (panel.status.curShapeType == Status.SHARPTYPE_ROUTE) {
                    layer.confirm("确认删除选中的流向吗？",function (index) {
                        panel.flow.removeRoute(shape);
                        layer.close(index);
                    });
                }

                for (var i = 0; i < panel.focusRect.length; i++) {
                    panel.focusRect[i].hide();
                }

                panel.status.curShape = null;
                panel.status.curShapeType = Status.SHARPTYPE_NONE;

                panel.status.startShape = null;
                panel.status.endShape = null;
            }


        }
    };
    /*画布右击事件*/
    this.contextmenuPanelEvent = function (event) {
        panel.flow.contextmenuEvent(event);
        // event.cancelBubble();

        event.stopPropagation();
        // return false; //屏蔽浏览器右键事件
    };

    /* 改变当前画布的状态 */
    this.changeStatus = function (control, draw) {
        this.status.control = control;
        this.status.draw = draw;

        if (control == Status.SELECT)
            this.canvas.css({cursor: "default"});
        else
            this.canvas.css({cursor: "crosshair"});
    };

    /* 构造函数 */
    this.initial = function () {
        this.canvas.bind("click", {panel: this}, this.clickPanelEvent);
        this.canvas.bind("dblclick", {panel: this}, this.dblclickPanelEvent);
        this.canvas.bind("keydown", {panel: this}, this.keydownPanelEvent);
        this.canvas.bind("contextmenu", {panel: this}, this.contextmenuPanelEvent);
        //工作流菜单
        var flowMemu = {
            dataSource: [
                {id: 'cmWF1', label: "流程设置", panel: this}
            ]
        };

        //节点菜单
        var nodeMenu = {
            dataSource: [
                {id: 'cmNode1', label: '环节设置', seperator: true, panel: this},
                {id: 'cmNode2', label: '删除环节', panel: this}
            ]
        };
        //流向菜单
        var routerMenu = {
            dataSource: [
                {id: 'cmRouter1', label: '流向设置', seperator: true, panel: this},
                {id: 'cmRouter2', label: '删除流向', panel: this}
            ]
        };
        //创建面板右击菜单
        createMenu("menu_flow", flowMemu);
        //创建节点右击菜单
        createMenu("menu_node", nodeMenu);
        //创建流向右击菜单
        createMenu("menu_router", routerMenu);
    };
    this.initial();
}


/** 当前画布的状态 **/
function Status() {
    this.control = Status.SELECT;

    //需要绘制的图形（类）
    this.draw = null;

    /* 当位关联状态时，关联的第一个节点（临时存储） */
    this.startShape;

    /* 当位关联状态时，关联的第二个节点（临时存储） */
    this.endShape;

    this.curShape;

    this.curShapeType = Status.SHARPTYPE_NONE;

}

//创建右击菜单
function createMenu(panelId, menuConfig) {
    var $ul = $('<ul class="om-menu om-corner-all" style="display: none"></ul>');
    $.each(menuConfig.dataSource, function (i, t) {
        var $li = $('<li onclick="menuClick(this)" id="' + t.id + '"class=""><a href="javascript:void(0)" class="om-corner-all om-menu-indicator"><span style="margin-left:0.5em;"> ' + t.label + '</span></a></li>');
        $li.data("item", t);
        $ul.append($li);
    });
    $("#" + panelId).append($ul);
}

function menuClick(t) {
    var item = $(t).data("item");
    if (item == undefined) return;
    var flag = item.id.substring(0, item.id.length - 1);
    var panel = item.panel;
    //面板菜单点击
    if (flag == "cmWF") {
        if (item.label == "流程设置") {
            var oldControl = panel.status.control;
            panel.status.control = Status.SELECT;

            panel.canvas.trigger("dblclick", panel);

            panel.status.control == oldControl;
        }
        else {
            panel.flow.dblclickEventTest();
            event.stopPropagation();
        }
    }
    //节点菜单点击
    else if (flag == "cmNode") {
        var shape = panel.status.curShape;
        if (item.label == "环节设置") {
            if (shape != null) {
                var oldControl = panel.status.control;
                panel.status.control = Status.SELECT;

                shape.domObj().trigger("dblclick", panel);

                panel.status.control == oldControl;
            }
        }
        else {
            $('#menu_node').hide();
            panel.triggerKeydownPanelEvent();
        }
    } else if (flag == "cmRouter") {
        var router = panel.status.curShape;
        if (item.label == "流向设置") {
            if (router != null) {
                var oldControl = panel.status.control;
                panel.status.control = Status.SELECT;
                router.domObj().trigger("dblclick", panel);
                panel.status.control == oldControl;
            }
        }
        else {
            $('#menu_router').hide();
            panel.triggerKeydownPanelEvent();
        }
    }
}

/* 选择 状态 （默认） */
Status.SELECT = 1;

/* 绘制 状态 */
Status.DRAW = 2;

/* 关联 状态 */
Status.RELATE = 3;

Status.SHARPTYPE_NONE = 1;

Status.SHARPTYPE_NODE = 2;

Status.SHARPTYPE_ROUTE = 3;

