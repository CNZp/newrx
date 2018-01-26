$(function () {
    var id = GetQueryString("id");
    var roleMade = GetQueryString("roleMade");
    if (roleMade === "1") {
        // $("#center-tab").show().omTabs({
        //     lazyLoad: true
        // });
        ShowRoleGlObj(id,6);
    } else {
        $("#ruleElement").show();
        //角色与权限规则关联
        var ModelRule = DetailModel.extend({
            className: "ModelRule",
            initJson: modelRuleJson,
            setModelName: function () {
                this.set("ModelName", "ModelRule" + (++modelIndex));
            }
        });
        var ModelRuleCollection = Backbone.Collection.extend({
            model: ModelRule
        });
        //规则列表行view
        var RuleTrView = BaseElementView.extend({
            canCheck: false,
            tagName: 'tr',
            className: 'rx-grid-tr',
            renderEditMode: function () {    //实现渲染接口
                var html = "";
                html += "<td style='text-align:center'>" + this.index + "</td>";
                html += "<td style='text-align:center'><input type='text' class='i_text' data-property='rule_name' data-model='" + this.model.get("ModelName") + "'/>" + "</td>" +
                    "<td style='text-align:center'><input type='text' class='i_text' data-property='xgsj' data-model='" + this.model.get("ModelName") + "'/></td>" +
                    "<td style='text-align:center'><input type='text' class='i_text' data-property='description' data-model='" + this.model.get("ModelName") + "'/></td>";
                $(this.el).html(html);
            }
        });
        //创建规则动态列表主体view类
        var RuleTableView = BaseTableView.extend({
            getControlHtml: function () { //实现控制区域渲染接口
                var controlstr = "<div class='page_title'>" +
                    "<h1 class='ruleTitle'>动态逻辑规则</h1></div>";
                return controlstr;
            },
            getTheadHtml: function () {  //实现表头区域渲染接口
                var theads = "<thead>";
                theads += "<th style='width:10%'>序号</th>" +
                    "<th style='width:30%'>规则名称</th>  " +
                    "<th style='width:20%'>修改时间</th>  " +
                    "<th>描述</th></thead>";
                return theads;
            },
            getNewTrView: function (item, mode, display, index) {  //实现接口，以关联创建的行view
                return new RuleTrView({
                    model: item,
                    renderCallback: mode,
                    display: display,
                    index: index
                });
            }
        });
        $.ajax({
            type: "post",
            url: "/role/getRoleGlRule?roleId=" + id,
            success: function (ar) {
                if (ar.success) {
                    var ruleTableView = new RuleTableView({
                        collection: new ModelRuleCollection(ar.data),
                        el: $("#ruleElement").children()
                    });
                    ruleTableView.render();
                }
            }
        });
    }
});
