/**
 * Mat Marquis' Carousel
 * http://matmarquis.com/carousel/
 */
$(document).ready(function(){
    function slider(){
        $.fn.carousel = function(config) {
            var defaults = {
                    slider: '.slider',
                    slide: '.slide',
                    prevSlide: '.prev',
                    nextSlide: '.next',
                    counter: '.counter',
                    counterText: 'Slide {current} of {total}',
                    secondary: '.secondary',
                    speed: 500
                },
                $wrapper = $(this),
                opt = $.extend(defaults, config);

            carousel = {
                roundDown : function(leftmargin) {
                    var leftmargin = parseInt(leftmargin, 10);

                    return Math.ceil( (leftmargin - (leftmargin % 100 ) ) / 100) * 100;
                },
                transitionSupport : function() {
                    var dStyle = document.body.style;

                    return dStyle.webkitTransition !== undefined ||
                        dStyle.mozTransition !== undefined ||
                        dStyle.msTransition !== undefined ||
                        dStyle.oTransition !== undefined ||
                        dStyle.transition !== undefined;
                },
                currentPage : function($slider, leftmargin) {
                    var current = -(leftmargin / 100),
                        $slides = $slider.find(".slide"),
                        $primaryslides = $slider.not('[id*=secondary]').find(".slide"),
                        $pagination = $slider.parent().find('.carousel-tabs'),
                        label = opt.counterText;

                    $slides.removeClass("sl-active");
                    $($slides[current]).addClass("sl-active");
                    if($pagination) {

                        var $container = $slider.parent(),
                            $counterHeading = $container.find(opt.counter);

                        if ($counterHeading) {
                            var label = opt.counterText;
                            label = label.replace("{current}", (current + 1));
                            label = label.replace("{total}", $primaryslides.length);
                            $counterHeading.text(label);
                        }

                        $pagination.find('li:nth-child(' + (current + 1 ) + ')')
                            .addClass('current')
                            .siblings()
                            .removeClass('current');
                    }
                },
                /* Adjustment to work around browser rounding errors */
                tweak : function($slider) {
                    $slider.each(function() {
                        var $slider = $(this),
                            $container = $slider.parent(),
                            $current = $slider.find(".sl-active");

                        $current.each(function() {
                            var $slide = $(this),
                                diff = $container.width() - $slide.width(),
                                $slides = $slider.find(".slide"),
                                iMax = $slides.length;

                            //if (diff != 0) {
                            //  for (var i = 0; i < iMax; i++) {
                            //      $($slides[i]).css("left", (diff * i) + "px");
                            //  }
                            //} else {
                            $slides.css("left", 0);
                            //}
                        });
                    });
                },
                move : function($slider, moveTo) {
                    if( !$slider ) {
                        return;
                    }
                    if( carousel.transitionSupport() ) {
                        $slider.css('marginLeft', moveTo + "%");
                    } else {
                        $slider.animate({ marginLeft: moveTo + "%" }, opt.speed);
                    }
                    carousel.currentPage($slider, moveTo);
                    carousel.tweak($slider);
                }
            };

            var nextPrev = function($slider, dir, $secondary) {
                    var leftmargin = ( $slider.attr('style') ) ? $slider.attr('style').match(/margin\-left:(.*[0-9])/i) && parseInt(RegExp.$1) : 0,
                        $primaryslider = $slider.not('[id*="secondary"]'),
                        $slide = $primaryslider.find(opt.slide),
                        constrain = dir === 'prev' ? leftmargin != 0 : -leftmargin < ($slide.length - 1) * 100,
                        $target = $( '[href*="#' + $primaryslider.attr('id') + '"]');

                    if (!$slider.is(":animated") && constrain ) {

                        if ( dir === 'prev' ) {
                            leftmargin = ( leftmargin % 100 != 0 ) ? carousel.roundDown(leftmargin) : leftmargin + 100;
                        } else {
                            leftmargin = ( ( leftmargin % 100 ) != 0 ) ? carousel.roundDown(leftmargin) - 100 : leftmargin - 100;
                        }

                        carousel.move($slider, leftmargin);
                        carousel.move($secondary, leftmargin);

                        $target.removeClass('disabled');

                        switch( leftmargin ) {
                            case ( -($slide.length - 1) * 100 ):
                                $target.filter(opt.nextSlide).addClass('disabled');
                                break;
                            case 0:
                                $target.filter(opt.prevSlide).addClass('disabled');
                                break;
                        }
                    } else {
                        var reset = carousel.roundDown(leftmargin);

                        carousel.move($slider, reset);
                        if( $secondary !== null ) {
                            carousel.move($secondary, reset);
                        }
                    }
                },
                nextPrevSetup = function(e) {
                    var $el = $(e.target).closest(opt.prevSlide + ',' + opt.nextSlide),
                        link = this.hash,
                        dir = ( $el.is(opt.prevSlide) ) ? 'prev' : 'next',
                        $slider = $( opt.slider ).filter(link),
                        $secondary = ($(opt.slider).filter(link + '-secondary').length) ? $(opt.slider).filter(link + '-secondary') : null;

                    if ( $el.is('.disabled') ) {
                        return false;
                    }

                    nextPrev($slider, dir, $secondary);

                    e.preventDefault();
                };

            $wrapper.parent().find(opt.nextSlide + ',' + opt.prevSlide)
                .bind('click', nextPrevSetup);

            $(opt.prevSlide).addClass('disabled');


            $('.carousel-tabs').find('a').click(function(e) {
                var $el = $(this),
                    current = parseInt(this.hash.match(/\-slide(.*[0-9])/i) && RegExp.$1, 10),
                    move = (100 * (current - 1)),
                    $contain = $el.closest('.slidewrap'),
                    $prev = $contain.find(opt.prevSlide),
                    $next = $contain.find(opt.nextSlide),
                    $target = $contain.find(opt.slider);

                $el.parent()
                    .addClass('current')
                    .siblings()
                    .removeClass('current');

                carousel.move($target, -move);

                if(move == 0) {
                    $prev.addClass('disabled');
                } else {
                    $prev.removeClass('disabled');
                }

                if($el.parent().is(':last-child')) {
                    $next.addClass('disabled');
                } else {
                    $next.removeClass('disabled');
                }

                e.preventDefault();
            });
            var setup = {
                wrap : this,
                slider : opt.slider
            };
            //swipes trigger move left/right
            $wrapper.parent().bind( "dragSnap", setup, function(e, ui){
                var $slider = $(this).find( opt.slider ),
                    dir = ( ui.direction === "left" ) ? 'next' : 'prev';
                nextPrev($slider, dir);
            });

            return this.each(function() {
                var $wrap = $(this),
                    secId;

                if(opt.secondary) {
                    var $target = $wrap.find(opt.secondary);

                    if($target.length > 1) {
                        var secId = $wrap.find('.slider').attr('id') + '-secondary',
                            $secWrap = $('<div class="secslidewrap" />'),
                            $secSlider = $('<div class="secslider" />'),
                            $secList = $('<ul class="slider" id="' + secId + '" />');
                        $wrap.prepend($secWrap.append($secSlider.append($secList)));

                        $target.each(function() {
                            $('<li class="slide" />')
                                .append($(this))
                                .appendTo($secList);
                        });
                    }
                }

                var $slider = $wrap.find(opt.slider),
                    $slide = $wrap.find(opt.slide),
                    slidenum = $slide.length,
                    speed = opt.speed / 1000;

                $slider.css({
                    width: 100 * slidenum + "%"
                });

                $slide.css({
                    width: (100 / slidenum) + "%"
                });

                carousel.currentPage($slider, 0);

                carousel.tweak( (secId ) ? $slider.not('#' + secId) : $slider);
                $wrapper.show();

            });
        };

        $.fn.getPercentage = function() {
            var oPercent = this.attr('style').match(/margin\-left:(.*[0-9])/i) && parseInt(RegExp.$1);

            return oPercent;
        };

        $.event.special.dragSnap = {
            setup: function(setup) {

                var $el = $(this),
                    transitionSwap = function($el, tog) {
                        var speed = .3,
                            transition = ( tog ) ? "margin-left " + speed + "s ease" : 'none';

                        $el.css({
                            "-webkit-transition" : transition,
                            "-moz-transition"    : transition,
                            "-ms-transition"     : transition,
                            "-o-transition"      : transition,
                            "transition"         : transition
                        });
                    },
                    roundDown = function(left) {
                        var left = parseInt(left, 10);

                        return Math.ceil( (left - (left % 100 ) ) / 100) * 100;
                    },
                    snapBack = function(e, ui) {
                        var $el = ui.target,
                            currentPos = ( $el.attr('style') != undefined ) ? $el.getPercentage() : 0,
                            left = (ui.left === false) ? roundDown(currentPos) - 100 : roundDown(currentPos),
                            dStyle = document.body.style,
                            transitionSupport = dStyle.webkitTransition !== undefined ||
                                dStyle.mozTransition !== undefined ||
                                dStyle.msTransition !== undefined ||
                                dStyle.oTransition !== undefined ||
                                dStyle.transition !== undefined;

                        transitionSwap($el, true);

                        if( transitionSupport ) {
                            $el.css('marginLeft', left + "%");
                        } else {
                            $el.animate({ marginLeft: left + "%" }, opt.speed);
                        }
                    };

                $el
                    .bind("snapback", snapBack)
                    .bind("touchstart", function(e) {
                        var data = e.originalEvent.touches ? e.originalEvent.touches[0] : e,
                            start = {
                                time: (new Date).getTime(),
                                coords: [ data.pageX, data.pageY ],
                                origin: $(e.target).closest( setup.wrap )
                            },
                            stop,
                            $tEl = $(e.target).closest( setup.slider ),
                            currentPos = ( $tEl.attr('style') != undefined ) ? $tEl.getPercentage() : 0;

                        transitionSwap($tEl, false);

                        function moveHandler(e) {
                            var data = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
                            stop = {
                                time: (new Date).getTime(),
                                coords: [ data.pageX, data.pageY ]
                            };

                            if(!start || Math.abs(start.coords[0] - stop.coords[0]) < Math.abs(start.coords[1] - stop.coords[1]) ) {
                                return;
                            }

                            $tEl.css({"margin-left": currentPos + ( ( (stop.coords[0] - start.coords[0]) / start.origin.width() ) * 100 ) + '%' });

                            // prevent scrolling
                            if (Math.abs(start.coords[0] - stop.coords[0]) > 10) {
                                e.preventDefault();
                            }

                        };

                        $el
                            .bind("gesturestart", function(e) {
                                $el
                                    .unbind("touchmove", moveHandler)
                                    .unbind("touchend", moveHandler);
                            })
                            .bind("touchmove", moveHandler)
                            .one("touchend", function(e) {

                                $el.unbind("touchmove", moveHandler);

                                transitionSwap($tEl, true);

                                if (start && stop ) {

                                    if (Math.abs(start.coords[0] - stop.coords[0]) > 10
                                        && Math.abs(start.coords[0] - stop.coords[0]) > Math.abs(start.coords[1] - stop.coords[1])) {
                                        e.preventDefault();
                                    } else {
                                        $el.trigger('snapback', { target: $tEl, left: true });
                                        return;
                                    }

                                    if (Math.abs(start.coords[0] - stop.coords[0]) > 1 && Math.abs(start.coords[1] - stop.coords[1]) < 75) {
                                        var left = start.coords[0] > stop.coords[0];

                                        if( -( stop.coords[0] - start.coords[0]) > ( start.origin.width() / 4 ) || ( stop.coords[0] - start.coords[0]) > ( start.origin.width() / 4 ) ) {

                                            start.origin.trigger("dragSnap", {direction: left ? "left" : "right"});

                                        } else {
                                            $el.trigger('snapback', { target: $tEl, left: left });
                                        }

                                    }
                                }
                                start = stop = undefined;
                            });
                    });
            }
        };
        // Homepage carousel
        var curate = function() {
            $(".inside .content").each(function() {
                var $oEl = $(this),
                    sHtml = '<div class="slide"></div>';
//                if($(this).hasClass('custom')) {
//                    if ($(window).width() >= 768 && $(window).width() < 979){
//                        var perSlide = 2;
//
//                    }
//                    else if ($(window).width() < 768) {
//                        var perSlide = 1;
//
//                    }
//                    else {
//                        var perSlide = 3;
//
//                    }
//
//                }
                if($(this).hasClass('column-right')){
                    var perSlide = 2;
                }
                else {
                    if($(window).width() < 768){
                        var perSlide = 2;
                    }
                    else {
                        var perSlide = 4;
                    }
                }
                //            if ($(window).width() >= 768 && $(window).width() < 979){
                //                var perSlide = 2;
                //            }
                //            else if ($(window).width() < 768) {
                //                var perSlide = 1;
                //            }
                //            else {
                //                var perSlide = 3;
                //            }
                while ($oEl.children(".feat-thumb").length > 0) {
                    $oEl.children(".feat-thumb").slice(0, perSlide).wrapAll(sHtml);
                }

                $oEl.children(".slide").each(function() {
                    var tmp = 0,
                        $slide = $(this);
                    if(perSlide == 3) {
                        $slide.children(".feat-thumb").each(function() {
                            var suffix = (tmp % 3 == 1) ? "center" : "normal";
                            $(this).addClass("feat-" + suffix);

                            tmp++;
                        });
                    }

                    else {
                        $slide.children(".feat-thumb").each(function() {
                            var suffix = (tmp % 2 == 0) ? "odd" : "even";
                            $(this).addClass("feat-" + suffix);

                            tmp++;
                        });
                    }

                    $slide.find(".feat-thumb:last-child").addClass("last-feat");
                });

            });
        };


        // Drop in markup for slide carousel
        var bg_slides = function() {
            $("[data-carousel]").not( ".slidewrap" ).each(function() {
                var $oEl = $(this),
                    type = $oEl.attr('data-carousel'),
                    $oSlides = $oEl.find(".slide"),
                    tmp = Math.random().toString().slice(2, 12),
                    sId = "carousel-" + tmp,
                    sPrev = '<a class="prev" href="#' + sId + '"><i>Previous</i></a>',
                    sNext = '<a class="next" href="#' + sId + '"><i>Next</i></a>',
                    sTabHed = '<h2 class="carousel-tabs-head">View Slide</h2>',
                    sTabCount = 'Slide {current} of {total}',
                    sHTMLnav = [
                        '<ul class="nav">',
                        '   <li>' + sPrev + '</li>',
                        '   <li>' + sNext + '</li>',
                        '</ul>'
                    ].join('');

                if ($oSlides.length > 1 ) {
                    // Insert previous/next arrows into the magazine preview slides


                    $oEl
                        .addClass("slidewrap")
                        .attr("tabindex", 0)
                        .wrapInner('<div id="' + sId + '" class="slider"></div>')
                        .before(sHTMLnav);

                } else {
                    $oEl
                        .removeAttr("data-carousel")
                        .addClass('slidewrap');
                }

                // Trigger carousel(s)
                $(this)
                    .carousel({
                        slide: '.slide',
                        slider: '.slider',
                        nextSlide: '.next',
                        prevSlide: '.prev',
                        speed: 500 // ms.
                    });


            });
        }

        //init existing carousels on page
        curate();
        bg_slides();
    }
    function slider3Column(){
        $.fn.carousel = function(config) {
            var defaults = {
                    slider: '.slider',
                    slide: '.slide',
                    prevSlide: '.prev',
                    nextSlide: '.next',
                    speed: 500
                },
                $wrapper = $(this),
                opt = $.extend(defaults, config);

            carousel = {
                roundDown : function(leftmargin) {
                    var leftmargin = parseInt(leftmargin, 10);

                    return Math.ceil( (leftmargin - (leftmargin % 100 ) ) / 100) * 100;
                },
                transitionSupport : function() {
                    var dStyle = document.body.style;

                    return dStyle.webkitTransition !== undefined ||
                        dStyle.mozTransition !== undefined ||
                        dStyle.msTransition !== undefined ||
                        dStyle.oTransition !== undefined ||
                        dStyle.transition !== undefined;
                },
                currentPage : function($slider, leftmargin) {
                    var current = -(leftmargin / 100),
                        $slides = $slider.find(".slide"),
                        $primaryslides = $slider.not('[id*=secondary]').find(".slide"),
                        label = opt.counterText;

                    $slides.removeClass("sl-active");
                    $($slides[current]).addClass("sl-active");

                    carousel.setCurPagination($slider,current);
                },

                setCurPagination : function($slider,num) {
                    $current = $slider.find(".sl-active");
                    //console.log($current);
                    $curPagination = $('.inside .pagination li');
                    $curPagination.find('a').removeClass("pa-active");
                    $($curPagination[num]).find('a').addClass("pa-active");
                    $curPagination.each(function(){
                        $(this).click(function(e){
                            e.preventDefault();
                            var current = $('.inside .pagination li').index(this),
                                move = -(100 * current);
                            $slider = $('.slidewrap').find( opt.slider );
                            carousel.move($slider,move);
                        });

                    });

                },

                /* Adjustment to work around browser rounding errors */
                tweak : function($slider) {
                    $slider.each(function() {
                        var $slider = $(this),
                            $container = $slider.parent(),
                            $current = $slider.find(".sl-active");

                        $current.each(function() {
                            var $slide = $(this),
                                diff = $container.width() - $slide.width(),
                                $slides = $slider.find(".slide"),
                                iMax = $slides.length;

                            //if (diff != 0) {
                            //  for (var i = 0; i < iMax; i++) {
                            //      $($slides[i]).css("left", (diff * i) + "px");
                            //  }
                            //} else {
                            $slides.css("left", 0);
                            //}
                        });
                    });
                },
                move : function($slider, moveTo) {
                    if( !$slider ) {
                        return;
                    }
                    if( carousel.transitionSupport() ) {
                        $slider.css('marginLeft', moveTo + "%");
                    } else {
                        $slider.animate({ marginLeft: moveTo + "%" }, opt.speed);
                    }
                    carousel.currentPage($slider, moveTo);
                    carousel.tweak($slider);
                }
            };

            var slideWithPagination = function($slider, dir) {
                var leftmargin = ( $slider.attr('style') ) ? $slider.attr('style').match(/margin\-left:(.*[0-9])/i) && parseInt(RegExp.$1) : 0,
                    $primaryslider = $slider.not('[id*="secondary"]'),
                    $slide = $primaryslider.find(opt.slide),
                    constrain = dir === 'prev' ? leftmargin != 0 : -leftmargin < ($slide.length - 1) * 100,
                    $target = $( '[href*="#' + $primaryslider.attr('id') + '"]');

                if (!$slider.is(":animated") && constrain ) {

                    if ( dir === 'prev' ) {
                        leftmargin = ( leftmargin % 100 != 0 ) ? carousel.roundDown(leftmargin) : leftmargin + 100;
                    } else {
                        leftmargin = ( ( leftmargin % 100 ) != 0 ) ? carousel.roundDown(leftmargin) - 100 : leftmargin - 100;
                    }

                    carousel.move($slider, leftmargin);
                    //carousel.move($secondary, leftmargin);

                    $target.removeClass('disabled');

                    switch( leftmargin ) {
                        case ( -($slide.length - 1) * 100 ):
                            $target.filter(opt.nextSlide).addClass('disabled');
                            break;
                        case 0:
                            $target.filter(opt.prevSlide).addClass('disabled');
                            break;
                    }
                } else {
                    var reset = carousel.roundDown(leftmargin);

                    carousel.move($slider, reset);
                }
            };

            var nextPrev = function($slider, dir){
                    var leftmargin = ( $slider.attr('style') ) ? $slider.attr('style').match(/margin\-left:(.*[0-9])/i) && parseInt(RegExp.$1) : 0,
                        $primaryslider = $slider.not('[id*="secondary"]'),
                        $slide = $primaryslider.find(opt.slide),
                        constrain = dir === 'prev' ? leftmargin != 0 : -leftmargin < ($slide.length - 1) * 100,
                        $target = $( '[href*="#' + $primaryslider.attr('id') + '"]');

                    if (!$slider.is(":animated") && constrain ) {

                        if ( dir === 'prev' ) {
                            leftmargin = ( leftmargin % 100 != 0 ) ? carousel.roundDown(leftmargin) : leftmargin + 100;
                        } else {
                            leftmargin = ( ( leftmargin % 100 ) != 0 ) ? carousel.roundDown(leftmargin) - 100 : leftmargin - 100;
                        }



                        carousel.move($slider, leftmargin);

                        $target.removeClass('disabled');

                        switch( leftmargin ) {
                            case ( -($slide.length - 1) * 100 ):
                                $target.filter(opt.nextSlide).addClass('disabled');
                                break;
                            case 0:
                                $target.filter(opt.prevSlide).addClass('disabled');
                                break;
                        }
                    } else {
                        var reset = carousel.roundDown(leftmargin);

                        carousel.move($slider, reset);
                    }
                },
                nextPrevSetup = function(e) {
                    console.log(e);
                    var $el = $(e.target).closest(opt.prevSlide + ',' + opt.nextSlide),
                        link = this.hash,
                        dir = ( $el.is(opt.prevSlide) ) ? 'prev' : 'next',
                        $slider = $( opt.slider ).filter(link);
                    console.log(link);
                    if ( $el.is('.disabled') ) {
                        return false;
                    }

                    nextPrev($slider, dir);

                    e.preventDefault();
                };

            $wrapper.parent().find(opt.nextSlide + ',' + opt.prevSlide)
                .bind('click', nextPrevSetup);

            $(opt.prevSlide).addClass('disabled');



            var setup = {
                wrap : this,
                slider : opt.slider
            };
            //swipes trigger move left/right
            $wrapper.parent().bind( "dragSnap", setup, function(e, ui){
                var $slider = $(this).find( opt.slider ),
                    dir = ( ui.direction === "left" ) ? 'next' : 'prev';
                nextPrev($slider, dir);
            });

            return this.each(function() {
                var $wrap = $(this),
                    secId;


                var $slider = $wrap.find(opt.slider),
                    $slide = $wrap.find(opt.slide),
                    slidenum = $slide.length,
                    speed = opt.speed / 1000;

                $slider.css({
                    width: 100 * slidenum + "%"
                });

                $slide.css({
                    width: (100 / slidenum) + "%"
                });

                carousel.currentPage($slider, 0);

                carousel.tweak( (secId ) ? $slider.not('#' + secId) : $slider);
                $wrapper.show();

            });
        };

        $.fn.getPercentage = function() {
            var oPercent = this.attr('style').match(/margin\-left:(.*[0-9])/i) && parseInt(RegExp.$1);

            return oPercent;
        };

        $.event.special.dragSnap = {
            setup: function(setup) {

                var $el = $(this),
                    transitionSwap = function($el, tog) {
                        var speed = .3,
                            transition = ( tog ) ? "margin-left " + speed + "s ease" : 'none';

                        $el.css({
                            "-webkit-transition" : transition,
                            "-moz-transition"    : transition,
                            "-ms-transition"     : transition,
                            "-o-transition"      : transition,
                            "transition"         : transition
                        });
                    },
                    roundDown = function(left) {
                        var left = parseInt(left, 10);

                        return Math.ceil( (left - (left % 100 ) ) / 100) * 100;
                    },
                    snapBack = function(e, ui) {
                        var $el = ui.target,
                            currentPos = ( $el.attr('style') != undefined ) ? $el.getPercentage() : 0,
                            left = (ui.left === false) ? roundDown(currentPos) - 100 : roundDown(currentPos),
                            dStyle = document.body.style,
                            transitionSupport = dStyle.webkitTransition !== undefined ||
                                dStyle.mozTransition !== undefined ||
                                dStyle.msTransition !== undefined ||
                                dStyle.oTransition !== undefined ||
                                dStyle.transition !== undefined;

                        transitionSwap($el, true);

                        if( transitionSupport ) {
                            $el.css('marginLeft', left + "%");
                        } else {
                            $el.animate({ marginLeft: left + "%" }, opt.speed);
                        }
                    };

                $el
                    .bind("snapback", snapBack)
                    .bind("touchstart", function(e) {
                        var data = e.originalEvent.touches ? e.originalEvent.touches[0] : e,
                            start = {
                                time: (new Date).getTime(),
                                coords: [ data.pageX, data.pageY ],
                                origin: $(e.target).closest( setup.wrap )
                            },
                            stop,
                            $tEl = $(e.target).closest( setup.slider ),
                            currentPos = ( $tEl.attr('style') != undefined ) ? $tEl.getPercentage() : 0;

                        transitionSwap($tEl, false);

                        function moveHandler(e) {
                            var data = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
                            stop = {
                                time: (new Date).getTime(),
                                coords: [ data.pageX, data.pageY ]
                            };

                            if(!start || Math.abs(start.coords[0] - stop.coords[0]) < Math.abs(start.coords[1] - stop.coords[1]) ) {
                                return;
                            }

                            $tEl.css({"margin-left": currentPos + ( ( (stop.coords[0] - start.coords[0]) / start.origin.width() ) * 100 ) + '%' });

                            // prevent scrolling
                            if (Math.abs(start.coords[0] - stop.coords[0]) > 10) {
                                e.preventDefault();
                            }

                        };

                        $el
                            .bind("gesturestart", function(e) {
                                $el
                                    .unbind("touchmove", moveHandler)
                                    .unbind("touchend", moveHandler);
                            })
                            .bind("touchmove", moveHandler)
                            .one("touchend", function(e) {

                                $el.unbind("touchmove", moveHandler);

                                transitionSwap($tEl, true);

                                if (start && stop ) {

                                    if (Math.abs(start.coords[0] - stop.coords[0]) > 10
                                        && Math.abs(start.coords[0] - stop.coords[0]) > Math.abs(start.coords[1] - stop.coords[1])) {
                                        e.preventDefault();
                                    } else {
                                        $el.trigger('snapback', { target: $tEl, left: true });
                                        return;
                                    }

                                    if (Math.abs(start.coords[0] - stop.coords[0]) > 1 && Math.abs(start.coords[1] - stop.coords[1]) < 75) {
                                        var left = start.coords[0] > stop.coords[0];

                                        if( -( stop.coords[0] - start.coords[0]) > ( start.origin.width() / 4 ) || ( stop.coords[0] - start.coords[0]) > ( start.origin.width() / 4 ) ) {

                                            start.origin.trigger("dragSnap", {direction: left ? "left" : "right"});

                                        } else {
                                            $el.trigger('snapback', { target: $tEl, left: left });
                                        }

                                    }
                                }
                                start = stop = undefined;
                            });
                    });
            }
        };

        var addPagination = function(number) {
            var $pagination = $('.inside .pagination');
            for (var i = 1; i <= number; i++){
                $pagination.append("<li><a href>"+i+"</a></li>");

            }
        };

        // Homepage carousel
        var curate = function() {
            $(".inside .content").each(function() {
                var $oEl = $(this),
                    sHtml = '<div class="slide"></div>';
                if($(this).hasClass('custom')) {
                    if ($(window).width() >= 768 && $(window).width() < 979){
                        var perSlide = 2;

                    }
                    else if ($(window).width() < 768) {
                        var perSlide = 1;

                    }
                    else {
                        var perSlide = 3;

                    }

                }
                while ($oEl.children(".feat-thumb").length > 0) {
                    $oEl.children(".feat-thumb").slice(0, perSlide).wrapAll(sHtml);
                }

                addPagination($('.slide').length);



                $oEl.children(".slide").each(function() {
                    var tmp = 0,
                        $slide = $(this);
                    if(perSlide == 3) {
                        $slide.children(".feat-thumb").each(function() {
                            var suffix = (tmp % 3 == 1) ? "center" : "normal";
                            $(this).addClass("feat-" + suffix);

                            tmp++;
                        });
                    }

                    else {
                        $slide.children(".feat-thumb").each(function() {
                            var suffix = (tmp % 2 == 0) ? "odd" : "even";
                            $(this).addClass("feat-" + suffix);

                            tmp++;
                        });
                    }

                    $slide.find(".feat-thumb:last-child").addClass("last-feat");
                });

            });
        };


        // Drop in markup for slide carousel
        var bg_slides = function() {
            $("[data-carousel]").not( ".slidewrap" ).each(function() {
                var $oEl = $(this),
                    type = $oEl.attr('data-carousel'),
                    $oSlides = $oEl.find(".slide"),
                    tmp = Math.random().toString().slice(2, 12),
                    sId = "carousel-" + tmp,
                    sPrev = '<a class="prev" href="#' + sId + '"><i>Previous</i></a>',
                    sNext = '<a class="next" href="#' + sId + '"><i>Next</i></a>',
                    sTabHed = '<h2 class="carousel-tabs-head">View Slide</h2>',
                    sTabCount = 'Slide {current} of {total}',
                    sHTMLnav = [
                        '<ul class="nav">',
                        '   <li>' + sPrev + '</li>',
                        '   <li>' + sNext + '</li>',
                        '</ul>'
                    ].join('');

                if ($oSlides.length > 1 ) {
                    // Insert previous/next arrows into the magazine preview slides


                    $oEl
                        .addClass("slidewrap")
                        .attr("tabindex", 0)
                        .wrapInner('<div id="' + sId + '" class="slider"></div>')
                        .before(sHTMLnav);

                } else {
                    $oEl
                        .removeAttr("data-carousel")
                        .addClass('slidewrap');
                }

                // Trigger carousel(s)
                $(this)
                    .carousel({
                        slide: '.slide',
                        slider: '.slider',
                        nextSlide: '.next',
                        prevSlide: '.prev',
                        speed: 500 // ms.
                    });


            });
        }

        //init existing carousels on page
        curate();
        bg_slides();
    }

    $(".inside .content").each(function() {
        if($(this).hasClass('custom')) {
            slider3Column();

        }
        else{
            slider();
        }
    });

    $(window).resize(function(){
        $(".inside .content").each(function() {
            if($(this).hasClass('custom')) {
                removeClassSlider();
                slider3Column();
            }
        });
    });


});

function removeClassSlider(){
    async.forEach($('.content .slide'), function(t, cb){
        var a = $(t).contents();
        $(t).replaceWith(a);
        cb();
    }, function(){
        var slider = $('.content .slider').contents();
        $('.content .slider').replaceWith(slider);


    });
    $('.inside .nav').remove();
    $('.inside .content').removeClass('slidewrap feat-even feat-odd feat-center feat-normal');
    $('.inside .pagination li').remove();
}
