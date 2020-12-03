$(document).ready(function () {


  $('.overview').click(function () {
    if ($('.favourites-content').is(':visible')) {
      $('.favourites-content').hide()
    }
    if ($('.contributions-content').is(':visible')) {
      $('.contributions-content').hide()
    }

  })




  $('.favourites').click(function () {
    if ($('.overview-content').is(':visible')) {
      $('.overview-content').hide()
    }
    if ($('.contributions-content').is(':visible')) {
      $('.contributions-content').hide()
    }

    $(".favourites-content").show();

    // get data from database
    $.get("/profile/favourites", function (data, status) {
      alert("Data: " + data + "\nStatus: " + status);
    })
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

