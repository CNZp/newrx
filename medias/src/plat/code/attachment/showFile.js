var jd = 0;
var src;
//判断ie类型
var ieType = IEType();
$(function () {
    //初始化尺寸
 resizeForm();
    pageAjax();
    //获取初值
    var id = GetQueryString("id");    //附件 id
    var file = {};
    var hasExt = true;
    if (id != null) {
        $.ajax({
            type: "get",
            url: "/attachment/getAttachment?id=" + id + "&random=" + Math.random(),
            async: false,
            success: function (ar) {
                if (ar.success) {
                    file = eval(ar.data);
                    var ns = file.name.split(".");
                    if (file.extension == null || "" === file.extension) {
                        hasExt = false;
                        if (ns.length > 0) {
                            file.extension = ns[ns.length - 1];
                        }
                    } else if (ns.length > 0) {
                        var ext = ns[ns.length - 1];
                        if (ext == file.extension) {
                            hasExt = false;
                        }
                    }
                    if (hasExt) {
                        file.name = file.name + "." + file.extension;
                    }
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
        file.fileSize = getFileSize(file.fileSize);
        $("#filename").text(file.name + "(" + file.fileSize + ")");
        if (file.description != null && file.description != "") {
            $("#description").find("span").text(file.description);
            $("#description").show();
        }
        //预览处理
        var ftype = file.extension.toString().toLowerCase();
        //var src = "";
        if (ftype == "doc" || ftype == "docx" || ftype == "xls" || ftype == "xlsx" || ftype == "ppt" || ftype == "pptx" || ftype == "txt") {
//            $('a.media').prop("href",file.thAbsolutePath);
//            $('a.media').media({width:699, height:379});
//            $(window).resize(function() {
//                $(".form_box").height($(window).height() - $(".w_button_box").outerHeight());
//                $("div .media").height($(window).height() - $(".w_button_box").outerHeight() - $(".title").outerHeight());
//                $("div .media").width($(window).width());
//                $("div .media").find("iframe").height($(window).height() - $(".w_button_box").outerHeight() - $(".title").outerHeight() - 1);
//                $("div .media").find("iframe").width($(window).width() - 1);
//            })
        } else if (ftype == "rar" || ftype == "zip" || ftype == "7z") {
            src = RX.handlePath("/medias/images/baseModel/attachment/zip.png");
            showPic(src);
        } else if (ftype == "jpeg" || ftype == "gif" || ftype == "png" || ftype == "jpg") {
            src = RX.handlePath("/attachment/getImage?id=") + id + "&rom=" + Math.random();
            $(".photoOperate").show();
            showPic(src);
        } else {
            src = RX.handlePath("/medias/style/plat/image/attachment/pt.png");
            showPic(src);
        }
    }
    closeLoading();
});

//展示图片
function showPic(src) {
    $("#preview").append("<img id='previewimg' onload='changePic()' src='" + src + "'/>")
}

//改变突变
function changePic() {
    var w = document.getElementById("previewimg").offsetWidth;
    var h = document.getElementById("previewimg").offsetHeight;
    if (w >= 700 || h > 300) {
        var kgbw = w / 700;
        var kgbh = h / 300;
        if (kgbw < kgbh) {
            kgbw = kgbh;
        }
        document.getElementById("previewimg").width = w / kgbw;
        document.getElementById("previewimg").height = h / kgbw;
    }
    var height = document.getElementById("previewimg").height;
    if (height < 300) {
        var padtop = (300 - height) / 2;
        $("#previewimg").css("padding-top", padtop + "px");
    }
}

function changeBigger() {
    var w = document.getElementById("previewimg").offsetWidth;
    var h = document.getElementById("previewimg").offsetHeight;
    if (!(document.getElementById("previewimg").tagName == 'CANVAS')) {
        document.getElementById("previewimg").width = 1.6 * w;
        document.getElementById("previewimg").height = 1.6 * h;
    } else {
        document.getElementById("previewimg").width = 1.6 * w;
        document.getElementById("previewimg").height = 1.6 * h;

        var canvas = document.getElementById("previewimg");
        var xjd = jd % 360;
        var rotation = Math.PI * xjd / 180;

        var costheta = Math.cos(rotation);
        var sintheta = Math.sin(rotation);

        canvas.oImage.src = src;
        if (xjd == 270 || 90) {
            canvas.oImage.height = document.getElementById("previewimg").width;
            canvas.oImage.width = document.getElementById("previewimg").height;
        } else {
            canvas.oImage.height = document.getElementById("previewimg").height;
            canvas.oImage.width = document.getElementById("previewimg").width;
        }

        var context = canvas.getContext('2d');
        context.save();
        if (rotation <= Math.PI / 2) {
            context.translate(sintheta * canvas.oImage.height, 0);
        } else if (rotation <= Math.PI) {
            context.translate(canvas.width, -costheta * canvas.oImage.height);
        } else if (rotation <= 1.5 * Math.PI) {
            context.translate(-costheta * canvas.oImage.width, canvas.height);
        } else {
            context.translate(0, -sintheta * canvas.oImage.width);
        }
        context.rotate(rotation);
        context.drawImage(canvas.oImage, 0, 0, canvas.oImage.width, canvas.oImage.height);
        context.restore();
    }

}
function changeSmaller() {
    var w = document.getElementById("previewimg").offsetWidth;
    var h = document.getElementById("previewimg").offsetHeight;
    if (!document.getElementById("previewimg").tagName == 'CANVAS') {

        document.getElementById("previewimg").width = w - (w / 2);
        document.getElementById("previewimg").height = h - (h / 2);
    } else {

        document.getElementById("previewimg").width = w - (w / 2);
        document.getElementById("previewimg").height = h - (h / 2);

        var canvas = document.getElementById("previewimg");
        var xjd = jd % 360;
        var rotation = Math.PI * xjd / 180;

        var costheta = Math.cos(rotation);
        var sintheta = Math.sin(rotation);

        canvas.oImage.src = src?src:"";
        if (xjd == 270 || 90) {
            canvas.oImage.height = document.getElementById("previewimg").width;
            canvas.oImage.width = document.getElementById("previewimg").height;
        } else {
            canvas.oImage.height = document.getElementById("previewimg").height;
            canvas.oImage.width = document.getElementById("previewimg").width;
        }

        var context = canvas.getContext('2d');
        context.save();
        if (rotation <= Math.PI / 2) {
            context.translate(sintheta * canvas.oImage.height, 0);
        } else if (rotation <= Math.PI) {
            context.translate(canvas.width, -costheta * canvas.oImage.height);
        } else if (rotation <= 1.5 * Math.PI) {
            context.translate(-costheta * canvas.oImage.width, canvas.height);
        } else {
            context.translate(0, -sintheta * canvas.oImage.width);
        }
        context.rotate(rotation);
        context.drawImage(canvas.oImage, 0, 0, canvas.oImage.width, canvas.oImage.height);
        context.restore();
    }
}

function rotate(id, angle, whence) {
    jd += angle;
    var p = document.getElementById(id);
    if (!whence) {
        p.angle = ((p.angle == undefined ? 0 : p.angle) + angle) % 360;
    } else {
        p.angle = angle;
    }
    if (p.angle >= 0) {
        var rotation = Math.PI * p.angle / 180;
    } else {
        var rotation = Math.PI * (360 + p.angle) / 180;
    }
    var costheta = Math.cos(rotation);
    var sintheta = Math.sin(rotation);
    //if (document.all && !window.opera) {
    if (ieType && ieType <= 8) {
        var canvas = document.createElement('img');
        canvas.src = p.src;
        canvas.height = p.height;
        canvas.width = p.width;
        canvas.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=" + costheta + ",M12=" + (-sintheta) + ",M21=" + sintheta + ",M22=" + costheta + ",SizingMethod='auto expand')";
    } else {
        var canvas = document.createElement('canvas');
        if (!p.oImage) {
            canvas.oImage = new Image();
            canvas.oImage.src = p.src;
            canvas.oImage.height = p.height;
            canvas.oImage.width = p.width;
        } else {
            canvas.oImage = p.oImage;
        }
        canvas.style.width = canvas.width = Math.abs(costheta * canvas.oImage.width) +
            Math.abs(sintheta * canvas.oImage.height);
        canvas.style.height = canvas.height = Math.abs(costheta * canvas.oImage.height) +
            Math.abs(sintheta * canvas.oImage.width);
        var context = canvas.getContext('2d');
        context.save();
        if (rotation <= Math.PI / 2) {
            context.translate(sintheta * canvas.oImage.height, 0);
        } else if (rotation <= Math.PI) {
            context.translate(canvas.width, -costheta * canvas.oImage.height);
        } else if (rotation <= 1.5 * Math.PI) {
            context.translate(-costheta * canvas.oImage.width, canvas.height);
        } else {
            context.translate(0, -sintheta * canvas.oImage.width);
        }
        context.rotate(rotation);
        context.drawImage(canvas.oImage, 0, 0, canvas.oImage.width, canvas.oImage.height);
        context.restore();
    }
    canvas.id = p.id;
    canvas.angle = p.angle;
    p.parentNode.replaceChild(canvas, p);
}
function rotateRight(id, angle) {
    rotate(id, angle == undefined ? 90 : angle);
}
function rotateLeft(id, angle) {
    rotate(id, angle == undefined ? -90 : -angle);
}

