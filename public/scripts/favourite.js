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
  })
})