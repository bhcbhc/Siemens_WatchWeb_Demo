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
            title: {text: "历史拥堵趋势", align: "top"},
            legend: {
                position: "top"
            },
            seriesDefaults: {
                type: "line",
                spacing: 0
            },
            series: [{
                field: "siemens",
                axis: "siemens",
                name: "Siemens",
                color: "#26C0C0",
                tooltip: {
                    visible: true,
                    template: "#= dataItem.siemens #"
                }
            }, {
                field: "baidu",
                axis: "baidu",
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
                    /*            axisCrossingValue: [0, 20],*/
                    justified: true
                }
            ],
            valueAxis: [
                {
                    name: "siemens",
                    min: 0,
                    color: "#007EFF"
                },
                {
                    name: "baidu",
                    color: "#33CC00",
                    min: 0
                }
            ]
        });

        //初始化下拉框
        var selectData = [{text: "default", value: "0"},
            {text: "60min", value: "1"},
            {text: "120min", value: "2"},
            {text: "180min", value: "3"}];


        $("#timeSelect").kendoDateTimePicker({
            format: "yyyy/MM/dd",
            min: new Date(2017, 6, 0)
        });

        $('#data-mode-select').kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: selectData,
            index: 0
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
            timeSelect: new Date(2017, 6, 4),
            series: [],
            getChart: function () {
                kendo.ui.progress($('#chart'), true);
                var id = this.link_id,
                    isAllDay = $('#allDaysCheckbox').is(':checked'),
                    time = $('#timeSelect').val();

                if (id) {
                    $.ajax({
                        url: AppConfig.serverAddress + AppConfig.linkMessageAddress,
                        type: "post",
                        data: {"link_id": id, "date": time, "isAllDay": isAllDay},
                        dataType: "json"
                    }).then(function (data) {
                        kendo.ui.progress($('#chart'), false);
                        viewModel.set('series', data);


                        $('#data-mode-select').kendoDropDownList({
                            dataTextField: "text",
                            dataValueField: "value",
                            dataSource: selectData,
                            index: 0,
                            change: onChange
                        });


                        function onChange() {
                            var value = $("#data-mode-select").val(),
                                spitLength,
                                curPage = 1;

                            if (value > 0) {
                                viewModel.set('series', data.slice(0, value * 12));

                                spitLength = Math.ceil(data.length / (12 * value));

                                $('.advance').on("click", function () {
                                    if (curPage === spitLength) {
                                        alert("已经到最后！");
                                        return;
                                    } else {
                                        curPage++;
                                        viewModel.set('series', data.slice(value * 12 * (curPage - 1), value * 12 * curPage));
                                    }
                                });

                                $('.backoff').on('click', function () {
                                    if (curPage === 1) {
                                        alert("已到最前！");
                                        return;
                                    } else {
                                        curPage--;
                                        viewModel.set('series', data.slice(value * 12 * (curPage - 1), value * 12 * curPage));
                                    }
                                })
                            } else {
                                $('.advance').unbind();
                                $('.backoff').unbind();
                                viewModel.set('series', data);
                            }
                        }
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