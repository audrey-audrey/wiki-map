let markers = [{coords:{lat: 43.7169, lng: -79.3389},
              iconImage: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
              content: '<h1>Pop-up example</h1>'},
              {coords:{lat: 43.6424, lng: -79.3860}}];
let searchMarker = [];

function initMap() {
  // map options
  const options = {
    zoom: 14,
    center: { lat: 43.6532, lng: -79.3832 }
  }

  // new map
  const map = new google.maps.Map(document.getElementById("map"), options);

  // loop through markers
  for(let i = 0; i < markers.length; i++) {
    var temp = new google.maps.Marker({
      position: markers[i].coords,
      icon: markers[i].iconImage,
      map: map,
    });
    console.log(temp);
  }

  const input = document.getElementById('pac-input');
  const autocomplete = new google.maps.places.Autocomplete(input);

  // Specify just the place data fields that you need.
  autocomplete.setFields(['place_id', 'geometry', 'name', 'formatted_address']);

  let geocoder = new google.maps.Geocoder;
  let coordsArray = [];

  autocomplete.addListener('place_changed', function() {
    //Clear out the old markers.
    searchMarker.forEach((marker) => {
      marker.setMap(null);
    });
    searchMarker = [];
    coordsArray = [];

    let place = autocomplete.getPlace();
    coordsArray.push(place.geometry.location.lat());
    coordsArray.push(place.geometry.location.lng());

    let marker = new google.maps.Marker({map: map});
    if (!place.place_id) {
      return;
    }

    geocoder.geocode({'placeId': place.place_id}, function(results, status) {
      if (status !== 'OK') {
        window.alert('Geocoder failed due to: ' + status);
        return;
      }

      map.setZoom(17);
      map.setCenter(results[0].geometry.location);

      // Set the position of the marker using the place ID and location.
      marker.setPlace(
          {placeId: place.place_id, location: results[0].geometry.location});

      marker.setVisible(true);

      searchMarker.push(marker);
      console.log("searchMarker: ", searchMarker);
      });

      // Remove pin on double click
      // marker.addListener("dblclick", function() {
      //   marker.setMap(null);
      // })

    });

    $(()=> {
      $("#addPoint").click( ()=> {
        console.log('addpoint button clicked')
        console.log(markers);
        addMarker({
          coords: {lat: coordsArray[0], lng: coordsArray[1]},
          iconImage: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
          content: "HELLO"
        }, map);
        coordsArray = [];
      })
    })

    $(() => {
      $("#pac-input").click(() => {
        console.log('point clicked.  Not added.')
        marker.setMap(null);
      })
    });

    $(document).ready(() => {
      console.log('made it before');
      $("#createMap").submit(function(event) {
          event.preventDefault();
          console.log('made it after');
          console.log('create map submitted!');
      });
    });

  }




  // Adds a marker to the map and push to the array.
  function addMarker(location, map) {
    console.log(location)
    var marker = new google.maps.Marker({
      position: location.coords,
      icon: location.iconImage,
      map: map,
    });
    console.log(markers);
    markers.push(marker);
    console.log(markers);
  }







