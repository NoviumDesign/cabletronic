/* LIBS */

/**
 * MBP - Mobile boilerplate helper functions
 */

(function(document) {

    window.MBP = window.MBP || {};

    /**
     * Fix for iPhone viewport scale bug
     * http://www.blog.highub.com/mobile-2/a-fix-for-iphone-viewport-scale-bug/
     */

    MBP.viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]');
    MBP.ua = navigator.userAgent;

    MBP.scaleFix = function() {
        if (MBP.viewportmeta && /iPhone|iPad|iPod/.test(MBP.ua) && !/Opera Mini/.test(MBP.ua)) {
            MBP.viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0';
            document.addEventListener('gesturestart', MBP.gestureStart, false);
        }
    };

    MBP.gestureStart = function() {
        MBP.viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
    };

    /**
     * Normalized hide address bar for iOS & Android
     * (c) Scott Jehl, scottjehl.com
     * MIT License
     */

    // If we split this up into two functions we can reuse
    // this function if we aren't doing full page reloads.

    // If we cache this we don't need to re-calibrate everytime we call
    // the hide url bar
    MBP.BODY_SCROLL_TOP = false;

    // So we don't redefine this function everytime we
    // we call hideUrlBar
    MBP.getScrollTop = function() {
        var win = window;
        var doc = document;

        return win.pageYOffset || doc.compatMode === 'CSS1Compat' && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
    };

    // It should be up to the mobile
    MBP.hideUrlBar = function() {
        var win = window;

        // if there is a hash, or MBP.BODY_SCROLL_TOP hasn't been set yet, wait till that happens
        if (!location.hash && MBP.BODY_SCROLL_TOP !== false) {
            win.scrollTo( 0, MBP.BODY_SCROLL_TOP === 1 ? 0 : 1 );
        }
    };

    MBP.hideUrlBarOnLoad = function() {
        var win = window;
        var doc = win.document;
        var bodycheck;

        // If there's a hash, or addEventListener is undefined, stop here
        if ( !location.hash && win.addEventListener ) {

            // scroll to 1
            window.scrollTo( 0, 1 );
            MBP.BODY_SCROLL_TOP = 1;

            // reset to 0 on bodyready, if needed
            bodycheck = setInterval(function() {
                if ( doc.body ) {
                    clearInterval( bodycheck );
                    MBP.BODY_SCROLL_TOP = MBP.getScrollTop();
                    MBP.hideUrlBar();
                }
            }, 15 );

            win.addEventListener('load', function() {
                setTimeout(function() {
                    // at load, if user hasn't scrolled more than 20 or so...
                    if (MBP.getScrollTop() < 20) {
                        // reset to hide addr bar at onload
                        MBP.hideUrlBar();
                    }
                }, 0);
            });
        }
    };

    /**
     * Fast Buttons - read wiki below before using
     * https://github.com/h5bp/mobile-boilerplate/wiki/JavaScript-Helper
     */

    MBP.fastButton = function(element, handler, pressedClass) {
        this.handler = handler;
        // styling of .pressed is defined in the project's CSS files
        this.pressedClass = typeof pressedClass === 'undefined' ? 'pressed' : pressedClass;

        if (element.length && element.length > 1) {
            for (var singleElIdx in element) {
                this.addClickEvent(element[singleElIdx]);
            }
        } else {
            this.addClickEvent(element);
        }
    };

    MBP.fastButton.prototype.handleEvent = function(event) {
        event = event || window.event;

        switch (event.type) {
            case 'touchstart': this.onTouchStart(event); break;
            case 'touchmove': this.onTouchMove(event); break;
            case 'touchend': this.onClick(event); break;
            case 'click': this.onClick(event); break;
        }
    };

    MBP.fastButton.prototype.onTouchStart = function(event) {
        var element = event.target || event.srcElement;
        event.stopPropagation();
        element.addEventListener('touchend', this, false);
        document.body.addEventListener('touchmove', this, false);
        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;

        element.className+= ' ' + this.pressedClass;
    };

    MBP.fastButton.prototype.onTouchMove = function(event) {
        if (Math.abs(event.touches[0].clientX - this.startX) > 10 ||
            Math.abs(event.touches[0].clientY - this.startY) > 10) {
            this.reset(event);
        }
    };

    MBP.fastButton.prototype.onClick = function(event) {
        event = event || window.event;
        var element = event.target || event.srcElement;
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        this.reset(event);
        this.handler.apply(event.currentTarget, [event]);
        if (event.type == 'touchend') {
            MBP.preventGhostClick(this.startX, this.startY);
        }
        var pattern = new RegExp(' ?' + this.pressedClass, 'gi');
        element.className = element.className.replace(pattern, '');
    };

    MBP.fastButton.prototype.reset = function(event) {
        var element = event.target || event.srcElement;
        rmEvt(element, 'touchend', this, false);
        rmEvt(document.body, 'touchmove', this, false);

        var pattern = new RegExp(' ?' + this.pressedClass, 'gi');
        element.className = element.className.replace(pattern, '');
    };

    MBP.fastButton.prototype.addClickEvent = function(element) {
        addEvt(element, 'touchstart', this, false);
        addEvt(element, 'click', this, false);
    };

    MBP.preventGhostClick = function(x, y) {
        MBP.coords.push(x, y);
        window.setTimeout(function() {
            MBP.coords.splice(0, 2);
        }, 2500);
    };

    MBP.ghostClickHandler = function(event) {
        if (!MBP.hadTouchEvent && MBP.dodgyAndroid) {
            // This is a bit of fun for Android 2.3...
            // If you change window.location via fastButton, a click event will fire
            // on the new page, as if the events are continuing from the previous page.
            // We pick that event up here, but MBP.coords is empty, because it's a new page,
            // so we don't prevent it. Here's we're assuming that click events on touch devices
            // that occur without a preceding touchStart are to be ignored.
            event.stopPropagation();
            event.preventDefault();
            return;
        }
        for (var i = 0, len = MBP.coords.length; i < len; i += 2) {
            var x = MBP.coords[i];
            var y = MBP.coords[i + 1];
            if (Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
                event.stopPropagation();
                event.preventDefault();
            }
        }
    };

    // This bug only affects touch Android 2.3 devices, but a simple ontouchstart test creates a false positive on
    // some Blackberry devices. https://github.com/Modernizr/Modernizr/issues/372
    // The browser sniffing is to avoid the Blackberry case. Bah
    MBP.dodgyAndroid = ('ontouchstart' in window) && (navigator.userAgent.indexOf('Android 2.3') != -1);

    if (document.addEventListener) {
        document.addEventListener('click', MBP.ghostClickHandler, true);
    }

    addEvt(document.documentElement, 'touchstart', function() {
        MBP.hadTouchEvent = true;
    }, false);

    MBP.coords = [];

    // fn arg can be an object or a function, thanks to handleEvent
    // read more about the explanation at: http://www.thecssninja.com/javascript/handleevent
    function addEvt(el, evt, fn, bubble) {
        if ('addEventListener' in el) {
            // BBOS6 doesn't support handleEvent, catch and polyfill
            try {
                el.addEventListener(evt, fn, bubble);
            } catch(e) {
                if (typeof fn == 'object' && fn.handleEvent) {
                    el.addEventListener(evt, function(e){
                        // Bind fn as this and set first arg as event object
                        fn.handleEvent.call(fn,e);
                    }, bubble);
                } else {
                    throw e;
                }
            }
        } else if ('attachEvent' in el) {
            // check if the callback is an object and contains handleEvent
            if (typeof fn == 'object' && fn.handleEvent) {
                el.attachEvent('on' + evt, function(){
                    // Bind fn as this
                    fn.handleEvent.call(fn);
                });
            } else {
                el.attachEvent('on' + evt, fn);
            }
        }
    }

    function rmEvt(el, evt, fn, bubble) {
        if ('removeEventListener' in el) {
            // BBOS6 doesn't support handleEvent, catch and polyfill
            try {
                el.removeEventListener(evt, fn, bubble);
            } catch(e) {
                if (typeof fn == 'object' && fn.handleEvent) {
                    el.removeEventListener(evt, function(e){
                        // Bind fn as this and set first arg as event object
                        fn.handleEvent.call(fn,e);
                    }, bubble);
                } else {
                    throw e;
                }
            }
        } else if ('detachEvent' in el) {
            // check if the callback is an object and contains handleEvent
            if (typeof fn == 'object' && fn.handleEvent) {
                el.detachEvent("on" + evt, function() {
                    // Bind fn as this
                    fn.handleEvent.call(fn);
                });
            } else {
                el.detachEvent('on' + evt, fn);
            }
        }
    }

    /**
     * Autogrow
     * http://googlecode.blogspot.com/2009/07/gmail-for-mobile-html5-series.html
     */

    MBP.autogrow = function(element, lh) {
        function handler(e) {
            var newHeight = this.scrollHeight;
            var currentHeight = this.clientHeight;
            if (newHeight > currentHeight) {
                this.style.height = newHeight + 3 * textLineHeight + 'px';
            }
        }

        var setLineHeight = (lh) ? lh : 12;
        var textLineHeight = element.currentStyle ? element.currentStyle.lineHeight : getComputedStyle(element, null).lineHeight;

        textLineHeight = (textLineHeight.indexOf('px') == -1) ? setLineHeight : parseInt(textLineHeight, 10);

        element.style.overflow = 'hidden';
        element.addEventListener ? element.addEventListener('input', handler, false) : element.attachEvent('onpropertychange', handler);
    };

    /**
     * Enable CSS active pseudo styles in Mobile Safari
     * http://alxgbsn.co.uk/2011/10/17/enable-css-active-pseudo-styles-in-mobile-safari/
     */

    MBP.enableActive = function() {
        document.addEventListener('touchstart', function() {}, false);
    };

    /**
     * Prevent default scrolling on document window
     */
     
    MBP.preventScrolling = function() {
        document.addEventListener('touchmove', function(e) {
            if (e.target.type === 'range') { return; }
            e.preventDefault();
        }, false);
    };

    /**
     * Prevent iOS from zooming onfocus
     * https://github.com/h5bp/mobile-boilerplate/pull/108
     * Adapted from original jQuery code here: http://nerd.vasilis.nl/prevent-ios-from-zooming-onfocus/
     */

    MBP.preventZoom = function() {
        var formFields = document.querySelectorAll('input, select, textarea');
        var contentString = 'width=device-width,initial-scale=1,maximum-scale=';
        var i = 0;

        for (i = 0; i < formFields.length; i++) {
            formFields[i].onfocus = function() {
                MBP.viewportmeta.content = contentString + '1';
            };
            formFields[i].onblur = function() {
                MBP.viewportmeta.content = contentString + '10';
            };
        }
    };

    /**
     * iOS Startup Image helper
     */

    // MBP.startupImage = function() {
    //     var portrait;
    //     var landscape;
    //     var pixelRatio;
    //     var head;
    //     var link1;
    //     var link2;

    //     pixelRatio = window.devicePixelRatio;
    //     head = document.getElementsByTagName('head')[0];

    //     if (navigator.platform === 'iPad') {
    //         portrait = pixelRatio === 2 ? 'img/startup/startup-tablet-portrait-retina.png' : 'img/startup/startup-tablet-portrait.png';
    //         landscape = pixelRatio === 2 ? 'img/startup/startup-tablet-landscape-retina.png' : 'img/startup/startup-tablet-landscape.png';

    //         link1 = document.createElement('link');
    //         link1.setAttribute('rel', 'apple-touch-startup-image');
    //         link1.setAttribute('media', 'screen and (orientation: portrait)');
    //         link1.setAttribute('href', portrait);
    //         head.appendChild(link1);

    //         link2 = document.createElement('link');
    //         link2.setAttribute('rel', 'apple-touch-startup-image');
    //         link2.setAttribute('media', 'screen and (orientation: landscape)');
    //         link2.setAttribute('href', landscape);
    //         head.appendChild(link2);
    //     } else {
    //         portrait = pixelRatio === 2 ? "img/startup/startup-retina.png" : "img/startup/startup.png";
    //         portrait = screen.height === 568 ? "img/startup/startup-retina-4in.png" : portrait;
    //         link1 = document.createElement('link');
    //         link1.setAttribute('rel', 'apple-touch-startup-image');
    //         link1.setAttribute('href', portrait);
    //         head.appendChild(link1);
    //     }

    //     //hack to fix letterboxed full screen web apps on 4" iPhone / iPod
    //     if ((navigator.platform === 'iPhone' || 'iPod') && (screen.height === 568)) {
    //         if (MBP.viewportmeta) {
    //             MBP.viewportmeta.content = MBP.viewportmeta.content
    //                 .replace(/\bwidth\s*=\s*320\b/, 'width=320.1')
    //                 .replace(/\bwidth\s*=\s*device-width\b/, '');
    //         }
    //     }
    // };

})(document);


