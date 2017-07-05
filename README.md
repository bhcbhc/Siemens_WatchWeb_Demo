# Siemens_WatchWeb_Demo
Siemens Traffic Smart Guard Rrconstruction


#### map事件监听

//无法取消的事件监听
`var key=map.on("events",function(event){
    //可以取消
    map.unByKey(key);
});
map.on(event,function);
map.un(event,function);
map.once("event",function(){  });
`
`
