var type = GetQueryString('type');
$(function () {
    resizeForm();
    if ('safe' == type) {
        $('#tixing').show();
    }

    $("#save").click(function () {
        var oldPwd = $.trim($("#oldPwd").val());
        var newPwd = $.trim($("#newPwd").val());
        var confirmPwd = $.trim($("#confirmPwd").val());

        if (!newPwd) {
            rxMsg(RxMsgType.WARNNING,"新密码不能为空！");
            return;
        }
        // if (null == newPwd.match(/^(?=.*[0-9])(?=.*[a-zA-Z]).{8,16}$/)) {
        //     top.layer.alert('请输入8至16位，必须有字母和数字');
        //     return;
        // }
        if (!confirmPwd) {
            rxMsg(RxMsgType.WARNNING,"请确认新密码！");
            return;
        }
        if (newPwd != confirmPwd) {
            rxMsg(RxMsgType.ERROR,"两次输入密码不一致！");
            return;
        }
        // if (newPwd.length != 6 || confirmPwd.length != 6) {
        //     top.layer.alert("新密码必须是长度为6的数字或英文")
        //     $("#new_pwd").attr("value", "");
        //     $("#new_pwd2").attr("value", "");
        //     return;
        // }
        if (newPwd == oldPwd) {
            layer.alert("新密码不能与原密码相同！");
            return;
        }
        $.ajax({
            type: "POST",
            url: "/main/changePwd",
            data: {"oldPwd": oldPwd, "newPwd": newPwd},
            async: false,
            success: function (ar) {
                if (ar.success) {
                    $.cookie('loginName', "");
                    $.cookie('loginPwd', "");
                    layer.closeAll();
                    rxMsg(ar.msg);
                } else {
                    layer.alert(ar.msg);

                }
            }

        });
    });
});