/* AUTHOR CODE */

$("a.dropdown").click(function( event ) {
  event.preventDefault();
});

$("li#search a").click(function( event ) {
  event.preventDefault();
});

/* Android touch fix */
$('body').hammer().on("dragleft dragright", function(ev){ ev.gesture.preventDefault(); })

/* Change SVG to PNG in low IE versions */
if(!Modernizr.svg) {
  $('img[src*="svg"]').attr('src', function() {
    return $(this).attr('src').replace('.svg', '.png');
  });
}

/* Toggle dropdowns on click */
$(document).ready(function () {
  $(".dropdown").click(function () {

    var
      parent = $(this).parent('li'),
      childFolder = parent.find('ul').first(),
      parentFolder = parent.parent('ul'),
      siblingFolders = parentFolder.find('ul.open'),
      siblingDropdowns = parentFolder.find('.dropdown.active'),
      megamenu = parent.children('.megamenu'),
      isOpen = childFolder.is('.open');

    siblingFolders.removeClass('open');
    siblingDropdowns.removeClass('active');

    if (childFolder.is('.level0'))
    {
      $('.megamenu').removeClass('open')
    }

    if (isOpen)
    {
      $(this).removeClass('active');
      childFolder.removeClass('open');
      megamenu.removeClass('open');
    }
    else
    {
      $(this).addClass('active');
      childFolder.addClass('open');
      megamenu.addClass('open');
    }
  })
})

