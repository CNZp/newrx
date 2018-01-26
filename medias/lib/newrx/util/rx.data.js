(function (window) {
    /**
     * 替换字符
     * @param str 被操作的字符串
     * @param reallyDo 被替换的字符
     * @param replaceWith 替代的字符
     * @returns {*} 替换后的字符串
     */
    RX.replaceStrChar = function (str, reallyDo, replaceWith) {
        var e = new RegExp(reallyDo, "g");
        var words = str;
        if (str && typeof str === 'string') {
            words = str.toString().replace(e, replaceWith);
        }
        return words;
    };
    /**
     * 汉字转码
     * @param val 待转的汉字
     * @returns {string} 转码后的字符串
     */
    RX.encode = function (val) {
        return !val ? "" : encodeURI(encodeURI(val));
    };
    /**
     * 汉字解码
     * @param val 带解码的字符串
     * @returns {string} 解码后的字符串
     */
    RX.decode = function (val) {
        return !val ? "" : decodeURI(decodeURI(val));
    };
    /**
     * 截取字符串,后面多的显示省略号
     * @param data
     * @param length
     * @returns {*}
     */
    RX.getSubStr = function (data, length) {
        if (data && data.length > length) {
            return data.substring(0, length) + "...";
        } else {
            return data;
        }
    };

    /**
     * 获取字典
     * @param dictCode 字典编码
     * @param pcode    父字典编码
     * @returns {Array} 字典数组
     * @constructor
     */
    RX.JsCache = function (dictCode, pcode) {
        var dictData = [], newData = [];
        if (window.dictPoolData) {
            if (window.dictPoolData[dictCode]) {
                dictData = window.dictPoolData[dictCode];
            } else {
                dictData = getZdFromCon(dictCode);
                //存储数据
                window.dictPoolData[dictCode] = dictData;
            }
        } else {
            window.dictPoolData = {};
            dictData = getZdFromCon(dictCode);
            //存储数据
            window.dictPoolData[dictCode] = dictData;
        }
        if (pcode) {
            if (typeof(pcode) === "object") {
                if (pcode.length > 0) {
                    for (var m = 0; m < pcode.length; m++) {
                        $.each(dictData, function (i, item) {
                            if (item.pcode === pcode[m]) {
                                newData.push(item);
                            }
                        });
                    }
                }
            } else {
                $.each(dictData, function (i, item) {
                    if (item.pcode === pcode) {
                        newData.push(item);
                    }
                });
            }

            return newData;
        } else if (pcode === "") {
            $.each(dictData, function (i, item) {
                if (!item.pcode) {
                    item.pcode = "";
                    newData.push(item);
                }
            });
            return newData;
        } else {
            return dictData;
        }
    };

    /**
     * 从后端获取
     * @param dictCode
     * @returns {Array}
     */
    RX.getZdFromCon = function (dictCode) {
        var dictData = [];
        $.ajax({
            async: false,
            type: "POST",
            url: "/dict/getDictByCodes",
            data: {codeStr: dictCode},
            dataType: "JSON",
            success: function (ar) {
                dictData = ar;
            }
        });
        return dictData;
    };
    /**
     *处理缓存字典
     */
    RX.handleCacheDict = function () {
        var handleArr = [],
            length = 0;
        return function (objJson) {
            if (objJson) {
                var flag = true;
                for (var i = 0; i < length; i++) {
                    if (handleArr[i] == objJson) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    handleArr.push(objJson);
                    length++;
                    var dictCode = [];
                    var obj;
                    var subObj;
                    for (var code in objJson) {
                        obj = objJson[code];
                        for (var no in obj) {
                            subObj = obj[no];
                            if (subObj.dictConfig && subObj.dictConfig.dictCode && typeof subObj.dictConfig.dictCode === "string") {
                                dictCode.push(subObj.dictConfig.dictCode);
                            }
                        }
                    }
                    cacheDict(dictCode);
                }
            }
        }
    }();


}).call(this);