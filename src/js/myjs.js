'use strict';


// Nav menu

$( "span.nav-toggle" ).click(function() {
  $( ".nav-menu" ).animate({
    display: "block",
    height: "toggle",
    top: "100%"
  }, 300);
  $( ".nav-toggle" ).toggleClass('is-active');
});

// $('#menu-item-227').hover(function() {
//   $(this).find('.sub-menu').stop(true, true).fadeIn(300);
// }, function() {
//   $(this).find('.sub-menu').stop(true, true).fadeOut(700);
// });



// Delete Notificatipns
$('button.delete').on('click', function(){
  $(this).closest( "div" ).fadeOut( {
  	duration: 1000,
  	// easing: 'easeInCubic'
  });
});


$(".notify").bind("DOMNodeInserted",function(){
    $(this).children().fadeOut(1600);
});

// $('.notification')fadeOut( 1600, "linear");



// Must use AJAX to make DELETE request
$(document).ready(function(){


  $('.delete-article').on('click', function(event){
    // Want to get hold of the data-id attribute
    $target = $(event.target);
    const id = $target.attr('data-id');
    console.log(id);
    $.ajax({
      type: 'DELETE',
      url: '/articles/'+id,
      success: function(response){
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });

  });

  $(".notify").children().delay(600).fadeOut({
    duration: 1600,
    easing: 'easeOutExpo',
    // complete: callback
  });


}); // end doc ready
