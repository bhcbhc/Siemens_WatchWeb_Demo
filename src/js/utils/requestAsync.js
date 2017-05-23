/**
 * Created by Ninghai on 2017/5/19.
 */
define(function () {
    "use strict";

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

    return {
        post: ajaxPostIpml,
        get: ajaxGetImpl
    }
});