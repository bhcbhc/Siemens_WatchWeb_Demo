/**
 * Created by Ninghai on 2017/5/18.
 */
require.config({
    paths: {
        //utils
        "initWeb": './src/js/utils/widgetUtil',
        "getTree": './src/js/utils/treeUtil',
        'mapBase': './src/js/map/mapBase',
        "requestAsync": './src/js/utils/requestAsync'
    }

});
require(["initWeb", "mapBase", "requestAsync", "getTree"], function (initWeb, mapBase, requestAsync, getTree) {
    "use strict";

    //初始化左侧菜单栏
    $('#main-menu').kendoPanelBar({});
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


    //初始化地图
    var basicConf = {
        view: 'map-container',
        //116.4615, 39.97817
        point: [39.97817, 116.4615],
        zoom: 19,
        mark: [
            {
                url: "src/images/siemens/intersections.png",
                point: [39.97817, 116.4615],
                id: "machine1"
            },
            {
                url: "src/images/siemens/intersections.png",
                point: [39.97909, 116.46120],
                id: "machine2"
            }
        ]
    };
    initWeb.initInterface("menu");
    var map = mapBase.initMap(basicConf);

    //经纬度，图片路径
    var icon = mapBase.addIcon([39.97805, 116.46181], "src/images/siemens/intersections.png");
    map.addLayer(icon);



    //test mark
    var pos = ol.proj.fromLonLat([116.46625, 39.98247]);
    var marker = new ol.Overlay({
        position: pos,
        positioning: 'center-center',
        element: document.getElementById('marker'),
        stopEvent: false
    });
    map.addOverlay(marker);

    //BMap


    //test popup
    var popup = new ol.Overlay({
        element: document.getElementById('popup')
    });
    map.addOverlay(popup);

    map.on('click', function (evt) {
        var element = popup.getElement();
        var coordinate = evt.coordinate;
        var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
            coordinate, 'EPSG:3857', 'EPSG:4326'));

        $(element).popover('destroy');
        popup.setPosition(coordinate);
        // the keys are quoted to prevent renaming in ADVANCED mode.

        $('#popup').attr('title', '地理位置:\n' + hdms);

        requestAsync.post({
            url: "http://192.168.0.4:8080/WatchWeb_NEW/Main",
            data: {"id": 1}
        }).then(function (data) {
            console.info("输出结果%o", data);
            //var value = "id:" + data.id + "mode" + data.mode + "time:" + data.time;
            $(element).popover({
                'placement': 'bootom',
                'animation': false,
                'html': true,
                'content': '<p>设备数据测试：</p>' +
                '<table class="table table-bordered">' +
                '<tbody>' +
                '<tr><td>ID</td><td>' + data.id + '</td><td>Mode</td><td>' + data.mode + '</td></tr>' +
                '<tr><td>Online</td><td>' + data.online + '</td><td>Plan</td><td>' + data.plan + '</td></tr>' +
                '<tr><td>Stage</td><td>' + data.mode + '</td><td>State</td><td>' + data.state + '</td></tr>' +
                '</tbody>' +
                '</table>' +
                '<span>最后更新时间：' + data.time + '</span>'
            });
            $(element).popover('show');
        });
    });


});