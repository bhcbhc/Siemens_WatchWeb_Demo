/**
 * Created by Ninghai on 2017/5/18.
 */
require.config({
    paths: {
        "initWeb": './src/js/utils/widgetUtil'
    }

});
require(["initWeb"], function (initWeb) {
    "use strict";

    console.log('2');
    initWeb.initInterface("menu");
})