// $(document).click(function (event) {
//   if ($('.megamenu.open').length)
//   {
//     if ( ! ($(event.target).parents('.megamenu').length || $(event.target).is('.dropdown')))
//     {
//       $('.megamenu.open').removeClass('open');
//       $('#main-menu ul.open').removeClass('open');
//       $('#main-menu .dropdown.active').removeClass('active');
//     }
//   }
// });

/* Toggle visibility of menu on click */
$( "#main-menu-link" ).click(function() {
  $("body").toggleClass( "off-canvas-left" );
  $("#main-menu").toggleClass( "mobile-nav-open" );
});

/* Toggle visibility of cart on click */
$( "#cart-link" ).click(function (event) {

    if ($(window).width() < critical_width)
    {
        // do not open cart page
        event.preventDefault();

        $("body").toggleClass( "off-canvas-right" );
        $("#cart").toggleClass( "cart-nav-open" );
    }
});

/* Toggle visibility of right off canvas element */
$('html').hammer().on("swiperight", function(event)
{
  var target, that, success;
  target = $(event.target);

  if (target.is('.amount-toggle') || target.parents('.amount-toggle').length)
  {
    // amount toggle
    that = (target.is('.amount-toggle') ? target : target.parents('.amount-toggle'));

    if (that.next('.extra-settings').is('.active'))
    {
      // nothing to do here...
      that.next(".extra-settings").removeClass("active");
      that.removeClass("off-canvas-li");

      success = true;
    }
    else
    {
      success = false
    }
  }

  if ( ! success)
  {
    // default
    if ($("body").hasClass("off-canvas-right"))
    {
      // Cart visible - hide it.
        $("#cart").removeClass("cart-nav-open");
        $("body").removeClass("off-canvas-right");
    }
    else
    {
      // Cart not visible - show menu.
      $('#main-menu').addClass("mobile-nav-open");
      $("body").addClass("off-canvas-left");
    }
  }
});

