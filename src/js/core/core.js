/**
 * Created by Ninghai on 2017/6/16.
 */
define(['mapBase', 'initWeb', 'getTree', 'timer'], function (mapBase, initWeb, getTree, timer) {
    "use strict";

    var cycleColors = ['#26C0C0', '#33CC00', '#CC7C39', '#a585a5', '#F4E001', '#007EFF'];

    function initialize() {

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


        //初始化弹出框  历史趋势图 历史周期折线图
        $('#chart_series1').kendoChart({
            title: {text: "历史拥堵趋势", align: "top"},
            legend: {
                position: "top"
            },
            seriesDefaults: {
                type: "line",
                spacing: 0,
                tooltip: {
                    visible: true
                }
            },
            series: [{
                field: "siemens",
                axis: "siemens",
                name: "Siemens",
                color: "#26C0C0"
            }, {
                field: "baidu",
                axis: "baidu",
                name: "Baidu",
                color: "#33CC00"
            }],
            categoryAxis: {
                field: "date",
                majorGridLines: {
                    visible: false
                },
                labels: {step: 24},
                axisCrossingValue: [0, 289],
                justified: true
            }
            ,
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
        $('#chart_series2').kendoChart({
            title: {text: "历史拥堵趋势", align: "top"},
            legend: {
                position: "top"
            },
            seriesDefaults: {
                type: "line",
                spacing: 0,
                tooltip: {
                    visible: true
                }
            },
            series: [{
                field: "siemens",
                axis: "siemens",
                name: "Siemens",
                color: "#26C0C0"
            }, {
                field: "baidu",
                axis: "baidu",
                name: "Baidu",
                color: "#33CC00"
            }],
            categoryAxis: {
                field: "date",
                majorGridLines: {
                    visible: false
                },
                labels: {step: 24},
                axisCrossingValue: [0, 289],
                justified: true
            }
            ,
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

        $('#chart-cycle').kendoChart({
            title: {text: "历史周期记录", align: "top"},
            legend: {
                position: "top"
            },
            seriesDefaults: {
                type: "line",
                spacing: 0,
                tooltip: {
                    visible: true
                }
            },
            series: [{
                field: "stage1",
                name: "Stage1",
                color: "#26C0C0"
            }, {
                field: "stage2",
                name: "Stage2",
                color: "#33CC00"
            }],
            categoryAxis: {
                field: "time",
                majorGridLines: {
                    visible: false
                },
                labels: {step: 5},
                axisCrossingValue: [0, 289],
                justified: true
            }
        });


        //detaTimePicker

        $("#time_series1").kendoDateTimePicker({
            //min: new Date(2017, 6, 0),
            format: "yyyy/MM/dd"
        });
        $("#time_series2").kendoDateTimePicker({
            format: "yyyy/MM/dd"
        });
        $('#cycle_select').kendoDateTimePicker({
            format: "yyyy/MM/dd",
            min: new Date(2017, 6, 0)
        });


        //初始化下拉框
        var selectData = [{text: "default", value: "0"},
            {text: "60min", value: "1"},
            {text: "120min", value: "2"},
            {text: "180min", value: "3"}];
        $('#data-mode-select').kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: selectData,
            index: 0
        });


        Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }


        window.viewModel = kendo.observable({
            linkId_series1: '',
            linkId_series2: '',
            cycleRouteId: null,
            time_series1: new Date(2017, 6, 4),
            time_series2: new Date(2017, 6, 4),
            timeCycleSelect: new Date(2017, 6, 4),
            isFirstChartExist: false,
            isSecondChartExist: false,
            series1: [],
            series2: [],
            backoff: backoff,
            advance: advance,
            seriesCycle: [],
            getCycleChart: getCycleData,
            getChart: getChartData,
            cloesModel: closeChart
        });

        kendo.bind('body', viewModel);

        //加载本地时间
        timer.setTime($('#showTime'));

        //展开/隐藏 菜单栏 初始化信息板
        initWeb.initInterface("menu");

        var map = mapBase.createMap();

        return map;
    }

    function getCycleData() {
        var date = $('#cycle_select').val(),
            id = viewModel.get('cycleRouteId');

        if (!id) {
            return;
        }
        $.ajax({
            url: AppConfig.serverAddress + AppConfig.stageAddress,
            type: "post",
            data: {"stream_id": id, "date": date},
            dataType: "json"
        }).then(function (data) {
            if (data) {
                var i,
                    cycleSeries = [],
                    number = data.stages,
                    cycleData = data.data;

                for (i = 1; i <=number; i++) {
                    cycleSeries.push({
                        field: 'stage' + i,
                        name: 'Stage' + i,
                        color: cycleColors[i-1]
                    });
                }

                var cycleChart = $('#chart-cycle').data('kendoChart');

                cycleChart.setOptions({'series': cycleSeries});

                viewModel.set('seriesCycle', cycleData);
            }
        })
    }

    function getChartData(e) {
        var series = $(e.currentTarget).attr('id').split('_')[1],
            currentLink = viewModel["linkId_" + series],
            isAllDay = $('#checkbox_' + series).is(':checked'),
            time = $('#time_' + series).val();

        kendo.ui.progress($('#chart_' + series), true);

        if (!currentLink || currentLink === '') {
            console.log("当前link_id不存在");
            return;
        }

        $.ajax({
            url: AppConfig.serverAddress + AppConfig.linkMessageAddress,
            type: "post",
            data: {"link_id": currentLink, "date": time, "isAllDay": isAllDay},
            dataType: "json"
        }).then(function (data) {
            kendo.ui.progress($('#chart_' + series), false);

            viewModel.set(series, data);

        });
    }

    function closeChart(e) {
        var series = $(e.currentTarget).attr("id").split('_')[1];

        viewModel.set(series, []);

        if (series === 'series2') {
            viewModel.set('isSecondChartExist', false);
        } else {
            viewModel.set('isFirstChartExist', false);
        }

        $('#container_' + series).css('display', 'none');

    }

    function advance(e) {
        var series = $(e.currentTarget).attr("id").split('_')[1],
            datePre = $('#time_' + series).val(),
            date = new Date(datePre),
            time;

        date.setDate(date.getDate() + 1);

        time = date.Format('yyyy/MM/dd');

        viewModel.set('time_' + series, time);

        getChartData(e);

    }

    function backoff(e) {
        var series = $(e.currentTarget).attr("id").split('_')[1],
            datePre = $('#time_' + series).val(),
            date = new Date(datePre),
            time;

        date.setDate(date.getDate() - 1);

        time = date.Format('yyyy/MM/dd');

        viewModel.set('time_' + series, time);

        getChartData(e);
    }

    return {
        init: initialize
    }
});