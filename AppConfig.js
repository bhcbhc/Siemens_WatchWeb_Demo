/**
 * Created by Ninghai on 2017/6/16.
 */
+function () {
    "use strict";
    window.AppConfig = {
        ////////////////////////////
        /// Server Configuration ///
        ////////////////////////////
        serverAddress: "http://192.168.0.4:8080",
        ServiceRoute: "/WatchWeb_NEW/Main",
        ////////////////////////////

        /////////////////////////////
        ///Map Basic Configuration///
        /////////////////////////////
        mapConfig: {
            target: 'map-container',
            controls: ol.control.defaults({
                attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                })
            }),
            logo: false, //{src:'../test.png',href:'http://www.baidu.com'}
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    })
                })
            ],
            view: {
                //投影设置 4326等同于WGS8坐标系，3857等同于900913墨卡托投影，openlayer web默认为墨卡托
              //  projection: 'EPSG:3857',
                center:[39.98362,116.46628],//地图中心
                extent: [116.44, 39.97, 116.5, 40.01],//限制地图中心范围
                zoom: 19,//地图默认zoom等级
                minZoom: 13,
                maxZoom: 17
            },
            marks: [
                {
                    url: "src/images/siemens/intersections.png",
                    point: [39.98269, 116.46636],
                    id: "1"
                },
                {
                    url: "src/images/siemens/intersections.png",
                    point: [39.98495, 116.46287],
                    id: "2"
                }
            ]
        }
    }
}();