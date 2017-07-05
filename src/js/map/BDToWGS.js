/**
 * Created by Ninghai on 2017/6/27.
 */
define(function () {
    'use strict';

    var pi = Math.PI,
        x_pi = pi * 3000.0 / 180.0;

    function BD09_GCJ02(bd_lon, bd_lat) {
        var x = bd_lon - 0.0065,
            y = bd_lat - 0.006085;

        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        var gg_lng = z * Math.cos(theta);
        var gg_lat = z * Math.sin(theta);
        return [gg_lng, gg_lat];
    }

    function GCJ02_WGS84(gcjPoint) {
        var lng = gcjPoint[0],
            lat = gcjPoint[1];

        var aa = 6378245.0,
            ee = 0.00669342162296594323;

        var dlat = transformLat(lng - 105.0, lat - 35.0),
            dlng = transformLng(lng - 105.0, lat - 35.0);

        var radlat = lat / 180.0 * pi;
        var magic = Math.sin(radlat);

        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);

        dlat = (dlat * 180.0) / ((aa * (1 - ee)) / (magic * sqrtmagic) * pi);
        dlng = (dlng * 180.0) / (aa / sqrtmagic * Math.cos(radlat) * pi);

        var mglat = lat + dlat,
            mglng = lng + dlng;

        //返回 [lat,lng]   [经度,维度]
        return [lat * 2 - mglat, lng * 2 - mglng];
    }

    function transformLat(lng, lat) {
        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * pi) + 20.0 * Math.sin(2.0 * lng * pi)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * pi) + 40.0 * Math.sin(lat / 3.0 * pi)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * pi) + 320 * Math.sin(lat * pi / 30.0)) * 2.0 / 3.0;

        return ret;
    }

    function transformLng(lng, lat) {
        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * pi) + 20.0 * Math.sin(2.0 * lng * pi)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * pi) + 40.0 * Math.sin(lng / 3.0 * pi)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * pi) + 300.0 * Math.sin(lng / 30.0 * pi)) * 2.0 / 3.0;

        return ret;
    }


    /**
     * 百度坐标转WGS84 先转换为火星坐标再转换为WGS84
     * @param lineArray  [[lng,lat]]
     * @constructor
     */
    function bmapToWGS84Impl(lineArray) {
        var data = [];

        lineArray.map(function (item) {
            var gcjPoint = BD09_GCJ02(item[1], item[0]);
            var it = GCJ02_WGS84(gcjPoint);
            data.push(it);
        });

        return data;
    }

    return {
        bMapToWGS84: bmapToWGS84Impl
    }
});