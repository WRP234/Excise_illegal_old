import { Button } from "protractor";

/*
Template Name: Material Pro Admin
Author: Themedesigner
Email: niravjoshi87@gmail.com
File: js
*/

declare var $: any;
declare var jQuery: any;

export function detectChange() {
    "use strict";
    $(function () {
        $(".preloader").fadeOut();

        // console.log('navigation.type : ',window.performance.navigation.type)

        // if ($(location).attr('href') && $(location).attr('href').indexOf('investigation/suspect/C/NEW') != -1) {
        //     RemoveSideVBar()
        // }
        // if ($(location).attr('href') && $(location).attr('href').indexOf('/notice/suspect/C/NEW') != -1) {
        //     RemoveSideVBar()
        // }

        // if ($(location).attr('href') && $(location).attr('href').indexOf('/notice/manage/R/') != -1) {
        //     RemoveSideVBar()
        // }

        // if ($(location).attr('href') && $(location).attr('href').indexOf('/lawsuit/manage/R') != -1) {
        //     RemoveSideVBar()
        // }
        // if ($(location).attr('href') && $(location).attr('href').indexOf('/arrest/manage/R') != -1) {
        //     RemoveSideVBar()
        // }

        if ($(location).attr('href') && $(location).attr('href').indexOf('/home') == -1) {
            RemoveSideVBar()
        }
    });
    jQuery(document).on('click', '.mega-dropdown', function (e) {
        e.stopPropagation()
    });

    var RemoveSideVBar = function () {
        window.setTimeout(() => {
            $(".scroll-sidebar, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible");
            $('.navbar-brand span').hide();
            $("body").trigger("resize");
            $("body").addClass("mini-sidebar");
            $(".page-wrapper div").removeClass("Block_onShow_sidebar");
        }, 260);
    }
    // ============================================================== 
    // This is for the top header part and sidebar part
    // ==============================================================  
    var set = function () {
        var width = (window.innerWidth > 0) ? window.innerWidth : this.screen.width;
        var topOffset = 59;
        if (width < 300) { //change value to zero for mini sidebar (old value is width > 1170)
            $("body").addClass("mini-sidebar");

            // console.log('1.1 width < 300')
            // $('.navbar-brand span').hide();
            // $(".scroll-sidebar, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible");
            // $(".sidebartoggler i").addClass("ti-menu");


        }
        else {
            // $("body").removeClass("mini-sidebar"); // Comment for not show sidebar when change window size
            // $('.navbar-brand span').show(); // Comment for not show brand on sidebar
            // console.log('1.2 else width < 300')
        }

        var height = ((window.innerHeight > 0) ? window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset && !$("body").hasClass("mini-sidebar")) { //(old value is  if(height > topOffset))
            $(".page-wrapper").css("min-heiht", (height) + "px");
            $(".page-wrapper").css("margin-left", (61) + "px");
            $(".Block_onShow_sidebar").css("margin-left", 240 + 'px')
            // console.log('++++2.1 height > topOffset')
        } else {
            $('.navbar-brand span').hide();
            $(".page-wrapper div").removeClass("Block_onShow_sidebar");
            $(".scroll-sidebar, .slimScrollDiv").css("overflow", "hidden").parent().css("overflow", "visible");
            // $("body").addClass("mini-sidebar");
            // console.log('++++2.2 else height > topOffset')
        }

    };
    $(window).ready(set);
    $(window).on("resize", set);
    // ============================================================== 
    // Theme options
    // ==============================================================     
    $(".sidebartoggler").on('click', function () {
        if ($("body").hasClass("mini-sidebar")) {
            $("body").trigger("resize"); //if comment will don't resize when click sidebartoggler
            $(".scroll-sidebar, .slimScrollDiv").css("overflow", "hidden").parent().css("overflow", "visible");
            $("body").removeClass("mini-sidebar");
            $("div #block").addClass("Block_onShow_sidebar");
            $("div #startPage").addClass("Startpage-wrapper");//add class for resize start page.
            // $(".btn btn-ghost").css("disabled","disabled");

            //$(".sidebartoggler i").addClass("ti-menu");
            // console.log('3.1 if')
            $('.navbar-brand span').show(); // add for show brand on sidebar (old value is don't have)
            // $(".page-wrapper").css("margin-left", (61) + "px"); // add for Block_onShow on sidebar (old value is don't have)
            $(".Block_onShow_sidebar").css("margin-left", 240 + 'px')// add for Block_onShow on sidebar (old value is don't have)
        }
        else {
            $("body").trigger("resize"); // if comment will don't resize when click sidebartoggler
            $(".scroll-sidebar, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible");
            $("body").addClass("mini-sidebar");
            $(".page-wrapper div").removeClass("Block_onShow_sidebar");
            $('.navbar-brand span').hide();
            $("div #startPage").removeClass("Startpage-wrapper");//add class for resize start page.
            //$(".sidebartoggler i").removeClass("ti-menu");
            // console.log('3.2 else')
        }
    });
    // topbar stickey on scroll

    // create for click close sidebar
    $(".CloseSidebar").on('click', function () {
        window.setTimeout(() => {
            $(".scroll-sidebar, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible");
            $('.navbar-brand span').hide();
            $("body").trigger("resize");
            $("body").addClass("mini-sidebar");
            $(".page-wrapper div").removeClass("Block_onShow_sidebar");
        }, 260);

    });


    // this is for close icon when navigation open in mobile view
    $(".nav-toggler").click(function () {
        $("body").toggleClass("show-sidebar");
        $(".nav-toggler i").toggleClass("ti-menu");
        $(".nav-toggler i").addClass("ti-close");
    });
    $(".sidebartoggler").on('click', function () {
        //$(".sidebartoggler i").toggleClass("ti-menu");
    });
    $(".search-box a, .search-box .app-search .srh-btn").on('click', function () {
        $(".app-search").toggle(200);
    });























    //  // ============================================================== 
    //     // This is for the top header part and sidebar part
    //     // ==============================================================  
    //     var set = function () {
    //         var width = (window.innerWidth > 0) ? window.innerWidth : this.screen.width;
    //         var topOffset = 59;
    //         if (width < 300) { //change value to zero for mini sidebar (old value is width > 1170)
    //             $("body").addClass("mini-sidebar");
    //             $('.navbar-brand span').hide();
    //             $(".scroll-sidebar, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible");
    //             $(".sidebartoggler i").addClass("ti-menu");
    //         }
    //         else {
    //             $("body").removeClass("mini-sidebar");
    //             $('.navbar-brand span').show();
    //             // $("body").addClass("mini-sidebar");//change for mini sidebar (old value is  $("body").removeClass("mini-sidebar");)
    //             // $('.navbar-brand span').hide();//change for mini sidebar (old value is   $('.navbar-brand span').show();)
    //             // $(".scroll-sidebar, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible"); //change for mini sidebar (old value is don't have)
    //             //$(".sidebartoggler i").removeClass("ti-menu");
    //         }

    //         var height = ((window.innerHeight > 0) ? window.innerHeight : this.screen.height) - 1;
    //         height = height - topOffset;
    //         if (height < 1) height = 1;
    //         if (height > topOffset) {
    //             $(".page-wrapper").css("min-height", (0) + "px");
    //         }

    // };
    // $(window).ready(set);
    // $(window).on("resize", set);
    // // ============================================================== 
    // // Theme options
    // // ==============================================================     
    // $(".sidebartoggler").on('click', function () {
    //     if ($("body").hasClass("mini-sidebar")) {
    //         $("body").trigger("resize");
    //         $(".scroll-sidebar, .slimScrollDiv").css("overflow", "hidden").parent().css("overflow", "visible");
    //         $("body").removeClass("mini-sidebar");
    //         $('.navbar-brand span').show();
    //         //$(".sidebartoggler i").addClass("ti-menu");
    //         console.log('if')
    //     }
    //     else {
    //         $("body").trigger("resize");
    //         $(".scroll-sidebar, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible");
    //         $("body").addClass("mini-sidebar");
    //         $('.navbar-brand span').hide();
    //         //$(".sidebartoggler i").removeClass("ti-menu");
    //         console.log('else')
    //     }
    // });
    // // topbar stickey on scroll



    // // this is for close icon when navigation open in mobile view
    // $(".nav-toggler").click(function () {
    //     $("body").toggleClass("show-sidebar");
    //     $(".nav-toggler i").toggleClass("ti-menu");
    //     $(".nav-toggler i").addClass("ti-close");
    // });
    // $(".sidebartoggler").on('click', function () {
    //     //$(".sidebartoggler i").toggleClass("ti-menu");
    // }); 
    // $(".search-box a, .search-box .app-search .srh-btn").on('click', function () {
    //     $(".app-search").toggle(200);
    // });















    // ============================================================== 
    // Right sidebar options
    // ============================================================== 
    $(".right-side-toggle").click(function () {
        $(".right-sidebar").slideDown(50);
        $(".right-sidebar").toggleClass("shw-rside");
    });
    // ============================================================== 
    // Sidebarmenu
    // ============================================================== 
    $(function () {
        $('#sidebarnav').metisMenu({

        });
    });
    // ============================================================== 
    // Auto select left navbar
    // ============================================================== 
    $(function () {
        var url = window.location;
        var element = $('ul#sidebarnav li').filter(function () {
            return this.href == url;
        }).addClass('active').parent().addClass('active');

        while (true) {
            if (element.is('li')) {
                element = element.parent().addClass('in').parent().addClass('active');

            }
            else {
                break;
            }
        }

    });
    $('ul#sidebarnav').on('click', 'li', function () {
        $('ul#sidebarnav li.active').removeClass('active');
        // $(this).addClass('active');
    });
    // ============================================================== 
    //tooltip
    // ============================================================== 
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
    // ============================================================== 
    //Popover
    // ============================================================== 
    $(function () {
        $('[data-toggle="popover"]').popover()
    })

    // ============================================================== 
    // Slimscrollbars
    // ============================================================== 
    $('.scroll-sidebar').slimScroll({
        position: 'left'
        , size: "5px"
        , height: '100%'
        , color: '#dcdcdc'
    });
    $('.message-center').slimScroll({
        position: 'right'
        , size: "5px"

        , color: '#dcdcdc'
    });


    $('.aboutscroll').slimScroll({
        position: 'right'
        , size: "5px"
        , height: '80'
        , color: '#dcdcdc'
    });
    $('.message-scroll').slimScroll({
        position: 'right'
        , size: "5px"
        , height: '570'
        , color: '#dcdcdc'
    });
    $('.chat-box').slimScroll({
        position: 'right'
        , size: "5px"
        , height: '470'
        , color: '#dcdcdc'
    });

    $('.slimscrollright').slimScroll({
        height: '100%'
        , position: 'right'
        , size: "5px"
        , color: '#dcdcdc'
    });

    // ============================================================== 
    // Resize all elements
    // ============================================================== 
    $("body").trigger("resize");
    // ============================================================== 
    // To do list
    // ============================================================== 
    $(".list-task li label").click(function () {
        $(this).toggleClass("task-done");
    });

    // ============================================================== 
    // Login and Recover Password 
    // ============================================================== 
    $('#to-recover').on("click", function () {
        $("#loginform").slideUp();
        $("#recoverform").fadeIn();
    });

    // ============================================================== 
    // Collapsable cards
    // ==============================================================
    $('a[data-action="collapse"]').on('click', function (e) {
        e.preventDefault();
        $(this).closest('.card').find('[data-action="collapse"] i').toggleClass('ti-minus ti-plus');
        $(this).closest('.card').children('.card-body').collapse('toggle');

    });
    // Toggle fullscreen
    $('a[data-action="expand"]').on('click', function (e) {
        e.preventDefault();
        $(this).closest('.card').find('[data-action="expand"] i').toggleClass('mdi-arrow-expand mdi-arrow-compress');
        $(this).closest('.card').toggleClass('card-fullscreen');
    });

    // Close Card
    $('a[data-action="close"]').on('click', function () {
        $(this).closest('.card').removeClass().slideUp('fast');
    });
    // ============================================================== 
    // This is for the sparkline charts which is coming in the bradcrumb section
    // ==============================================================
    $('#monthchart').sparkline([5, 6, 2, 9, 4, 7, 10, 12], {
        type: 'bar',
        height: '35',
        barWidth: '4',
        resize: true,
        barSpacing: '4',
        barColor: '#1e88e5'
    });
    $('#lastmonthchart').sparkline([5, 6, 2, 9, 4, 7, 10, 12], {
        type: 'bar',
        height: '35',
        barWidth: '4',
        resize: true,
        barSpacing: '4',
        barColor: '#7460ee'
    });
    var sparkResize;



};