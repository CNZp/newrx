(function (window) {

//计算两个日期的时间差
    RX.compareDate = function (startDate, endDate) {
        //判断对象不是null也不是空字符串
        function isNotNull(str) {
            return str != null && str != '';
        }

        if (isNotNull(startDate) && isNotNull(endDate)) {
            var startTime = (new Date(startDate)).getTime();//传过来的开始时间转换为毫秒
            var endTime = (new Date(endDate)).getTime();
            var result = (startTime - endTime) / 24 / 60 / 60 / 1000;
            if (result >= 0) {
                return result;
            }
        }
    }
}).call(this);