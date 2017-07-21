/**
 * Created by Ninghai on 2017/5/19.
 */
define(function () {
    "use strict";

    /**
     * 初始化坐标点
     *从openstreemap获取经度和纬度，将地理坐标系转换为墨卡托坐标
     * @param point ["经度","维度"]
     */
    function transformCoord(point) {
        var coord = [point[1], point[0]];
        return ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857');
    }

    /**
     * 初始化地图
     * @param options:mapConfig
     */
    function createMapImpl() {
        var basicData = AppConfig.mapConfig;
        if (!$('#' + basicData.target).length) {
            console.log("the mapContainer should be an element's ID of Html!");
            return;
        }

        var view = {
            center: ol.proj.transform([basicData.view.center[1], basicData.view.center[0]], 'EPSG:4326', 'EPSG:3857'),//地图中心
            extent: basicData.view.extent,//限制地图中心范围
            zoom: basicData.view.zoom,
            minZoom: basicData.view.minZoom,
            maxZoom: basicData.view.maxZoom
        };

        var map = new ol.Map({
            interactions: ol.interaction.defaults({
                shiftDragZoom: false,
                pinchRotate: false,
                pinchZoom: false
            }),
            layers: basicData.layers,
            view: new ol.View(view),
            logo: basicData.logo,
            target: basicData.target,
        });

        $('#zoom-out').on('click', function () {
            var view = map.getView();
            var zoom = view.getZoom();
            view.setZoom(zoom - 1);
        });
        $('#zoom-in').on('click', function () {
            var view = map.getView();
            var zoom = view.getZoom();
            view.setZoom(zoom + 1);
        });
        return map;
    }

    function createLayerImpl() {
        var layer = new ol.layer.Vector({
            source: new ol.source.Vector()
        });

        return layer
    }

    function getFeatureImpl(coor) {
        var point = transformCoord(coor);
        return new ol.Feature({
            geometry: new ol.geom.Point(point)
        })
    }

    function createFeatureImpl() {
        var lineStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                width: 6,
                color: "blue"
            })
        });
        var circleStyle = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                stroke: new ol.style.Stroke({color: "red", size: 3})
            })
        });

        /**
         * Feature line
         * @param points :[[number1,number2],[]...]
         * @param id:string
         * @return {ol.Feature}
         */
        function createLineImpt(points, id) {
            var transformPoints = [];
            points.map(function (item, index) {
                transformPoints.push(transformCoord(item));
            });

            var linePoint = new ol.Feature({
                geometry: new ol.geom.LineString(transformPoints)
            });

            linePoint.setStyle(lineStyle);

            if (id) {
                linePoint.setId(id);
            }

            return linePoint;
        }

        /**
         *创建文字信息
         * @param mao
         * @param options {point:[],text:"string',style:{font:"",color:"",fill:""},position:[0.5,0.5]}
         * @return {ol.Feature}
         */
        function createTextImpt(options) {
            var point = transformCoord(options.point);
            var text = new ol.Feature({
                geometry: new ol.geom.Point(point)
            });

            text.setStyle(new ol.style.Style({
                text: new ol.style.Text({
                    font: options.style.font ? options.style.font : "10px sans-serif",
                    text: options.text ? options.text : "无标题",
                    fill: new ol.style.Fill({
                        color: options.style.color ? options.style.color : "red"
                    })
                })
            }));

            return text;
        };

        /**
         * Feature
         *  创建标记点，定义随zoom等级变化函数
         * @param map
         * @param options :{url:"",id:"",point:[],position:[0.5,0.5],scale:number}
         * @return {ol.Feature}
         */
        function createMonitorImpt(map, options) {
            var point = transformCoord(options.point);
            var anchor = new ol.Feature({
                geometry: new ol.geom.Point(point),
                name: '监测点' + options.id
            });

            //应用style function,动态的获取样式
            anchor.setStyle(function (resolution) {
                return [new ol.style.Style({
                    image: new ol.style.Icon({
                        src: options.url,
                        scale: map.getView().getZoom() / (options.scale ? options.scale : 20),
                        anchor: options.position ? options.position : [0.5, 0.5]
                    })
                })];
            });

            if (options.id) {
                anchor.setId(options.id);
            }

            return anchor;
        };

        /**
         *Feature
         * @param option:[]
         * @return {ol.Feature}
         */
        function createCircleImpt(option) {
            var point = transformCoord(option);
            var circle = new ol.Feature({
                geometry: new ol.geom.Point(point)
            });
            circle.setStyle(circleStyle);

            return circle;
        };


        /**
         * Canvas
         *创建canvas 红绿箭头
         * @param width:number
         * @param height:number
         * @return {{arrow1: Element, arrow2: Element}}
         */
        function createCanvas(width, height) {
            var canvas1 = document.createElement('canvas'),
                canvas2 = document.createElement('canvas');

            var _width = width ? width : 30;
            var _height = height ? height : 20;

            canvas1.width = _width;
            canvas2.width = _width;
            canvas1.height = _height;
            canvas2.height = _height;

            var context = canvas1.getContext('2d');
            var context2 = canvas2.getContext('2d');

            context.strokeStyle = "red";
            context.fillStyle = "red";
            context.lineWidth = 1;

            context2.strokeStyle = "green";
            context2.fillStyle = "green";
            context2.lineWidth = 1;

            context.beginPath();
            context.moveTo(20, 0);
            context.lineTo(30, 10);
            context.lineTo(20, 20);
            context.lineTo(20, 15);
            context.lineTo(0, 15);
            context.lineTo(0, 5);
            context.lineTo(20, 5);
            context.lineTo(20, 0);

            context.stroke();
            context.fill();

            context2.beginPath();
            context2.moveTo(20, 0);
            context2.lineTo(30, 10);
            context2.lineTo(20, 20);
            context2.lineTo(20, 15);
            context2.lineTo(0, 15);
            context2.lineTo(0, 5);
            context2.lineTo(20, 5);
            context2.lineTo(20, 0);

            context2.stroke();
            context2.fill();

            return {
                redArrow: canvas1,
                greenArrow: canvas2
            }
        }

        var redArrow = createCanvas(30, 20).redArrow;
        var greenArrow = createCanvas(30, 20).greenArrow;

        /**
         * Feature
         * 添加自定义canvas
         * @param option:{point:[],style:{rotation:""},id:""}
         * @return {ol.Feature}
         */
        function createArrowImpt(map, option) {
            var point = transformCoord(option.point);
            var arrow_1Style = new ol.style.Style({
                image: new ol.style.Icon({
                    img: redArrow,
                    imgSize: [redArrow.width, redArrow.height],
                    rotation: option.style.rotation
                })
            });

            /*            var redArrayStyle = function (resolution) {
             return [new ol.style.Style({
             image: new ol.style.Icon({
             img: redArrow,
             imgSize: [redArrow.width, redArrow.height],
             scale: map.getView().getZoom() / (option.scale ? option.scale : 20),
             anchor: option.position ? option.position : [0.5, 0.5],
             rotation: option.style.rotation,
             })
             })];
             };
             var arrow1_style = function (resolution) {
             return [new ol.style.Style({
             image: new ol.style.Icon({
             img: greenArrow,
             imgSize: [greenArrow.width, greenArrow.height],
             scale: map.getView().getZoom() / (option.scale ? option.scale : 20),
             anchor: option.position ? option.position : [0.5, 0.5],
             rotation: option.style.rotation,
             })
             })];
             };*/

            var arrowFeature = new ol.Feature({
                geometry: new ol.geom.Point(point)
            });

            arrowFeature.setStyle(arrow_1Style);

            if (option.id) {
                arrowFeature.setId(option.id);
            }

            return arrowFeature;
        }

        /**
         * Style
         *添加箭头样式
         * @param rotation
         * @param stage 0|1
         * @return  ol.style.Style
         */
        function getArrowStyleImpl(rotation, stage) {
            var style1 = new ol.style.Style({
                image: new ol.style.Icon({
                    img: greenArrow,
                    imgSize: [greenArrow.width, greenArrow.height],
                    rotation: rotation,
                    fill: "green"
                })
            });
            var style2 = new ol.style.Style({
                image: new ol.style.Icon({
                    img: redArrow,
                    imgSize: [redArrow.width, redArrow.height],
                    rotation: rotation,
                    fill: "red"
                })
            });

            if (stage) {
                return style1;
            } else {
                return style2;
            }
        }


        /**
         *
         * @return {{getEllipseStyle: getEllipseStyleFunc}}
         */
        function createSvgImpl() {
            /**
             * @param map
             * @param option
             * @return {Function}
             */
            function getEllipseStyleFunc(map, option) {
                var svg = '<svg xmlns="http://www.w3.org/2000/svg"  id="Layer_1" version="1.1" x="0px" y="0px" width="100px" height="100px" viewBox="0 0 100 100">' +
                    '<ellipse cx="50" cy="50" rx="50" ry="50" style="fill:#28a4c9;opacity:0.8;"/>' +
                    '</svg>';
                var ellipseImg = new Image();
                ellipseImg.src = 'data:image/svg+xml,' + escape(svg);

                return function () {
                    return [new ol.style.Style({
                        image: new ol.style.Icon({
                            img: ellipseImg,
                            offset: [1, -1],
                            imgSize: [100, 100],
                            scale: (map.getView().getZoom()-12) / 5
                        })
                    })];
                }
            }

            function createOtherStyle() {

            }

            return {
                getEllipseStyle: getEllipseStyleFunc
            }

        }

        return {
            createLine: createLineImpt,
            createMonitor: createMonitorImpt,
            createText: createTextImpt,
            createCircle: createCircleImpt,
            createArrow: createArrowImpt,
            getArrowStyle: getArrowStyleImpl,
            createSvg: createSvgImpl
        }
    }


    /**
     * 设置地图范围边界
     * @param point
     */
    function defineSize(point) {
        var longitude = point[1],
            latitude = point[2];

        return [longitude - 2, latitude - 2, longitude + 2, latitude + 2];

    }


    return {
        transformPoint: transformCoord,
        createMap: createMapImpl,
        getFeature: getFeatureImpl,
        createLayer: createLayerImpl,
        createFeature: createFeatureImpl
    }
});