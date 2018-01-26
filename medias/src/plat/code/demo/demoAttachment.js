/**
 * Created by Pitcher on 2017/5/18.
 */

var id = GetQueryString("id");
var type = GetQueryString("type");
var demoUser;
$(function () {
    //初始化尺寸
    pageAjax();
    $(".form_box").height($(window).height() - $(".w_button_box").outerHeight() - 20);

    var stateJson;
    switch (type) {
        case 'xz':
            $(".w_button_box").show();
            stateJson = xzStateJson;
            break;
        case 'ck':
            stateJson = ckStateJson;
            break;
        case 'xg':
            $(".w_button_box").show();
            stateJson = xgStateJson;
            break;
        default :
            break;
    }
    var ModelDemoUser = DetailModel.extend({
        className: "ModelDemoUser",
        initJson: ModelDemoUserJson,
        stateJson: stateJson
    });

    if (id) {
        $.ajax({
            type: "get",
            url: "/demoUser/getDemoUserById?id=" + id + "&random=" + Math.random(),
            async: false,
            success: function (ar) {
                demoUser = ar.data;
            }
        });
    }


    var modelDemoUser = new ModelDemoUser(demoUser);
    modelDemoUser.render();


    /****************************************************************************************************************************************
     ****************************************************************************************************************************************/
    $("#save").click(function () {
        if (modelDemoUser.ruleValidate()) {
            $.ajax({
                type: "post",
                url: "/demoUser/saveDemoUser",
                data: {demoUser: modelDemoUser.getJson()},
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        rxMsg("保存成功");
                        closeWin();
                        reloadPrevWin();
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        }

    });
    $("#zzmm").change(function () {
        if($("#zzmm").val()=='1'){
            $("#dyn").after('<tr><th><b>*</b>测试</th><td colspan="3"><div><input type="text" class="i_layer" data-model="ModelDemoUser" data-property="cs"> </div></di></td></tr>')
            modelDemoUser.reRender();
        }

    })

});

//组织机构回调函数
function organSelectCallback(modelName, organName, organId) {
    $.getEle(modelName, "organName").val(organName);
    $.getEle(modelName, "organId").val(organId);
}


/********************************************************************
 ************************** 单个模型构成的动态列表 ********************
 ********************************************************************
 ********************************************************************/
function createList() {

    var ModelSingleJson = {
        ModelSingle: {     //队伍成员信息类
            id: {        //组织ID
            },
            organName: {        // 组织名称
                display: true
            },
            xfStates: {         //下发状态
            }
        }
    }

    //工作流组织机构模型类
    var ModelSingle = DetailModel.extend({
        className: "ModelSingle",
        initJson: ModelSingleJson,
        setModelName: function () {
            this.set("ModelName", "ModelSingle" + (++modelIndex));
        }
    })


    //单个模型的集合
    var ModelSingleCollection = Backbone.Collection.extend({
        model: ModelSingle
    });

    //实例化集合
    var modelsinglecollection = new ModelSingleCollection();

    //动态列表主体view类
    var SingleTableView = BaseTableView.extend({
        getControlHtml: function () {    // title 和 控制区域渲染接口
            var controlstr = '<h1>附件清单：</h1>';
            controlstr += '<ul class="action_button" style="float: right;margin: 5px 5px 0 0;">';
            controlstr += '<li><a class="add">自定义新增</a></li>';
            controlstr += '<li><a class="addTrItem">系统新增</a></li>';
            controlstr += '<li><a class="deleteItems">系统删除</a></li>' +
                '</ul>';
            return controlstr;
        },
        //复写注册事件
        events: {
            'click .add': 'add',
            'click .addTrItem': 'addNewItem',
            'click .deleteItems': 'deleteItems'
        },
        //自定义新增事件
        add: function () {
            openStack(window, "选择机构", "tree", "/plat/organ/organTree?func=workflowOrgan&type=xz&selectType=mul");
        },
        modelRender: function () {
            RX.log("modelRender");
        },
        getTheadHtml: function () {  //实现表头区域渲染接口
            RX.log("getTheadHtml");
            var theads = "<thead>";
            theads += "<th style='width:5%'>序号</th>" +
                "<th style='width:20%'>机构名称</th>  " +
                "<th style='width:20%'>下发状态</th>  ";
            theads += "<th style='width:20%'>操作</th></thead>";
            return theads;
        },
        getNewModel: function () { //实现接口，以关联创建的model
            RX.log("getNewModel");
            return new ModelSingle();
        },
        getNewTrView: function (item, mode, display, index) {  //实现接口，以关联创建的行view
            RX.log("getNewTrView");
            return new SingleTrView({          //实例化列表tr view
                model: item,                          //每行render所需的数据
                renderCallback: mode,                //每render 一行执行的回调函数，也就是 tr view 的render方法  也就是 renderEditMode 方法。
                display: display,
                index: index
            });
        }
    });

    //创建动态列表行view类
    var SingleTrView = BaseElementView.extend({
        canCheck: false,
        tagName: 'tr',
        className: 'rx-grid-tr',
        renderEditMode: function () {    //实现渲染接口
            RX.log("renderEditMode");
            var html =
                "<td style='text-align:center'>" + this.index + "</td>" +
                "<td style='text-align:center'><input type='text'  class='i_text' data-property='organName' data-model='" + this.model.get("ModelName") + "'/></td>" +
                "<td style='text-align:center'><input type='text'  class='i_text' data-property='xfStates' data-model='" + this.model.get("ModelName") + "'/></td>";
            html += "<td style='text-align:center'>" +
                '<a href="#none" class="cxxf">重新下发</a>' +
                ' <a href="#none" class="delete">删除</a> ';
            $(this.el).html(html);
        }
    });

    var singletableview = new SingleTableView({
        collection: modelsinglecollection,
        el: $("#dyndemo1")
    });
    singletableview.render();
}

function a() {
    RX.log("44")
}

function send() {
    $.ajax({
        type: "post",
        url: "/dxgl/sendMessage",
        dataType: "json",
        success: function (ar) {
            if (ar.success) {
                layer.alert("发送成功");
                closeWin();
                reloadPrevWin();
            } else {
                layer.alert(ar.msg);
            }
        }

    })
}

