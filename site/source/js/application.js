/* LIBS */



/* AUTHOR CODE */

$("a.dropdown").click(function( event ) {
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
$('html').hammer().on("swiperight", function() {
  if ($("body").hasClass("off-canvas-right")) { // Cart visible - hide it.
      $("#cart").removeClass("cart-nav-open");
      $("body").removeClass("off-canvas-right");
  }
  else { // Cart not visible - show menu.
    $('#main-menu').addClass("mobile-nav-open");
    $("body").addClass("off-canvas-left");
  }
});

/* Toggle visibility of left off canvas element */
$('html').hammer().on("swipeleft", function() {
  if ($("body").hasClass("off-canvas-left")) { // Menu visible - hide it.
    $("#main-menu").removeClass("mobile-nav-open");
    $("body").removeClass("off-canvas-left");
  }
  else { // Menu not visible - show cart.
    $('#cart').addClass("cart-nav-open");
    $("body").addClass("off-canvas-right");
  }
});

// /* Toggle visibility of product amount */
// $( "#amount-toggle" ).click(function() {
//   $(this).next(".price-amount").toggleClass("active")
// });

$('.amount-toggle').hammer().on("swipeleft", function() {
  $(this).next(".extra-settings").addClass("active")
  $(this).addClass("off-canvas-li")
});

$('.amount-toggle').hammer().on("swiperight", function() {
  $(this).next(".extra-settings").removeClass("active")
  $(this).removeClass("off-canvas-li")
});

/* Select all text in fields on focus */
$('input').selectionStart = 0;
$('input').selectionEnd = 999;


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