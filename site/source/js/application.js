/* LIBS */



/* AUTHOR CODE */



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
    $(this).next(".dropitem").toggleClass("open")
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
$('html').swipeRight(function () {
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
$('html').swipeLeft(function () {
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

$('.amount-toggle').swipeLeft(function () {
  $(this).next(".price-amount").addClass("active")
  $(this).addClass("off-canvas-li")
});

$('.amount-toggle').swipeRight(function () {
  $(this).next(".price-amount").removeClass("active")
  $(this).removeClass("off-canvas-li")
});
