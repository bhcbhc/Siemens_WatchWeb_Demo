/**
 * Created by Ninghai on 2017/5/18.
 */
require.config({
    paths: {
        'initWeb': './js/utils/widgetUtil',
        'getTree': './js/utils/treeUtil',
        'requestAsync': './js/utils/requestAsync',
        'timer': './js/utils/localTimer',

        'mapBase': './js/map/mapBase',
        'mapUtils': './js/map/BDToWGS',

        'ml': './js/core/module/moduleLoad',

        'core': './js/core/core'
    }

});
require(["requestAsync", 'initWeb', 'core', 'mapBase', 'mapUtils'], function (requestAsync, initWeb, core, mapBase, mapChange) {
    "use strict";

    var map = core.init();

    //创建添加图层
    var anchorLayer = mapBase.createLayer();
    var largeZoomLayer = mapBase.createLayer();

    map.addLayer(anchorLayer);
    map.addLayer(largeZoomLayer);

    //添加信号机
    var marks = AppConfig.mapConfig.marks;
    marks.map(function (item) {
        var anchor = mapBase.createFeature().createMonitor(map, item);
        var lagerSign = mapBase.createFeature().createCircle(item.point);

        anchorLayer.getSource()
            .addFeature(anchor);

        largeZoomLayer.getSource().addFeature(lagerSign);

        //anchor.on('click', getFeatureId);
    });

    //添加线
    $.ajax({
        url: AppConfig.serverAddress + AppConfig.BDPointsAddress,
        type: "post",
        data: {"reqAll": false, "link_id": 15260289930},
        dataType: "json"
    })
        .then(function (data) {
            data.map(function (item) {
                var id = item["link_id"];
                var pointArray = [],
                    singlePoint = [];

                for (var i = 1; i <= 8; i++) {
                    singlePoint = [];
                    if (item["link_lat_" + i] && item["link_lng_" + i]) {
                        singlePoint[0] = item["link_lat_" + i];
                        singlePoint[1] = item["link_lng_" + i];
                        pointArray.push(singlePoint);
                    }
                }

                if (pointArray.length > 1) {
                    var changPointsArray = mapChange.bMapToWGS84(pointArray);
                    var line = mapBase.createFeature().createLine(changPointsArray, id);
                    anchorLayer.getSource().addFeature(line);
                    line.on('click', getFeatureId);
                }
            });
        });


    //添加圆
    var circle = mapBase.createFeature().createCircle([39.98256, 116.46641]);
    anchorLayer.getSource().addFeature(circle);

    //添加自定义Feature
    var arrow1 = mapBase.createFeature().createArrow(map, {
        point: [39.98239, 116.46640],
        style: {rotation: 175, scale: 1},
        id: false
    });
    var arrow2 = mapBase.createFeature().createArrow(map, {
        point: [39.98273, 116.46643],
        style: {rotation: 65, scale: 1},
        id: false
    });
    var arrow3 = mapBase.createFeature().createArrow(map, {
        point: [39.98243, 116.46669],
        style: {rotation: -15, scale: 1},
        id: false
    });
    var arrow4 = mapBase.createFeature().createArrow(map, {
        point: [39.98266, 116.46616],
        style: {rotation: -12, scale: 1},
        id: false
    });


    var getArrayStyle = mapBase.createFeature().getArrowStyle;
    var arrow1_start_style = getArrayStyle(-15).greenStyle;
    arrow3.setStyle(arrow1_start_style);


    anchorLayer.getSource().addFeatures([arrow1, arrow2, arrow3, arrow4]);

    //demo信息板
    var timer1 = setInterval(function () {
        requestAsync.post({
            url: AppConfig.serverAddress + AppConfig.monitorAddress,
            data: {"id": 1}
        }).then(function (data) {
            if (!data) {
                return
            }
            var template = kendo.template($('#db_model').html()),
                result = template(formatData(data));
            $('#monitor1').find('table').remove();
            $('#monitor1').append(result);
        })
    }, 5000);

    var timer2 = setInterval(function () {
        requestAsync.post({
            url: AppConfig.serverAddress + AppConfig.monitorAddress,
            data: {"id": 2}
        }).then(function (data) {
            if (!data) {
                return
            }
            var template = kendo.template($('#db_model').html()),
                result = template(formatData(data));
            $('#monitor2').find('table').remove();
            $('#monitor2').append(result);
        })
    }, 5000);

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
        if (data.online) {
            formatedData.online = "在线";
        } else {
            formatedData.online = "离线";
        }
        return formatedData;
    }

    function getFeatureId() {
        console.log("当前id:%s,当前坐标:%o", this.getId(), this.getGeometry().getCoordinates());
        var id = this.getId();
        if (id) {
            viewModel.set('link_id', id);
            $('#chart-Modal').modal('show');
        }
    }


    map.getView().on('change:resolution', function () {
        var zoom = map.getView().getZoom();
        if (zoom < 18) {
            anchorLayer.setVisible(false);
            largeZoomLayer.setVisible(true);
        } else {
            anchorLayer.setVisible(true);
            largeZoomLayer.setVisible(false);
        }
    });

    map.on('click', function (event) {
        map.forEachFeatureAtPixel(event.pixel, function (feature) {
            //dispatch触发对应Feature注册的事件
            feature.dispatchEvent({type: "click", event: 'click'});
        });
    });

    var radius = 0;
    /*    map.on('postcompose',function () {
     radius++;
     radius=radius %20;

     circle.setStyle(new ol.style.Style({
     image:new ol.style.Circle({
     radius:radius,
     stroke:new ol.style.Stroke({
     color:"red",
     size:3
     })
     })
     }))
     });*/

    setTimeout(function () {
        var radius = Math.floor(Math.random() * 10 + 10);
        circle.setStyle(new ol.style.Style({
            image: new ol.style.Circle({
                radius: radius,
                stroke: new ol.style.Stroke({
                    color: "red",
                    size: 3
                })
            })
        }))
    }, 500);

    //获取像素
/*    map.getView().on('change:resolution', function (p1) {
        console.log(map.getView().getZoom());
        if (map.getView().getZoom() <= 17) {
            arrow.hide();
            arrow2.hide();
            arrow3.hide();
            arrow4.hide();
        } else {
            arrow.hide();
        }
    })*/

    /*    map.getView().on("change:center",function (event) {
     console.log("当前中心点%O",map.getView().getCenter());
     })*/
});