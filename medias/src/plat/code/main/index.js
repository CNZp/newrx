/**
 * 登录
 */
$(function () {
    //初始化内容区域高
    $("#leftMenu").height($(window).height() - 40);
    //生成一级菜单
    // createMenu();
    //初始化用户名
    $("#user_name").html(RX.decode($.cookie('userName')));
    //初始化第一个样式
    $("#menu a:first").addClass("selected");
});
//页面大小改变时，触发jquery的resize方法，自适应拖拽
$(window).resize(function () {
    $("#leftMenu").height($(window).height() - 40);
});

//动态生成菜单
function createMenu() {
    $.ajax({
        type: "post",
        url: "/resource/getUserResource",
        async: false,
        dataType: "json",
        data: {type: "menu", parentCode: "HTGL"},
        success: function (ar) {
            if (ar.success) {
                menuData = ar.data;
                $.each(menuData, function (i, v) {
                    //有url
                    if (v.url) {
                        $("#menu").append('<li class="im"><a href="' + RX.handlePath(v.url) + '" id="one"  onclick="setTab(this)" target="MainIframe"><i class="iconfont">' + (v.icon ? v.icon : '') + '</i>' + v.name + '</a></li>');
                        if (i === 0) {
                            $("#mainframe").attr("src", RX.handlePath(v.url));
                        }
                    } else {
                        $("#menu").append('<li class="im"><a href="leftMenu.html?index=' + i + '" id="one"  onclick="goMenu(this,' + i + ')" target="MainIframe"><i class="iconfont">' + (v.icon ? v.icon : '') + '</i>' + v.name + '</a></li>');
                    }
                });
                if (menuData.length) {
                    if (menuData[0].url) {
                        $("#leftMenu").attr("src", RX.handlePath(menuData[0].url));
                    } else {
                        $("#topMenu a").eq(0).click();
                    }
                }
            } else {
                layer.alert(ar.msg);
            }
        }
    });
}

//跳转菜单
function goMenu(t, index) {
    setTab(t);
}

var objtemp;

//点击设置菜单样式
function setTab(obj) {
    document.getElementById("one").className = "";
    if (objtemp)
        objtemp.className = "";
    obj.className = "selected";
    objtemp = obj;
}

function gotoUrl(obj, url) {
    var el = obj[0], iframe = el.contentWindow;
    if (iframe != null) {
        if (iframe.closeFunc) {
            iframe.closeFunc();
        }
    }
    if (el) {
        if (isIE) {
            el.src = 'about:blank';
            try {
                iframe.document.write('');
                iframe.close();
            } catch (e) {
            }
        }
        el.src = url;
    }
}

//修改密码
function openStack() {
    RX.form.open({title:"增加弹层", areaType:"small", url:"index.html",shade:false});
}

function closeStack(){
    RX.form.close();
}

function closeAllStack(){
    RX.form.closeAll();
}

function gotoForm(url){
    RX.form.goto(url);
}

function backForm(){
    RX.form.back();
}

function refreshForm(){
    RX.form.refresh();
}

function addChildParam1(){
    RX.form.addChildParam({name:"MainIframe"},{a:"我是传参值1"})
}

function addChildParam2(){
    RX.form.addChildParam({name:"MainIframeNo"},{a:"我是传参值1"})

}