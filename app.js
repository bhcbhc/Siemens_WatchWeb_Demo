/**
 * Created by Ninghai on 2017/5/18.
 */
require.config({
    paths: {
        //utils
        "initWeb": './src/js/utils/widgetUtil',
        "getTree": './src/js/utils/treeUtil',
        "requestAsync": './src/js/utils/requestAsync',
        'timer': './src/js/utils/localTimer',
        'init': './src/js/core/init',
        'mapBase': './src/js/map/mapBase'
    }

});
require(["init", "requestAsync", 'initWeb'], function (init, requestAsync, initWeb) {
    "use strict";


    var map = init.init();

    //经纬度，图片路径
    /*    var icon = mapBase.addIcon([39.97805, 116.46181], "src/images/siemens/intersections.png");
     map.addLayer(icon);*/


    //test mark
    /*    var pos = ol.proj.fromLonLat([116.46625, 39.98247]);
     var marker = new ol.Overlay({
     position: pos,
     positioning: 'center-center',
     element: document.getElementById('marker'),
     stopEvent: false
     });
     map.addOverlay(marker);*/

    //BMap

    //初始化信息板
    //initWeb.initDashBoard(document.getElementById('leftToolBar'));

    //demo信息板
    var timer1 = setInterval(function () {
        requestAsync.post({
            url: 'http://192.168.0.4:8080/WatchWeb_NEW/Main',
            //url: './monitor.json',
            data: {"id": 1}
        }).then(function (data) {
            if(!data){
                return
            }
            var template = kendo.template($('#db_model').html()),
                result = template(formatData(data));
            $('#monitor1').find('table').remove();
            $('#monitor1').append(result);
        })
    }, 250);

    var timer2 = setInterval(function () {
        requestAsync.post({
            url: 'http://192.168.0.4:8080/WatchWeb_NEW/Main',
            //url: './monitor.json',
            data: {"id": 2}
        }).then(function (data) {
            if(!data){
                return
            }
            var template = kendo.template($('#db_model').html()),
                result = template(formatData(data));
            $('#monitor2').find('table').remove();
            $('#monitor2').append(result);
        })
    }, 250);


    function formatData(data) {
        var formatedData = {};
        for (var item in data) {
            formatedData[item] = data[item];
        }
        switch (data.mode) {
            case 2:
                formatedData.mode = "本地";
                break;
            case 3:
                formatedData.mode = "手动";
                break;
            case 4:
                formatedData.mode = "中心控制";
        }
        if (data.online)
            formatedData.online = "在线";
        } else {
            formatedData.online = "离线";
        }
        return formatedData;
    }

    //test popup
    var popup = new ol.Overlay({
        element: document.getElementById('popup'),
        positioning: 'bottom-center',
        offset: [0, -50]
    });
    map.addOverlay(popup);


    map.on('click', function (evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
            return feature;
        });
        var element = popup.getElement();
        if (feature) {
            var id = parseInt(feature.get('id')),
                name = feature.get('name'),
                coordinates = feature.getGeometry().getCoordinates();
            console.log(id);
            console.log(name);
            popup.setPosition(coordinates);
            requestAsync.post({
                url: "http://192.168.0.4:8080/WatchWeb_NEW/Main",
                // url: './monitor.json',
                data: {"id": id}
            }).then(function (data) {
                //$(element).popover('destroy');
                console.log(element);
                console.info("输出结果%o", data);
                $(element).empty();
                $(element).popover({
                    'placement': 'right',
                    'animation': true,
                    'html': true,
                    'content': '<table class="table table-bordered">' +
                    '<tbody>' +
                    '<tr><td>ID</td><td>' + data.id + '</td><td>模式</td><td>' + data.mode + '</td></tr>' +
                    '<tr><td>在线</td><td>' + data.online + '</td><td>方案</td><td>' + data.plan + '</td></tr>' +
                    '<tr><td>阶段</td><td>' + data.mode + '</td><td>状态</td><td>' + data.state + '</td></tr>' +
                    '<tr><td>时间</td><td colspan="3">' + data.time + '</td></tr>' +
                    '</tbody>' +
                    '</table>'
                });
                $(element).popover('show');
            });
        }
        else {
            $(element).popover('destroy');
        }
    });

    // change mouse cursor when over marker
    map.on('pointermove', function (e) {
        if (e.dragging) {
            $(element).popover('destroy');
            return;
        }
        // var pixel = map.getEventPixel(e.originalEvent);
        // var hit = map.hasFeatureAtPixel(pixel);
        // map.getTarget().style.cursor = hit ? 'pointer' : '';
    });
});