/* Toggle visibility of left off canvas element */
$('html').hammer().on("swipeleft", function(event)
{
  var target, that;

  target = $(event.target);

  if (target.is('.amount-toggle') || target.parents('.amount-toggle').length)
  {
    // amount toggle
    that = (target.is('.amount-toggle') ? target : target.parents('.amount-toggle'));

    that.next(".extra-settings").addClass("active");
    that.addClass("off-canvas-li");

  }
  else
  {
    // default
    if ($("body").hasClass("off-canvas-left"))
    {
      // Menu visible - hide it.
      $("#main-menu").removeClass("mobile-nav-open");
      $("body").removeClass("off-canvas-left");
    }
    else
    {
      // Menu not visible - show cart.
      $('#cart').addClass("cart-nav-open");
      $("body").addClass("off-canvas-right");
    }
  }
});

/* Fix nav on scroll */ 
$("document").ready(function ($) {

    var nav = $('nav');
    var scrollamount = 80;

    $(window).scroll(function () {
        if ($(this).scrollTop() > scrollamount) {
            nav.addClass("fixed-nav");
        } else {
            nav.removeClass("fixed-nav");
        }
    });
});

// Toggle mobile search
$("#search").click(function () {
  $('#mobile-search').toggleClass("active");
})

/* Fix tee on scroll */ 
// $("document").ready(function ($) {

