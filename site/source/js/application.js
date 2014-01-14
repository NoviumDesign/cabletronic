/* LIBS */



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
    $(this).toggleClass("active")
    $(this).nextUntil("li").toggleClass("open")
  })
})

/* Toggle visibility of menu on click */
$( "#main-menu-link" ).click(function() {
  $("body").toggleClass( "off-canvas-left" );
  $("#main-menu").toggleClass( "mobile-nav-open" );
});

/* Toggle visibility of cart on click */
$( "#cart-link" ).click(function() {
  $("body").toggleClass( "off-canvas-right" );
  $("#cart").toggleClass( "cart-nav-open" );
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