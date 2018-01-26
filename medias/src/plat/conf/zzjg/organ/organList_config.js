//搜索部分配置
var SOrganJson = {
    SOrgan: {
        organ_name: {
            tagName: "机构名称",
            maxLength: 40,
            canClear: true
        },
        full_name: {
            tagName: "机构全称",
            maxLength: 40,
            canClear: true
        },
        parentName: {
            tagName: "上级机构",
            disabled: true,
            spanShow: false
        },
        organ_code: {
            tagName: "机构编码",
            maxLength: 40,
            canClear: true
        },
        parentId: {       //上级机构id  隐藏字段
            display: false,
            disabled: true
        }
    }
};
//规定表头
var columns = [
    {
        title: '机构名称',
        id: 'ORGAN_NAME',
        width: '20%',
        align: 'center',
        renderer: function (v, rowData, rowIndex, showPro) {
            var rhtml = v;
            if (rowData.UTYPE == 1) {
                showPro.stitle = v;
                showPro.ifSetTitle = true;
                showPro.replaceSymbols = false;
                rhtml = "<img src='" + RX.handlePath("/medias/style/plat/image/resource/home_resource.png") + "'" +
                    " style='margin:-4px 5px 0px 0px;' align='absmiddle'/>" + rhtml;
            }
            return rhtml;
        }
    },
    {title: '机构全称', id: 'FULL_NAME', width: '20%', align: 'center', renderer: "String"},
    {title: '机构编码', id: 'ORGAN_CODE', width: '20%', align: 'center', renderer: "String"},
    {title: '上级机构', id: 'SJ_ORGAN', width: '', align: 'center', renderer: "String"}
];
//机构列表主配置
var OrganList_Propertys = {
    ModelName: "OrganList", //模型名称
    url: "getOrganList",  //请求列表数据的url 已自动添加了random不需要在加random
    columns: columns,
    searchJson: SOrganJson,
    SearchModelName: "SOrgan",
    colSetting: [100, 150, 100, 150, 100, 150] //列宽设置
};

var buttonArr = [
    {
        id: "add",
        name: "新增",
        icon: "&#xe62a;",
        onClick: "add"              //可以是方法引用，也可以是方法字符串名称
    },
    {
        id: "edit",
        name: "修改",
        icon: "&#xe605;",
        onClick: "edit"
    },
    {
        id: "del",
        name: "删除",
        icon: "&#xe606;",
        onClick: "openLink"
    }
];
//存在默认配置
var buttonsJson = {
    tag: "._rx_grid_control",
    tpl: null,
    param: {},
    title: null,
    buttons: buttonArr,
    beforeInit: function (param) {
        return true
    },
    onInit: function (param) {
    }
};


