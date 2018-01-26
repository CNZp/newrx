$(function () {
    var eles = {};
    var node = _top.property;
    debugger;
    var pro = null;
    if (node) {
        eles.description = $("#description");
        pro = node.property;
        $.each(eles, function (key, e) {
            if (e instanceof $) {
                if (e.attr("type") == "radio" || e.attr("type") == "checkbox") {
                    e.filter(function () {
                        return this.value == pro[key];
                    }).attr("checked", true);
                } else {
                    e.val(pro[key] || "");
                }
            } else {
                if (pro[key] != undefined && pro[key] != null && pro[key] != "") {
                    e.id.val(pro[key] || "");
                }
            }
        });
    }
    $("#save").click(function () {
        if (pro) {
            for (var key in eles) {
                var e = eles[key];
                var v = "";
                var require = "";
                if (e instanceof $) {
                    require = e.attr("require");
                    if (e.attr("type") == "radio" || e.attr("type") == "checkbox") {
                        v = e.filter(function () {
                            return this.checked;
                        }).val();
                    } else {
                        v = e.val();
                    }
                } else {
                    require = e.name.attr("require");
                    v = e.id.val();
                }
                if (require != undefined && (v == "" || v == undefined)) {
                    alert(require);
                    e instanceof $ ? e.focus() : e.name.focus();
                    return false;
                }
                pro[key] = v;
            }
        }
        $("#cancel").trigger("click");
    });
    $("#cancel").click(function () {
        _top.property = null;
        _top.closeLayer(window);
    })
});

function StartNode() {
    Oval.call(this);

    this.clsName = "node start";

    this.backgroundColor = "#D2F3FF";

    this.borderColor = "#7B7B7B";

    this.dblclickEvent = function (event) {
        var jsOption = {
            title: "开始环节设置",
            autoOpen: false,
            modal: true,
            resizable: false,
            width: 600,
            height: 400
        };
        _top.showDialog('start_node', jsOption, "/workflow/designTools/start_node", this, true, window);
    };
}

StartNode.create = function (flow, x, y, createId, id) {
    var node = new StartNode();
    node.flow = flow;
    var domid, nid;
    if (createId) {
        domid = "n" + (flow.newShapeID++).toString();
        nid = "";
    }
    else {
        domid = "n" + id.toString();
        nid = id;
    }
    node.property = nodeProperty.create(node, x, y, domid, nid);
    flow.addShape(node);
    return node;
};

StartNode.create2 = function (flow, x, y, p) {
    var node = new StartNode();
    node.flow = flow;

    p.domid = "n" + p.id.toString();

    node.property = p;

    flow.addShape(node);
    return node;
};
