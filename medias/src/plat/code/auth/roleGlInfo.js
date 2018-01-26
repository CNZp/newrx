$(function(){
    $(".glinfo_title").on("click",function(){
        var $content = $(".glinfo_content");
        if($content.is(":hidden")){
            $content.show("slow");
            $(this).text("点击收起已关联要素信息");
        }else{
            $content.hide("slow");
            $(this).text("点击展开已关联要素信息");
        }
    })

    $(".glinfo_left_item").on("click",function(){
        $(".glinfo_left_item").removeClass("glinfo_left_select");
        $(this).addClass("glinfo_left_select");
    })

    var renderGlxx = initGrid();

    //
    $("#glinfoOrgan").on("click",function(){
        renderGlxx([
            {id:1,lx:"jg",name:"机构1",info:""},
            {id:2,lx:"jg",name:"机构2",info:""},
            {id:3,lx:"jg",name:"机构3",info:""},
            {id:4,lx:"jg",name:"机构4",info:""},
            {id:5,lx:"jg",name:"机构5",info:""},
            {id:6,lx:"jg",name:"机构6",info:""},
            {id:7,lx:"jg",name:"机构7",info:""}
        ]);
    });
    $("#glinfoOrgan").trigger("click");

    $("#glinfoBasePost").on("click",function(){
        renderGlxx([]);
    });

    $("#glinfoInPost").on("click",function(){
        renderGlxx([
            {id:1,lx:"gw",name:"岗位1",info:"机构1"},
            {id:2,lx:"gw",name:"岗位1",info:"机构2"},
            {id:3,lx:"gw",name:"岗位1",info:"机构3"},
            {id:4,lx:"gw",name:"岗位1",info:"机构4"},
            {id:5,lx:"gw",name:"岗位1",info:"机构5"},
            {id:6,lx:"gw",name:"岗位1",info:"机构6"},
            {id:7,lx:"gw",name:"岗位1",info:"机构7"}
        ]);
    })

    $("#glinfoOutPost").on("click",function(){
        renderGlxx([]);
    })

    $("#glinfoInUser").on("click",function(){
        renderGlxx([]);
    })

    $("#glinfoOutUser").on("click",function(){
        renderGlxx([]);
    })

})

function initGrid(){
    var glinfoGrid = {
        data:[],
        searchData:[],
        searchName:"",
        total:0,
        limit:15,
        pageMax:1,
        pageNum:1
    }
    var $ul = $(".tableUl"),$paging = $(".rx-paging");
    function renderPageData(){
        $ul.empty();
        var handleData = glinfoGrid.searchName? glinfoGrid.searchData : glinfoGrid.data;
        for(var i = (glinfoGrid.pageNum-1)*glinfoGrid.limit; i < (glinfoGrid.pageNum)*glinfoGrid.limit && i<glinfoGrid.total; i++){
            $ul.append(RX.tpl("glinfoLi",handleData[i]));
        }
        $(".paged").text(glinfoGrid.pageNum);
    }
    function renderGrid(searchName){
        var handleData = glinfoGrid.data;
        $ul.empty();
        $paging.empty();
        if(searchName){
            if(searchName != glinfoGrid.searchName){
                glinfoGrid.searchName = searchName;
                glinfoGrid.searchData = [];
                $.each(glinfoGrid.data,function(i,t){
                    if(t.name.indexOf(searchName) >= 0){
                        glinfoGrid.searchData.push(t);
                    }
                })
            }
            handleData = glinfoGrid.searchData;
        }else{
            glinfoGrid.searchName = "";
            glinfoGrid.searchData = [];
        }
        glinfoGrid.total = handleData.length;
        glinfoGrid.pageNum = 1;
        glinfoGrid.pageMax = Math.floor(glinfoGrid.total/glinfoGrid.limit)+1;
        $paging.append(RX.tpl("paging",{total:glinfoGrid.total,
            pageMax:glinfoGrid.pageMax,pageNum:glinfoGrid.pageNum}));
        if(handleData.length > 0){
           renderPageData();
           return;
        }
        $ul.append('<div style="width:100%;text-align:center;">无数据</div>');
    }
    $("#search").on("click",function(){
        renderGrid($("#searchName").val() || "");
    })
    $paging.on("click",".rx-frist",function(){
        if(glinfoGrid.pageNum === 1){
            return;
        }
        glinfoGrid.pageNum--;
        renderPageData();
    })
    $paging.on("click",".rx-last",function(){
        if(glinfoGrid.pageNum === glinfoGrid.pageMax){
            return;
        }
        glinfoGrid.pageNum++;
        renderPageData();
    })
    return function(data){
        $("#searchName").val("");
        glinfoGrid.data = data || [];
        glinfoGrid.pageNum = 1;
        glinfoGrid.searchName = "";
        glinfoGrid.searchData = [];
        renderGrid();
    }
}