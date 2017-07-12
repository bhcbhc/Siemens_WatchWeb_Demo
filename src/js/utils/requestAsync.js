/**
 * Created by Ninghai on 2017/5/19.
 */
define(function () {

    /**
     *
     * @param options {url:remote data:}
     * @return {*|{then, fail, end}}
     */
    function ajaxPostIpml(options) {
        var d = $.Deferred();
        $.ajax({
            url: options.url,
            type: "POST",
            dataType: "json",
            data: options.data
        }).then(function (data) {
            d.resolve(data);
        }).fail(function (data) {
            d.reject(data);
        })
        return d.promise();
    }

    function ajaxGetImpl() {

    }

    function createXHRImplIe() {
        if (typeof XMLHttpRequest != "undefined") {

        } else if (typeof ActiveXObject != "undefined") {
            if (arguments.callee.activeXString != "string") {
                var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"],
                    i,
                    len;

                for (i = 0, len = versions.length; i < len; i++) {
                    try {
                        new ActiveXObject(versions[i]);
                        arguments.callee.activeXString = versions[i];
                    } catch (e) {

                    }
                }
            }
            return new ActiveXObject(arguments.callee.activeXString);
        } else {
            throw new Error("该浏览器没有XHR对象");
        }

    }

    function createXHRImpl(url, data) {
        var d = $.Deferred();
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log(xhr.responseText);
                    d.resolve(xhr.responseText);
                }
            }
        };
        xhr.open('post', url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
        // xhr.send('reqAll=' + JSON.stringify(data));
        xhr.send('reqAll=' + data);
        return d.promise();
    }

    //test Promise
    function getJson(url) {
        var promise = new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('get', url);
            xhr.onreadystatechange = handler;
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");
            xhr.send();


            function handler() {
                if (this.readyState !== 4) {
                    return;
                }
                if (this.readyState === 200) {
                    resolve(this.response)
                } else {
                    reject(new Error(this.statusText))
                }
            }
        });

        return promise;
    }

    /*   getJson('./tes.json').then(function(data){
     console.log(data);
     })*/

    return {
        post: ajaxPostIpml,
        get: ajaxGetImpl,
        postCors: createXHRImpl
    }
});