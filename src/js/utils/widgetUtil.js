/**
 * Created by Ninghai on 2017/5/18.
 */
define(function () {
    "use strict";
    function initInterFaceImpl(menuOptions) {
        initNavImpl();
        initHoverNav();
        initMenu(menuOptions);
    }

    function initNavImpl() {
    }

    function initMenu(options) {
        console.log(options);
    }

    function initHoverNav() {
        $('#hover-nav').on('click', function () {
            var isHideMenu = $(this).attr('data-state');
            if (isHideMenu === "showed") {
                hideMenu();
            } else {
                showMenu();
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


    return {
        initInterface: initInterFaceImpl
    }
});