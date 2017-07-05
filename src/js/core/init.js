/**
 * Created by Ninghai on 2017/5/24.
 */
define(["getTree", "timer", "initWeb", "ml", "mapBase"], function (getTree, timer, initWeb, ml, mapBase) {
    "use strict";

    function initImpl() {

        //初始化左侧菜单栏
        $('#main-menu').kendoPanelBar({});

        //初始化弹出框
        $('#chart').kendoChart({
            title: {text: "实时路况信息", align: "top"},
            legend: {
                position: "top"
            },
            seriesDefaults: {
                type: "line",
                spacing: 0
            },
            series: [{
                field: "siemens",
                name: "Siemens",
                color: "#26C0C0",
                tooltip: {
                    visible: true,
                    template: "#= dataItem.siemens #"
                }
            }, {
                field: "baidu",
                name: "Baidu",
                color: "#33CC00",
                tooltip: {
                    visible: true,
                    template: "#= dataItem.baidu #"
                }
            }],
            categoryAxis: [
                {
                    field: "date",
                    majorGridLines: {
                        visible: false
                    },
                    axisCrossingValue: [0, 10],
                    justified: true
                }
            ],
            valueAxis: [
                {
                    name: "siemens",
                    min: 0,
                    color: "#007EFF",
                    labels: {
                        format: "{0}"
                    }

                }
            ]
        });
        $("#timeSelect").kendoDateTimePicker({
            format: "yyyy/MM/dd",
            min:new Date(2017,0,0)
        });



        var menu = $('#main-menu').data('kendoPanelBar');

        $.getJSON('src/js/menu.json').then(function (d) {
            var data = [];
            for (var key in d) {
                data.push(d[key]);

            }
            var tree = getTree.getTree(data, 0);
            console.log(tree);
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
                    point: [39.98269, 116.46636],
                    id: "1"
                },
                {
                    url: "src/images/siemens/intersections.png",
                    point: [39.98495, 116.46287],
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