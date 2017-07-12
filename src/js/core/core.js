/**
 * Created by Ninghai on 2017/6/16.
 */
define(['mapBase', 'initWeb', 'getTree', 'timer'], function (mapBase, initWeb, getTree, timer) {
    "use strict";

    function initialize() {

        //初始化左侧菜单栏
        $('#main-menu').kendoPanelBar({});
        var menu = $('#main-menu').data('kendoPanelBar');

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
            min: new Date(2017, 0, 0)
        });

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


        window.viewModel = kendo.observable({
            link_id: null,
            timeSelect: new Date(2017, 6, 30),
            series: [],
            getChart: function () {
                var id = this.link_id;
                var time = $('#timeSelect').val();
                console.log("link_id:%s=>时间%s", id, time);
                if (id) {
                    $.ajax({
                        url: AppConfig.serverAddress + AppConfig.linkMessageAddress,
                        type: "post",
                        data: {"link_id": id, "date": time, "isAllDays": true},
                        dataType: "json"
                    }).then(function (data) {
                        viewModel.set('series', data);
                    })
                }
            }
        });

        kendo.bind('body', viewModel);

        //加载本地时间
        timer.setTime($('#showTime'));

        //展开/隐藏 菜单栏 初始化信息板
        initWeb.initInterface("menu");

        var map = mapBase.createMap();

        return map;
    }

    return {
        init: initialize
    }
});