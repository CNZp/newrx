/*****************************************************************
 * 搜索面板
 * 最后更新时间：2016-02-24
 * 最后更新人：zhan
 *****************************************************************/

//动态表单块
var SearchView = Backbone.View.extend({
    tagName: 'div', //标签名，暂固定为div
    className: '',   //个体样式
    showSearch: true,
    gridModel: null,    //列表刷新方法
    cols: 6, //列设置
    colSetting: [80, 150, 80, 150, 80, 150],
    //初始化方法
    initialize: function (options) {
        if (options.cols != null) {
            this.cols = options.cols;
        }
        if (options.colSetting != null) {
            this.colSetting = options.colSetting;
        }
        if (options.gridModel != null) {
            this.gridModel = options.gridModel;
        }
        if (options.checkSearch != null) {
            this.checkSearch = options.checkSearch;
        }
        this.showSearch = options.showSearch;
        //this.render();
    },
    events: {
        "click #search": "searchFunc",
        "click #clear": "clearFunc"
    },
    //点击搜索事件
    searchFunc: function () {
        var view = this, searchButton = $(view.el).find("#search");
        searchButton.val("检索中").prop("disabled", true).addClass("runDisabled");
        setTimeout(function () {
            view.search();
            searchButton.val("查   询").prop("disabled", false).removeClass("runDisabled");
        }, 10);
    },
    //点击清空事件
    clearFunc: function () {
        var model = this.model,
            valueJson = model.initJson[model.className];
        $.each(valueJson, function (key, value2) {
            if (value2.canClear) {
                if (typeof(value2.defaultValue) === "undefined" || value2.defaultValue === null) {
                    model.setValue(key, "");
                } else {
                    model.setValue(key, value2.defaultValue);
                }
            }
        });
    },
    checkSearch: function () {
        return true;
    },
    //查询事件
    search: function () {
        if (this.checkSearch()) {
            this.gridModel.reloadGrid(this.getSearchJson(true));
            // this.gridModel.reloadGrid(this.getSearchJson(true));
        }
    },
    //主渲染方法
    render: function () {
        var view = this;
        $(this.el).empty();
        $(this.el).append(view.tableRender());
        this.model.render();
    },
    //查询面板渲染主方法
    tableRender: function () {
        var view = this;
        var model = view.model;
        var valueJson = model.initJson[model.className];
        var tableHtml = "<table cellpadding='0' cellspacing='0' border='0' class='query_form' style='width:auto;'>";
        var index = 0;
        var canClear = false;
        var trHtml = ["<tr>"];
        $.each(valueJson, function (key, value2) {
            if (value2.display) {
                if (index > 0 && index % view.cols == 0) {
                    trHtml.push("<td></td></tr><tr>");
                }
                index += 2;
                trHtml.push("<th>");
                if (value2.rules && value2.rules.checkSave && $.inArray("notNull", value2.rules.checkSave) > -1) {
                    trHtml.push("<b>* </b>");
                }
                trHtml.push(value2.tagName + "</th>");
                if (value2.type === "dict") {
                    trHtml.push("<td><div class='query_element_box'><select name='' data-model='" + model.get("ModelName") + "' data-property='" + key + "' class='i_query_select");
                    if (isIE6) {
                        trHtml.push((_top.hasLayerAlert ? " _zbselect'  style='display:none'>" : "'>"));
                    } else {
                        trHtml.push("'");
                    }
                    trHtml.push("<option value=''></option>" +
                        "</select></div>" +
                        "</td>");

                } else if (value2.type === "date") {
                    trHtml.push("<td>" +
                        "<div class='query_element_box'><input type='text' style='border: 1px solid #cccccc;' class='i_query_date' value=''  data-model='" + model.get("ModelName") + "' data-property='" + key + "'>" +
                        "</div></td>");
                } else if (value2.type === "layer" && value2.layerConfig.canDelete) {
                    trHtml.push("<td><div class='query_element_box'><span class='i_query_text' style='vertical-align:middle'>" +
                        "<input type='text' class='i_query_text' style='border: 0' value=''  data-model='" + model.get("ModelName") + "' data-property='" + key + "'>" +
                        "</span></div></td>");
                } else {
                    trHtml.push("<td><div class='query_element_box'>" +
                        "<input type='text' class='i_query_text' value=''  data-model='" + model.get("ModelName") + "' data-property='" + key + "'>" +
                        "</div></td>");
                }
                if (value2.canClear) {
                    canClear = true;
                }
            }
        });
        if (index > view.cols && (index % view.cols) > 0) {
            var indexCol = view.cols - index % view.cols, i = 0;
            for (; i < indexCol; i++) {
                trHtml.push("<td></td>");
            }
        }
        trHtml.push("<th style='text-align:left;width:150px;" +
            (view.showSearch ? "" : "display:none") +
            "'><div class='query_element_box'><input id='search' class='query_button' type='button' value='查询' style='width:68px' />");
        if (canClear) {
            trHtml.push(" <input id='clear' class='query_button' type='button' value='清空' style='width:68px' />");
        }
        trHtml.push("</div></th></tr>");
        var colHtml;
        //处理col
        var cols = view.colSetting;
        if (index < view.cols) {
            var colArr = [];
            for (var i = 0; i < index; i++) {
                colArr.push("<col width='" + cols[i] + "px'/>");
            }
            colArr.push("<col/>");
            colHtml = colArr.join("");
        } else {
            colHtml = view.getColHtml() + "<col/>";
        }
        tableHtml += colHtml;
        tableHtml += trHtml.join("") + "</table>";
        return tableHtml;

    },
//获取查询参数生成的json字符串 needUpdateTag是否需要更新model
    getSearchJson: function (needUpdateTag) {
        var model = this.model;
        //如需更新数据，调用同步dom模型数据接口
        if (needUpdateTag) {
            model.updateModel();
        }
        var jsonstr = "[",
            initJson = model.initJson,
            json2 = initJson[model.className];
        $.each(json2, function (property, json) {
            if (json.ifForm) {
                var value = model.get(property);
                value = value ? value : "";
                value = replaceStrChar(value, "\"", "\\\"");
                jsonstr += '{"zdName":"' + property + '","value":"' + encodeURI(encodeURI(value)) + '"';
                //动态sql生成未实现
                //'","tableName":"' + initJson[model.get("ModelName")][property].tableName +'","rule":"' + initJson[model.get("ModelName")][property].rule;
                if (initJson[model.get("ModelName")][property].special) {
                    jsonstr += ',"special":"' + initJson[model.get("ModelName")][property].special + '"},'
                } else {
                    jsonstr += '},'
                }
            }
        });
        if (jsonstr.length > 1) {
            jsonstr = jsonstr.substr(0, jsonstr.length - 1);
        }
        jsonstr += "]";
        return jsonstr;

    },
    getColHtml: function () {
        var colSetting = this.colSetting;
        var colHtml = "";
        for (var i = 0; i < colSetting.length; i++) {
            if (colSetting[i] > 0) {
                colHtml += "<col width='" + colSetting[i] + "px'/>";
            }
        }
        return colHtml;
    }
});
