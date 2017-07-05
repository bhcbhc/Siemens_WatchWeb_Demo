/**
 * Created by Ninghai on 2017/6/30.
 */
+function () {
    'use strict';

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

    var viewModel = kendo.observable({
        timeSelect:new Date(2017, 6, 30),
        series: []
    });

    kendo.bind('body', viewModel);

    $.getJSON('./chartData.json').then(function (data) {
        viewModel.set('series', data);
    });

}();