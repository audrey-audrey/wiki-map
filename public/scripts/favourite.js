$(() => {
  $("#favButton").click( (event) =>{
    event.preventDefault();
    const mapID = $("#favButton").data("mapid");
    $.ajax({
      url: `/map/${mapID}`,
      method: "POST"
    })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    })
    $(".favourites").css({
      "display": "flex",
      "justify-content": "center",
      "font-size": '20px',
      "background-color": 'rgb(169,169,169)',
      "color": "white",
      "padding": '15px'
    }).delay(1000).slideUp(3000);
  })
})
