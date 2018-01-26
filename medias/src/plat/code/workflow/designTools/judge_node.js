$(document).ready(function () {
    var eles = {};
    eles.name = $("#titleText");
    eles.decisionType = $("[name=decisionType]");

    var node = _top.property;
    var pro = null;
    if (node) {
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
                if (pro[key] != undefined && pro[key] != null) {
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
            var obj = node._obj;
            if (obj != null) {
                var newName = eles.name.val();
                obj.attr("title", newName);
                var text = obj.data("enclosedText");
                if (text != null) {
                    node.textWrap2(text, 50, newName, 30);
                    text.attr("title", newName);
                }
            }
        }
        $("#cancel").trigger("click");
    });

    $("#cancel").click(function () {
        _top.property = null;
        closeWin();
    })
});