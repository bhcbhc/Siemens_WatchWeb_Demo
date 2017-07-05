/**
 * Created by Ninghai on 2017/6/16.
 */
+function () {
    $.ajax({
        url: "http://192.168.0.107:8080/WatchWeb_NEW/Main",
        data: "0",
        dataType: "json",
        type: "post"
    }).then(function (data) {
        var test = eval("(" + data + ")");
        console.log("2");
        $('#test').text(test);
    });
}();