$(document).ready(function () {


  $('.overview').click(function () {
    if ($('.favourites-content').is(':visible')) {
      $('.favourites-content').hide()
    }
    if ($('.contributions-content').is(':visible')) {
      $('.contributions-content').hide()
    }

    $(".overview-content").show();
  })


  $('.favourites').click(function () {
    if ($('.overview-content').is(':visible')) {
      $('.overview-content').hide()
    }
    if ($('.contributions-content').is(':visible')) {
      $('.contributions-content').hide()
    }

    $(".favourites-content").show();
  })


  $('.contributions').click(function () {
    if ($('.favourites-content').is(':visible')) {
      $('.favourites-content').hide()
    }
    if ($('.overview-content').is(':visible')) {
      $('.overview-content').hide()
    }

    $(".contributions-content").show();
  })

})

