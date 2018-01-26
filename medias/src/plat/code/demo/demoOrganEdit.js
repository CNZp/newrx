/**
 * Created by Pitcher on 2017/5/18.
 */

var id = GetQueryString("id");
var type = GetQueryString("type");
var sysDemoOrgan;
var ModelDemoOrgan;
var modelDemoOrgan;
var ModelDemoProject;
var ModelDemoProjectCollection;
$(function () {
    //初始化尺寸
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

    //项目类(子模型类)
    ModelDemoProject = DetailModel.extend({
        className: "ModelDemoProject",
        initJson: ModelDemoOrganJson,
        stateJson: stateJson,
        setModelName: function () {
            this.set("ModelName", "ModelDemoProject" + (++modelIndex));
        }
    });

    //(子模型集合)
    ModelDemoProjectCollection = Backbone.Collection.extend({
        model: ModelDemoProject
    });

//主模型类
    ModelDemoOrgan = DetailModel.extend({
        className: "ModelDemoOrgan",
        initJson: ModelDemoOrganJson,
        stateJson: stateJson,
        relations: [
            {
                type: Backbone.HasMany,
                key: "demoProjectList",
                relatedModel: ModelDemoProject,
                collectionType: ModelDemoProjectCollection
            }
        ]
    });


    if (id) {
        $.ajax({
            type: "get",
            url: "/demoOrgan/getDemoOrganById?id=" + id + "&random=" + Math.random(),
            async: false,
            success: function (ar) {
                sysDemoOrgan = ar.data;
            }
        });
    }
    modelDemoOrgan = new ModelDemoOrgan(sysDemoOrgan);
    modelDemoOrgan.render();
    //创建项目动态列表
    createList();
    createLeaderList();

    $("#save").click(function () {
        if (modelDemoOrgan.ruleValidate()) {
            $.ajax({
                type: "post",
                url: "/demoOrgan/saveDemoOrgan",
                data: {demoOrgan: modelDemoOrgan.getJson()},
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

    })

})

/********************************************************************
 ************************** 单个模型构成的动态列表 ********************
 ********************************************************************/
function createList() {
    //动态列表主体view类
    var ProjectTableView = BaseTableView.extend({
        getControlHtml: function () {    // title 和 控制区域渲染接口
            var controlStr = '<div class="page_title"><h1>项目列表</h1>';
            controlStr += '<ul class="action_button to_right">';
            controlStr += '<li><a class="addTrItem">系统新增</a></li>';
            controlStr += '<li><a class="deleteItems">系统删除</a></li>' +
                '</ul></div>';
            return controlStr;
        },
        //复写注册事件
        events: {
            'click .add': 'add',
            'click .addTrItem': 'addNewItem',
            'click .deleteItems': 'deleteItems'
        },
        getTheadHtml: function () {  //实现表头区域渲染接口
            var theads = "<thead>";
            theads += "<th style='width:5%'>序号</th>" +
                "<th style='width:20%'>项目名称</th>  " +
                "<th style='width:20%'>项目类型</th>  ";
            theads += "<th style='width:10%'>操作</th></thead>";
            return theads;
        },
        getNewModel: function () { //实现接口，以关联创建的model
            return new ModelDemoProject();
        },
        getNewTrView: function (item, mode, display, index) {  //实现接口，以关联创建的行view
            return new ProjectTrView({          //实例化列表tr view
                model: item,                          //每行render所需的数据
                renderCallback: mode,                //每render 一行执行的回调函数，也就是 tr view 的render方法  也就是 renderEditMode 方法。
                display: display,
                index: index
            });
        }
    });

    //创建动态列表行view类
    var ProjectTrView = BaseElementView.extend({
        canCheck: false,
        tagName: 'tr',
        className: 'rx-grid-tr',
        renderEditMode: function () {    //实现渲染接口
            var html =
                "<td style='text-align:center'>" + this.index + "</td>" +
                "<td style='text-align:center'><input type='text'  class='i_text' data-property='projectName' data-model='" + this.model.get("ModelName") + "'/></td>" +
                "<td style='text-align:center'><input type='text'  class='i_text' data-property='projectType' data-model='" + this.model.get("ModelName") + "'/></td>";
            html += "<td style='text-align:center'>" +
                ' <a href="#none" class="delete">删除</a> ';
            $(this.el).html(html);
        }
    });

    var projectTableView = new ProjectTableView({
        collection: modelDemoOrgan.get("demoProjectList"),
        el: $("#project")
    });
    projectTableView.render();
}

function uploadFile1() {
    var fileObj = document.getElementById("upload-file").files[0]; // 获取文件对象
    var FileController = "entityServlet1"; // 接收上传文件的后台地址

    if (fileObj) {
        alert(fileObj);
        // FormData 对象
        var form = new FormData();
        form.append("file", fileObj);// 文件对象

        // XMLHttpRequest 对象
        var xhr = new XMLHttpRequest();
        xhr.open("post", FileController, true);
        xhr.onload = function () {
            alert(xhr.responseText);
        };
        xhr.send(form);

    } else {
        alert("未选择文件");
    }
}
var leaderTableView
function createLeaderList() {
    //动态列表主体view类
    var LeaderTableView = BaseTableView.extend({
        getControlHtml: function () {    // title 和 控制区域渲染接口
            var controlStr = '<div class="page_title"><h1>项目列表</h1>';
            controlStr += '<ul class="action_button to_right">';
            controlStr += '<li><a class="addTrLayerItem">系统新增</a></li>';
            controlStr += '<li><a class="deleteItems">系统删除</a></li>' +
                '</ul></div>';
            return controlStr;
        },
        //复写注册事件
        events: {
            'click .add': 'add',
            // 'click .addTrItem': 'addNewItem',
            'click .addTrLayerItem': 'openAddLayer',
            'click .deleteItems': 'deleteItems'
        },
        getTheadHtml: function () {  //实现表头区域渲染接口
            var theads = "<thead>";
            theads += "<th style='width:5%'>序号</th>" +
                "<th style='width:20%'>项目名称</th>  " +
                "<th style='width:20%'>项目类型</th>  ";
            theads += "<th style='width:10%'>操作</th></thead>";
            return theads;
        },
        getNewModel: function () { //实现接口，以关联创建的model
            return new ModelDemoProject();
        },
        getNewTrView: function (item, mode, display, index) {  //实现接口，以关联创建的行view
            return new LeaderTrView({          //实例化列表tr view
                model: item,                          //每行render所需的数据
                renderCallback: mode,                //每render 一行执行的回调函数，也就是 tr view 的render方法  也就是 renderEditMode 方法。
                display: display,
                index: index
            });
        },
        openAddLayer: function () {
            openStack(window, "查找", "medium", "/demo/demoOrganSelect?func=leadCallback");
        }
    });

    //创建动态列表行view类
    var LeaderTrView = BaseElementView.extend({
        canCheck: false,
        tagName: 'tr',
        className: 'rx-grid-tr',
        renderEditMode: function () {    //实现渲染接口
            var html =
                "<td style='text-align:center'>" + this.index + "</td>" +
                "<td style='text-align:center'><input type='text'  class='i_text' data-property='projectName' data-model='" + this.model.get("ModelName") + "'/></td>" +
                "<td style='text-align:center'><input type='text'  class='i_text' data-property='projectType' data-model='" + this.model.get("ModelName") + "'/></td>";
            html += "<td style='text-align:center'>" +
                ' <a href="#none" class="delete">删除</a> ';
            $(this.el).html(html);
        }
    });

     leaderTableView = new LeaderTableView({
        collection: modelDemoOrgan.get("demoProjectList"),
        el: $("#leader")
    });
    leaderTableView.render();
}

function leadCallback() {
    leaderTableView.addSelItem(new ModelDemoProject({
        projectName:"HAH",
        projectType:"wofg"
    }))
}