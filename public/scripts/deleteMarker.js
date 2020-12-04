$(() => {
  $("#deleteMarker").click( (event) =>{
    event.preventDefault();
    const mapID = $("#deleteMarker").data("mapid");
    const pinName = $("#deleteMarker").data("marker");
    console.log(mapID, pinName)
    $.ajax({
      url: `/delete/${mapID}/${pinName}`,
      method: "POST",
    })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    })
  })
})
