/**
 * Created by Ninghai on 2017/5/18.
 */
define(["requestAsync"], function (requestAsync) {
    "use strict";
    function initInterFaceImpl(menuOptions) {
        initHoverNav();
    }

    /**
     * 初始化右侧信息板
     * @param view HTMLElement
     */
    function initDashBoardImpl(view) {
        var timer;
        $('#leftToolBar ul li').on('click', function () {
            var id = $(this).attr("id");
            if ($(this).hasClass('btn-warning')) {
                return;
            } else {
                $("#leftToolBar ul li").each(function () {
                    $(this).removeClass('btn-warning');
                });
                $(this).removeClass('btn-default').addClass('btn-warning');

                clearInterval(timer);

                var monitorId = parseInt(id.split('_')[1]),
                    template = kendo.template($('#db_model').html());
                timer = setInterval(function () {
                    requestAsync.post({
                        url: 'http://192.168.0.4:8080/WatchWeb_NEW/Main',
                        data: {"id": monitorId}
                    }).then(function (data) {
                        var result = template(data);
                        $(view).find('table').remove();
                        $(view).append(result);
                    })
                }, 1000000);
            }
        });

        $('#leftToolBar ul li:first').trigger('click');
    }

    function initHoverNav() {
        $('#hover-nav').on('click', function () {
            var isHideMenu = $(this).attr('data-state');
            if (isHideMenu === "showed") {
                hideMenu();
            } else {
                showMenu();
            }
        });
        $('#toolBarHover').on('click', function () {
            var isShow = $(this).attr("data-state");
            if (isShow === "showed") {
                hideRightBar();
            } else {
                showRightBar()
            }
        })
    }

    function hideMenu() {
        $('#navigation').css('width', '0%');
        $('#map-container').css({'width': '100%', 'margin-left': '-12px'});
        $('#hover-nav').find('img').attr('src', 'src/images/8_8/arrow_right.png');
        $('#hover-nav').attr('data-state', 'hidden');
        $('#hover-nav').attr('title', '打开菜单栏');
    }

    function showMenu() {
        $('#navigation').css('width', '16%');
        $('#map-container').css({'width': '84%', 'margin-left': '-12px'});
        $('#hover-nav').find('img').attr('src', 'src/images/8_8/arrow_left.png');
        $('#hover-nav').attr('data-state', 'showed');
        $('#hover-nav').attr('title', '隐藏菜单栏');
    }

    function hideRightBar() {
        $('#leftToolBar').css("height", "0");
        $('#leftToolBar').css("visibility", "hidden");
        $('#toolBarHover').find('img').css("transform", "rotate(-90deg)");
        $('#toolBarHover').css('top', '0');
        $('#toolBarHover').attr('title', '展开');
        $('#toolBarHover').attr('data-state', 'hidden');
    }

    function showRightBar() {
        $('#leftToolBar').css("height", "250px");
        $('#leftToolBar').css("visibility", "visible");
        $('#toolBarHover').find('img').css("transform", "rotate(90deg)");
        $('#toolBarHover').css('top', '250px');
        $('#toolBarHover').attr('title', '收起');
        $('#toolBarHover').attr('data-state', 'showed');
    }


    return {
        initInterface: initInterFaceImpl,
        initDashBoard: initDashBoardImpl
    }
});