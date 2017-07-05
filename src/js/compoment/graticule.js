/**
 * Created by Ninghai on 2017/6/16.
 */
define(function () {
    "use strict";
    function addGraticuleImpl(map, option, isShowLabels) {
        var graticule = new ol.Graticule({
            strokeStyle: new ol.style.Stroke({
                color: option.color ? option.color : 'rgba(255,120,0,0.9)',
                width: option.width ? option.width : 2,
                lineDash: option.lineDash ? option.lineDash : [0.5, 4]
            }),
            showLabels: isShowLabels
        });

        graticule.setMap(map);
    }

    return {
        addGraticule: addGraticuleImpl
    }
});