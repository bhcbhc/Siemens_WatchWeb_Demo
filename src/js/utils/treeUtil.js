/**
 * Created by Ninghai on 2017/5/22.
 * kendo ui  树形结构
 */
define(function () {

    function getTreeImpl(data, rootLevel) {
        var hash = [];
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var id = item["id"];
            var parentId = item["parent"];
            hash[id] = hash[id] || [];
            hash[parentId] = hash[parentId] || [];

            item.items = hash[id];
            hash[parentId].push(item);
        }
        return hash[rootLevel];
    }

    return {
        getTree: getTreeImpl
    }
});