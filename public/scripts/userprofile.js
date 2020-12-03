// helper functions
// create list elements to display favourite maps
const createListElement = function (name) {
  let $name = `
  <li>${name.name}</li>
  `;

  return $name;
}

// Render map names on profile container
/**
 *
 * @param mapNames = array of objects returned from get request in the following format [ anonymous: {name: ....}, ...]
 */
const renderList = function (mapNames) {
  for(const name of mapNames){
    const $name = createListElement(name);
    $('.favourites-content-list').prepend($name);
  }
}

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
      renderList(data)
      // alert("Data: " + data + "\nStatus: " + status);
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

