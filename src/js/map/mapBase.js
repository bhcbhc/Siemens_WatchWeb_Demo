/**
 * Created by Ninghai on 2017/5/19.
 */
define(function () {
    /**
     *[116.4615, 39.97817]
     * @param options  {view:string,positon:[12.3,4454],zoom?:number,mark:[{id:'',point:'',url:''},{},...]}
     */
    function initMapImpl(options) {
        var map = initLayer1(options);
        return map;
    }

    function initLayer1(options) {
        if (!$('#' + options.view).length) {
            console.log("the mapContainer should be an element's ID of Html!");
            return;
        }

        var zoom = options.zoom ? options.zoom : 19;
        // var extent = defineSize(options.point);

        var map = new ol.Map({
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            target: options.view,
            controls: ol.control.defaults({
                attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                })
            }),
            view: new ol.View({
                //extent: ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857'),
                center: initCoord(options.point),
                zoom: options.zoom
            })
        });

        //添加默认标记
        if (options.mark) {
            var marks = options.mark;
            for (var i = 0, len = marks.length; i < len; i++) {
                var mark = marks[i];
                var perMarl = addIconImpl(mark.point, mark.url, mark.id);
                map.addLayer(perMarl);
            }
        }


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

    /**
     *添加图层标注
     * @param coord 坐标点
     * @param url 标记图片地址
     * @param id  标记对应id
     * @return {ol.layer.Vector}
     */
    function addIconImpl(coord, url, id) {
        var point = initCoord(coord);
        var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(point),
            id:id,
            name: '监测点' + id,
        });

        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */
                ({
                    anchor: [0.5, 1],//位置
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: url
                }))
        });
        //iconStyle.getImage().setScale(0.3);
        iconFeature.setStyle(iconStyle);

        var vectorSource = new ol.source.Vector({
            features: [iconFeature]
        });

        var vectorLayer = new ol.layer.Vector({
            source: vectorSource
        });

        return vectorLayer;
    }


    /**
     * 初始化坐标点
     *从openstreemap获取经度和纬度，将地理坐标系转换为墨卡托坐标
     * @param point ["经度","维度"]
     */
    function initCoord(point) {
        var coord = [point[1], point[0]];
        return ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857');
        //ol.proj.fromLonLat([116.28,39.54]);

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
        initMap: initMapImpl,
        addIcon: addIconImpl
    }
});