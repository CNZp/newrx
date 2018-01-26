/**
 * 登录
 */
$(function () {
    //回车事件
    regEnter(function () {
        $('#loginBt').trigger("click");
    });
    var lName = $.cookie('loginName');
    var lPwd = $.cookie('loginPwd');
    if (lName && lPwd) {
        $("#loginName").val(lName);
        $("#loginPwd").val(lPwd);
        $("#xczddl").attr("checked", true);
    }
    /**
     * 登陆验证
     */
    $("#loginBt").click(function () {
        $.cookie('loginName', $.trim($("#loginName").val()));
        $.cookie('loginPwd', $.trim($("#loginPwd").val()));
        if(checkSubmit()){
            $("#loginForm").trigger("submit");
        }
    });
});

//登录验证
function checkSubmit() {
    /*将错误提示信息栏置为空*/
    $("#loginErr").html("");
    /*判断登陆用户名是否为空*/
    if (!isNotNull($.trim($("#loginName").val()))) {
        $("#loginErr").html("*用户名不能为空");
        $("#loginName").focus();
        return false;
    }
    /*判断登陆密码是否为空*/
    if (!isNotNull($.trim($("#loginPwd").val()))) {
        $("#loginErr").html("*密码不能为空");
        $("#loginPwd").focus();
        return false;
    }
    return true;
}
$(function () {
    if (!-[1,] && !window.XMLHttpRequest) {         //IE6
        DD_belatedPNG.fix('.Login_subject');
    }
});
window.onload = function () {
    new tab('test1_li_now_', '_', null, 'onmouseover');
    new tab('test2_li_now_');
}
function tab(o, s, cb, ev) { //tab切换类
    var $ = function (o) {
        return document.getElementById(o)
    };
    var css = o.split((s || '_'));
    if (css.length != 4)return;
    this.event = ev || 'onclick';
    o = $(o);
    if (o) {
        this.ITEM = [];
        o.id = css[0];
        var item = o.getElementsByTagName(css[1]);
        var j = 1;
        for (var i = 0; i < item.length; i++) {
            if (item[i].className.indexOf(css[2]) >= 0 || item[i].className.indexOf(css[3]) >= 0) {
                if (item[i].className == css[2])o['cur'] = item[i];
                item[i].callBack = cb || function () {
                    };
                item[i]['css'] = css;
                item[i]['link'] = o;
                this.ITEM[j] = item[i];
                item[i]['Index'] = j++;
                item[i][this.event] = this.ACTIVE;
            }
        }
        return o;
    }
}
tab.prototype = {
    ACTIVE: function () {
        var $ = function (o) {
            return document.getElementById(o)
        };
        this['link']['cur'].className = this['css'][3];
        this.className = this['css'][2];
        try {
            $(this['link']['id'] + '_' + this['link']['cur']['Index']).style.display = 'none';
            $(this['link']['id'] + '_' + this['Index']).style.display = 'block';
        } catch (e) {
        }
        this.callBack.call(this);
        this['link']['cur'] = this;
    }
}