//     var tree = $('#tree');
//     var scrollamountTree = 600;

//     $(window).scroll(function () {
//         if ($(this).scrollTop() > scrollamountTree) {
//             tree.addClass("fixed-tree");
//         } else {
//             tree.removeClass("fixed-tree");
//         }
//     });
// });

$(document).ready(function() {
    $("#content").find("[id^='tab']").hide(); // Hide all content
    $("#tabs li:first").attr("id","current"); // Activate the first tab
    $("#content #tab1").fadeIn(); // Show first tab's content
    
    $('#tabs a').click(function(e) {
        e.preventDefault();
        if ($(this).closest("li").attr("id") == "current"){ //detection for current tab
         return;       
        }
        else{             
          $("#content").find("[id^='tab']").hide(); // Hide all content
          $("#tabs li").attr("id",""); //Reset id's
          $(this).parent().attr("id","current"); // Activate this
          $('#' + $(this).attr('name')).fadeIn(); // Show content for the current tab
        }
    });
});

var critical_width = 1000;


var critical_trasition = function ()
{
    // need global variable "critical_width"

    var width, test;

    width = $(window).width();

    // 1 when transition applies
    test = (critical_trasition.temp_width - critical_width)*(width - critical_width) <= 0;

    if (test)
    {
        // transistion
        $(window).trigger('critical_trasition')
    }

    // store for next resize
    critical_trasition.temp_width = width;
}
critical_trasition.temp_width = $(window).width();

$(window).bind('resize', function () {
    critical_trasition()  
});


$(window).on('critical_trasition', function ()
{

    $('body').removeClass('off-canvas-left off-canvas-right');
    $('#main-menu').removeClass('mobile-nav-open');
    $('#cart').removeClass('cart-nav-open');



})







































