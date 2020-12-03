$(() => {
  $("#favButton").click( (event) =>{
    event.preventDefault();
    const mapID = $("#favButton").data("mapid");
    console.log(mapID);
  })

})
