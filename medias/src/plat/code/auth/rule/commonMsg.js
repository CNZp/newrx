$(function () {
    resizeForm();
    var data = winData(window, "param");
    for (var m=0;m< data.length;m++) {
        var dataMsg = data[m];
        var strArr = [];
        strArr.push("<div class='page_title'>" +
            "<h1>" + replaceSymbols(dataMsg.name) + "</h1></div>");
        strArr.push("<table class='form1'> ");
        var woData = dataMsg.data;
        var showName = dataMsg.showName;
        strArr.push("<col width='25%'/> <col width='25%' /><col width='25%' /> <col />");
        strArr.push("<tr>");
        for (var i = 0; i < woData.length; i++) {
            if(i!=0 && i%4 == 0){
                strArr.push("</tr><tr>");
            }
            if (showName instanceof Array) {
                strArr.push("<td class='msgTd' title='"+woData[i][showName[0]]+"'><span>"+replaceSymbols(woData[i][showName[0]]));
                if (showName[1]) {
                    strArr.push("(" + replaceSymbols(woData[i][showName[1]]) + ")</span>" + "</td> ");
                }else{
                    strArr.push("</span></td>");
                }
            } else {
                strArr.push("<td class='msgTd' title='"+woData[i][showName]+"'><span>"+replaceSymbols(woData[i][showName]) + "</span></td>");
            }
        }
        strArr.push("</tr>");
        strArr.push("</table>");
        $("#msg").append(strArr.join(""));
    }

    $("#confirm").click(function(){
         closeWin();
    });
});

// 替换html中的特殊符号
function replaceSymbols(s)
{
    if(s) {
        s = s.toString().replace(/</g, "&lt;");
        s = s.toString().replace(/>/g, "&gt;");
    }
    return s;
}
