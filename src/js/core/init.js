/**
 * Created by Ninghai on 2017/5/24.
 */
define(["getTree", "timer", "initWeb", "mapBase"], function (getTree, timer, initWeb, mapBase) {
    "use strict";

    function initImpl() {

        //初始化左侧菜单栏
        $('#main-menu').kendoPanelBar({});
        var menu = $('#main-menu').data('kendoPanelBar');

        $.getJSON('src/js/menu.json').then(function (d) {
            var data = [];
            for (var key in d) {
                data.push(d[key]);
            }
            var tree = getTree.getTree(data, 0);
            menu.setOptions({
                dataSource: tree
            });
        });

        //加载本地时间
        timer.setTime($('#showTime'));

        //初始化地图
        var basicConf = {
            view: 'map-container',
            //116.4615, 39.97817
            point: [39.98362, 116.46628],
            zoom: 17,
            mark: [
                {
                    url: "src/images/siemens/intersections.png",
                    point: [39.98269,116.46636],
                    id: "1"
                },
                {
                    url: "src/images/siemens/intersections.png",
                    point: [39.98495,116.46287],
                    id: "2"
                }
            ]
        };
        initWeb.initInterface("menu");

        var map = mapBase.initMap(basicConf);

        return map;
    }

    return {
        init: initImpl
    }
});