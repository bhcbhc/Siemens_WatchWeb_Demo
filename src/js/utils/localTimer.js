/**
 * Created by Ninghai on 2017/5/24.
 */

define(function () {
    "use strict";

    var week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

    function timerImpl(view) {
        var showTime = self.setInterval(function () {
            var timer = new Date(),
                year = timer.getFullYear(),
                month = formatDate(timer.getMonth() + 1),
                day = formatDate(timer.getDate()),
                hour = formatDate(timer.getHours()),
                min = formatDate(timer.getMinutes()),
                second = formatDate(timer.getSeconds()),
                currentWeek = week[timer.getDay()],
                currentTime = year + "-" + month + "-" + day + "&nbsp;" + hour + ":" + min + ":" + second + "&nbsp;" + currentWeek;

            view.html(currentTime);
        }, 1000)
    }

    function formatDate(date) {
        return (date < 10 ? "0" : "") + date;
    }

    return {
        setTime: timerImpl
    }
});