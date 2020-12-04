// helper functions
// create list elements to display favourite maps
const createListElement = function (name) {
  let $name = `
  <li><a href=/map/${name.id}>${name.name}</a></li>
  `;
  return $name;
}

// Render map names on profile container
/**
 *
 * @param mapNames = array of objects returned from get request in the following format [ anonymous: {name: ....}, ...]
 */
const renderList = function (mapNames, container) {
  for(const name of mapNames){
    const $name = createListElement(name);
    $(container).append($name);
  }
}

$(document).ready(function () {
  // get data from database for favourite maps
  $.get("/profile/favourites", function (data, status) {
    renderList(data, ".favourites-content-list")
  })

  // get data from database for maps that user have contributed to
  $.get("/profile/contributions", function (data, status) {
    renderList(data, ".contributions-content-list")
  })

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

