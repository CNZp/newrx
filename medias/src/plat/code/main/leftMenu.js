$(function () {
    //添加窗口层次管理
    // addFrameWin(window.frames["MainIframeR"], window);
    var index = RX.getQueryString("index");
    var $p = $("#nav");
    $p.empty();
    if (index) {
        //子菜单
        var subMenu = parent.menuData[index].CHILD_MENU;
        createSubMenu($p, subMenu);
    }
});

function createSubMenu(el, subMenu) {
    var $p = el;
    var flag = 0;
    var firstUrl;
    $.each(subMenu, function (i, t) {
        var $li = $("<li></li>");
        $p.append($li);

        if (!t.CHILD_MENU) {   //一级菜单
            $li.append('<a href="' + RX.handlePath(t.url) + '" class="link" target="MainIframeR"><i class="iconfont ico-left">' + (t.icon ? t.icon : '') + '</i>' + t.name + '</a>');
            $p.append($li);
        }
        else { //存在二级菜单
            flag++;
            var first = (i === 0 ? 'block' : 'none');
            $li.append('<a href="javascript:void(0);" class="link"><i class="iconfont ico-left">' + (t.icon ? t.icon : '') +'</i>' + '<span>'+t.name+'</span>' + ' <img\n' + 'class="more" src="/'+RX.ctxPath+'/medias/style/plat/image/common/more.png"/></a>');
            var $ul = $('<ul class="er"></ul>');
            $.each(t.CHILD_MENU, function (j, k) {
                $ul.append('<li><a href="' + RX.handlePath(k.url) + '" target="MainIframeR" ' + '><i class="iconfont">' + (k.MENU_ICON ? k.MENU_ICON : '') + '</i>' + k.name + '</a></li>');
            });
            $li.append($ul);
        }
        if (i === 0) {//初始化右侧页面
            if(t.url){
                firstUrl = t.url;
                $("#MainIframeR").attr("src", RX.handlePath(firstUrl));
                $li.find("a :first").addClass("xz");
            }else{
                firstUrl = t.CHILD_MENU[0].url;
                var $a = $li.find("a:first");
                $a.addClass("xz");
                var $er = $a.siblings(".er");
                $er.show();
                $er.find("a :first").addClass("sen_x");
                $("#MainIframeR").attr("src", firstUrl);
            }
        }
    });

}

