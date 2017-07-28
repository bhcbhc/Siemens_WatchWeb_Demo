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

    var allStream = {},
        allPoints = {},
        allMonitor = {},
        allOverLayMaxZoom = {},
        allOverLayMinZoom = {},
        ellipseStyle = mapBase.createFeature().createSvg().getEllipseStyle;

    //添加图层
    var anchorLayer = mapBase.createLayer();
    var largeZoomLayer = mapBase.createLayer();


    map.addLayer(anchorLayer);
    map.addLayer(largeZoomLayer);

    largeZoomLayer.setVisible(false);


    //添加线 异步获取点
    $.ajax({
        url: AppConfig.serverAddress + AppConfig.BDPointsAddress,
        type: "post",
        //data: {"reqAll": false, "link_id": 15260289930},
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

    /*    //添加圆
     var circle = mapBase.createFeature().createCircle([39.98256, 116.46641]);
     anchorLayer.getSource().addFeature(circle);*/


    //添加自定义Feature  箭头
    var getArrayStyle = mapBase.createFeature().getArrowStyle;
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

    anchorLayer.getSource().addFeatures([arrow1, arrow2, arrow3, arrow4]);


    requestAsync.get(AppConfig.serverAddress + AppConfig.allStreamAddress)
        .then(function (data) {
            if (!data) {
                return;
            }

            var markParam = AppConfig.mapConfig.monitorParam;
            var templateMin = kendo.template($('#min_message').html()),
                templateMax = kendo.template($('#max_message').html());

            data.map(function (item) {
                //坐标转换，这里应用AppConfig.js 文件时要讲transformPoint的值改为注释后面值
                var transformPoint = item.coordinate,  //mapChange.bMapToWGS84([item.coordinate])[0], //item.coordinate
                    uid = item["stream_uid"];

                //缓存所有points备用
                allPoints[uid] = transformPoint;

                //largeZoomLayer图层 添加椭圆
                allStream[uid] = mapBase.getFeature(transformPoint);
                allStream[uid].setStyle(ellipseStyle(map));

                // allStream[uid].setId("l_"+uid);
                largeZoomLayer.getSource().addFeature(allStream[uid]);


                //anchorLayer图层 添加信号机
                var monitorParam = $.extend(markParam, {point: transformPoint, id: "m_" + item["stream_uid"]});
                allMonitor[uid] = mapBase.createFeature().createMonitor(map, monitorParam);

                //添加点击事件
                allMonitor[uid].on('click', monitorClick);

                anchorLayer.getSource()
                    .addFeature(allMonitor[uid]);


                //添加 所有overLay
                allOverLayMaxZoom[uid] = new ol.Overlay({
                    offset: [0.5, 0.5],
                    position: mapBase.transformPoint(transformPoint),
                    positioning: "bottom-left"
                });

                allOverLayMinZoom[uid] = new ol.Overlay({
                    // position: mapBase.transformPoint(transformPoint),
                    positioning: "bottom-right"
                });

                map.addOverlay(allOverLayMaxZoom[uid]);
                map.addOverlay(allOverLayMinZoom[uid]);

            });

            window.timer = setInterval(function () {
                requestAsync.get(AppConfig.serverAddress + AppConfig.monitorAddress)
                    .then(function (data) {

                        setArrowStage(data[0].stage);

                        var div = document.createElement('div');

                        data.map(function (item) {
                            var formatedData = formatData(item);
                            var resultMax = templateMax(formatedData);
                            var resultMin = templateMin(formatedData);

                            //div.appendChild(resultMax);


                            allOverLayMaxZoom[item["stream_uid"]].setElement($(resultMax)[0]);
                            allOverLayMinZoom[item["stream_uid"]].setElement($(resultMin)[0]);


                            allStream[item["stream_uid"]].setStyle(ellipseStyle(map, item["length"]));

                        });
                    })
                    .catch(function (error) {
                        console.info(error)
                    });
            }, 3000);

            $('.message-container button').on('click', function () {
                var streamId = $(this).find('span').text();
                alert(streamId);
            });
        })
        .catch(function (err) {
            console.info(err);
        });


    /**
     * 根据信号机状态修改箭头style
     * @param stage
     */
    function setArrowStage(stage) {
        if (stage === 1) {
            arrow1.setStyle(getArrayStyle(175, 0));
            arrow2.setStyle(getArrayStyle(65, 0));
            arrow3.setStyle(getArrayStyle(-15, 1));
            arrow4.setStyle(getArrayStyle(-12, 1));
        } else {
            arrow1.setStyle(getArrayStyle(175, 1));
            arrow2.setStyle(getArrayStyle(65, 1));
            arrow3.setStyle(getArrayStyle(-15, 0));
            arrow4.setStyle(getArrayStyle(-12, 0));
        }
    }


    /**
     * 格式化信号机数据
     * @param data
     * @return {{}}
     */
    function formatData(data) {
        var formatedData = {};

        switch (data.mode) {
            case 2:
                formatedData.mode = "本地";
                break;
            case 3:
                formatedData.mode = "手动";
                break;
            case 4:
                formatedData.mode = "中心控制";
            default:
                formatedData.mode = data.mode;
        }

        if (!data.length) {
            data.length = [];
        }

        if (!data["length_pre"]) {
            data["length_pre"] = [];
        }

        formatedData["moreLength"] = Math.max(data.length.length, data["length_pre"].length);

        return $.extend(data, formatedData);
    }


    function getFeatureId() {
        var id = this.getId();
        if (!viewModel.isFirstChartExist) {
            $('#container_series1').css('display', "block");
            viewModel.set('linkId_series1', id);
            viewModel.set('isFirstChartExist', true);
        } else if (!viewModel.isSecondChartExist) {
            $('#container_series2').css('display', "block");
            viewModel.set('linkId_series2', id);
            viewModel.set('isSecondChartExist', true);
        } else {
            viewModel.set('series1', []);
            viewModel.set('linkId_series1', id);
        }
    }

    function monitorClick() {
        var id = this.getId().split('_')[1];

        viewModel.set('cycleRouteId',id);
        $('#chart-history-cycle').modal('show');
    }


    map.getView().on('change:resolution', function () {
        var zoom = map.getView().getZoom();
        if (zoom < 18) {
            anchorLayer.setVisible(false);
            largeZoomLayer.setVisible(true);

            for (var it in allOverLayMaxZoom) {
                allOverLayMaxZoom[it].setPosition(undefined);
                allOverLayMinZoom[it].setPosition(mapBase.transformPoint(allPoints[it]))
            }
        } else {
            anchorLayer.setVisible(true);
            largeZoomLayer.setVisible(false);

            for (var ite in allOverLayMaxZoom) {
                allOverLayMinZoom[ite].setPosition(undefined);
                allOverLayMaxZoom[ite].setPosition(mapBase.transformPoint(allPoints[ite]))
            }
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

});