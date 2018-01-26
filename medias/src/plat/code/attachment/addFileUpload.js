var dictCode = GetQueryString("dictCode");
var pcode = GetQueryString("pcode");
var limit = GetQueryString("limit");
var defaultType = GetQueryString("defaultType");
var uploadLimit = 999;
var cindex;
if (limit != null) {
    uploadLimit = parseInt(limit);
}
var fileType = "*.gif;*.jpg;*.png;*.doc;*.docx;*.ppt;*.pptx;*.xls;*.xlsx;*.txt;*.rar;*.zip;*.pdf";
$(document).ready(function () {
    resizeForm();
    //获取设置的上传文件类型 object
    var fileTypeObject = winData(window, "param");
    if (fileTypeObject) {
        if (typeof fileTypeObject == "object") {
            $("#fjlb").bind("change", function () {
                var fjNo = $("#fjlb").val();
                var filtLimit = fileTypeObject["zd" + fjNo];
                if (filtLimit) {
                    $('#file_upload').uploadify('settings', 'fileTypeExts', filtLimit);
                    $('#file_upload').uploadify('settings', 'fileTypeDesc', filtLimit);
//                            $("[name='fileType']").val(filtLimit);
//                            $("#fileDes").show();
                } else {
                    $('#file_upload').uploadify('settings', 'fileTypeExts', '*.gif;*.jpg;*.png;*.doc;*.docx;*.ppt;*.pptx;*.xls;*.xlsx;*.txt;*.rar;*.zip;*.pdf');
                    $('#file_upload').uploadify('settings', 'fileTypeDesc', "*.gif;*.jpg;*.png;*.doc;*.docx;*.ppt;*.pptx;*.xls;*.xlsx;*.txt;*.rar;*.zip;*.pdf");
//                            $("#fileDes").hide();
                }
            });
            if (fileTypeObject["zd1"]) {
                fileType = fileTypeObject["zd1"];
            }
        } else {
            fileType = fileTypeObject;
        }
    }
    var thumbFlag = true;//上传的附件是否需要生成缩略图,默认生成
//            $("[name='fileType']").val(fileType);
    if (defaultType != null) {
        $("[name='defaultType']").val(defaultType);
    }
    if (dictCode == null || dictCode == "") {
        $("#fjlb").val(0);
        $("#fjlbtr").hide();
    } else {
        var zdx = JsCache(dictCode, pcode);
        for (var i = 0; i < zdx.length; i++) {
            if (zdx[i].value != null && zdx[i].value != "") {
                $("#fjlb").append("<option value='" + zdx[i].code + "' title='" + zdx[i].value + "'>"
                    + zdx[i].value + "</option>");
            }
        }
    }
    //附件id
    $("#uuid").val(GetQueryString("uuid"));
    $("#uploadBtn").click(function () {
        if (dictCode != null && dictCode != "") {
            if ($("#fjlb").val() != "" && $("#fjlb").val() != "0") {
                $("#defaultType").val($("#fjlb").val());
                $('#file_upload').uploadify('upload', '*');
                // $(this).omButton({disabled: true});
            } else {
                layer.alert("请先选择文件类别");
            }
        } else {
            $("#defaultType").val("0");
            $('#file_upload').uploadify('upload', '*');
            // $(this).omButton({disabled: true});
        }
    });

//删除
    $("#deleteBtn").click(function () {
        $.post("deleteAttachment", {}, function (data) {
        });
    });
//取消
    $("#cancel").click(function () {
        var topIndex = layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        layer.close(topIndex);
    });


    $("#file_upload").uploadify({
        'buttonText': '选择文件',
        'width': 70,
        'height': 20,
        'swf': RX.handlePath('/medias/plugin/uploadify/uploadify.swf'),
        'auto': false,
        'uploader': RX.handlePath('/attachment/upload?random=' + Math.random()),
        'fileSizeLimit': '10MB',
        'fileObjName': 'filedata',
        'uploadLimit': uploadLimit,
        'multi': true,
        'formData': {
            'fjlbNo': $("[name='fjlb_no'] option:selected").val(),
            'uuid': $("[name='uuid']").val(),
            'defaultType': (defaultType == null ? "" : defaultType),
            'fj_type': "file"
        },
        'fileTypeExts': fileType,
        'fileTypeDesc': fileType,
        'onUploadStart': function (file) {
            cindex = layer.load();
            $("#file_upload").uploadify("settings", "formData", {
                'uuid': $("[name='uuid']").val(),
                'fjlbNo': $("[name='defaultType']").val(),
                'thumbFlag': thumbFlag
            });
        },
        'onSelect': function (file) {
            $("#uploadBtn").omButton('enable');
        },
        'overrideEvents': ['onSelectError', 'onDialogClose'],
        'onSelectError': function (file, errorCode, errorMsg) {
            switch (errorCode) {
                case -120 :
                    layer.alert("文件为空！");
                    break;
                case -100 :
                    layer.alert("不能上传多个文件！");
                    break;
                case -110 :
                    layer.alert("文件不可超过10M！");
                    break;
                case -130 :
                    layer.alert("文件类型不正确！");
                    break;
                default :
                    layer.alert("出现错误，不能上传");
            }
        },
        'onFallback': function () {
            layer.alert("您未安装FLASH控件，无法上传！请现在flash插件");
            //{btn: ['是', '否']},
            //function (index) {
            //    //判断浏览器，ie是ie的flash  ，
            //    window.open(RX.handlePath("/medias/importModel/flashplayer_23.exe"));
            //    layer.close(index);
            //}, function (index) {
            //    layer.close(index);
            //}
        },
        'onUploadSuccess': function (file, data, response) {
            var json = eval("(" + data + ")");
            if (json.err) {
                uploadResult += file.name + "_" + json.err + "<br/>";
            }
        },
        'onQueueComplete': function (queueData) {
            layer.close(cindex);
            if (queueData.uploadsErrored > 0) {
                layer.alert(queueData.uploadsErrored + "个文件上传失败");
            } else {
                if (uploadResult) {
                    layer.alert(uploadResult);
                } else {
                    rxMsg("上传成功");
                }
                uploadResult = '';
            }
        }
    });
});