/**
 * Created by Ninghai on 2017/6/16.
 */
+function () {
    "use strict";
    window.AppConfig = {
        ////////////////////////////
        //////数据接口地址配置 /////
        ////////////////////////////

        //  http://192.168.0.4:8080
        serverAddress: "file:///E:/aic-tech/Project/Siemens/Siemens_WatchWeb_Demo/src/allDataTest",

        //百度点坐标数据接口地址
        // WatchWeb_NEW/Main
        BDPointsAddress: "/linkPointsData.json",

        //信号机数据接口地址
        monitorAddress: "/monitor.json",

        //路口数据接口
        streamAddress: "/streamData.json",

        //获取所有路口id和坐标
        allStreamAddress: "/allRoutes.json",

        //link-message接口地址
        linkMessageAddress: "/chartData.json",

        /////////////////////////////
        ///openlayers地图基本配置///
        /////////////////////////////
        mapConfig: {
            target: 'map-container',
            controls: ol.control.defaults({
                attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                })
            }),
            logo: false,
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        url: './src/tiles/Wangjing area/{z}/{x}/{y}.png'
                    })
                })
                /*                new ol.layer.Tile({
                 source: new ol.source.TileDebug({
                 projection: 'EPSG:3857',
                 tileGrid: new ol.source.OSM().getTileGrid()
                 })
                 }) */
            ],
            view: {
                //投影设置 4326等同于WGS84坐标系，3857等同于900913墨卡托投影，openlayer web默认为墨卡托
                //  projection: 'EPSG:4326',
                center: [39.98254, 116.46640],//地图中心
                //  extent: [39.97,116.44,40.01,116.5],//限制地图中心范围
                zoom: 19,//地图默认zoom等级
                minZoom: 13,
                maxZoom: 19
            },
            marks: [
                {
                    url: "src/images/siemens/intersections.png",
                    point: [39.98256, 116.46641],
                    //相对于点的偏移，默认[0.5,0.5]
                    //position:[0.5,0.5],
                    //缩小等级
                    scale: 18,
                    id: 1
                },
                {
                    url: "src/images/siemens/intersections.png",
                    point: [39.98485, 116.46286],
                    id: 2
                }
            ]
        }
    }
}();