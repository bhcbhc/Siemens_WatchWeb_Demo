/**
 * Created by Ninghai on 2017/5/18.
 */
define(function () {
    "use strict";

    var contextPath = "";

    var modules = {};
    var instances = {};
    var loadedScripts = {};
    var callbacksWaitingForInstance = [];

    var allModules = [];


    /**
     * 清空模块列表
     */
    function clearAllImpl() {
        modules = null;
        loadedScripts = null;
    }

    /**
     * 确保需要加载的模块已经缓存
     * @param moduleName
     */
    function ensureModuleExist(moduleName) {
        if (modules[moduleName] == undefined) {
            modules[moduleName] = {};
            modules[moduleName].moduleName = moduleName;
            modules[moduleName].viewTemplate = undefined;
            modules[moduleName].instanceConstructor = undefined;
            modules[moduleName].pendingInstantiations = [];

            modules[moduleName].hasInstanceConstructor = function () {
                return modules[moduleName].instanceConstructor != undefined;
            }

            modules[moduleName].hasViewTemplate = function () {
                return modules[moduleName].viewTemplate !== undefined;
            }

            modules[moduleName].canCreateInstance = function () {
                return modules[moduleName].hasInstanceConstructor() && modules[moduleName].hasViewTemplate();
            }
        }
    }


    /**
     * 添加模块的js
     */
    function loadJavascriptImpl(options) {
        var successCallback = options.success || function () {

            };

        if (isJavascriptAlreadyLoaded(options.moduleName)) {
            successCallback();
        } else {
            var newScript = document.createElement("script");
            newScript.src = options.baseUrl;

            var onLoaded = function () {
                setJavascriptAlreadyLoaded(options.baseUrl);
                successCallback();
            };
            if ($.browser.msie) { //for IE
                newScript.onreadystatechange = function () {
                    if (newScript.readyState === "complete"
                        || newScript.readyState === "loaded") {
                        newScript.onreadystatechange = null;
                        onLoaded();
                    }
                };
            } else {
                newScript.onload = onLoaded;
            }

            document.body.appendChild(newScript);
        }
    }

    /**
     * 添加模块的html
     * @param options
     */
    function loadModuleViewTenplate(options) {
        var m = modules[options.moduleName];
        if (!m.hasViewTemplate()) {
            $.ajax({
                url: options.baseUrl + options.moduleName + ".html",
            }).then(function (data) {
                m.viewTemplate = data;
            })
        }
    }

    /**
     * 加载模块的css
     * @param options:{moduleName:string,baseUrl:string,isNoStyle?:boolean,onInstantiated:Funtion}
     */
    function loadModuleViewStyle(options) {
        if (options.isNoStyle) {
            return;
        } else {
            var loadcss = $("<link rel='stylesheet' type='text/css' href='" + options.baseUrl + options.moduleName + ".css' />");
            $("head").append(loadcss);
        }
    }

    /**
     *判断模块的js是否已经加载
     */
    function isJavascriptAlreadyLoaded(moduleName) {
        return loadedScripts[moduleName] !== undefined;
    }

    /**
     * 设置模块的js已经加载成功
     * @param scriptUrl
     */
    function setJavascriptAlreadyLoaded(moduleName) {
        loadedScripts[moduleName] = true;
    }

    return {
        allModule: allModules,
    }
});