(function (window) {
    RX.checkSelected = function (gridModel) {
        var sel = gridModel.getSelect();
        if (sel.length > 0) {
            return sel;
        } else {
            _top.layer.alert("请先选择数据");
        }
        return null;
    }
}).call(this);