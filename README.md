# Siemens_WatchWeb_Demo
Siemens Traffic Smart Guard Rrconstruction


#### 用到的库

require.js
jquery
bootstrap
kendo ui
openlayers.js
easyUI

#### 配置文件从AppConfigTest.js 文件修改为AppConfig.js文件时,需修改代码：
```js
//app.js第118行
var transformPoint = item.coordinate,  //mapChange.bMapToWGS84([item.coordinate])[0], //item.coordinate
```
`
