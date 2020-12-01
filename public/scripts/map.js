let markers = [
                { coords: {lat: 43.7169, lng: -79.3389},
                  content: '<h4>Pop-up example</h4> <p> This is a pop up example </p>'},
                { coords:{lat: 43.6424, lng: -79.3860},
                  content: '<h4>Pop-up example2</h4> <p> This is a pop up example!!!!! </p>'
                }
              ];
let searchMarker = [];


function initMap() {
  // map options
  const options = {
    zoom: 14,
    center: { lat: 43.6532, lng: -79.3832 }
  }

  // new map
  const map = new google.maps.Map(document.getElementById("map"), options);
  let infowindow = new google.maps.InfoWindow();

  function placeMarker (location) {
    const marker = new google.maps.Marker({
      position : new google.maps.LatLng( location.coords ),
      icon: location.iconImage,
      map : map
    });
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.close(); // Close previously opened infowindow
        infowindow.setContent(`${location.content}`);
        infowindow.open(map, marker);
    });
  }

   // ITERATE ALL LOCATIONS. Pass every location to placeMarker
   markers.forEach( placeMarker );

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
      marker.addListener("dblclick", function() {
        marker.setMap(null);
      })

    });

    $(()=> {
      $("#addPoint").click( ()=> {
        console.log('addpoint button clicked')
        addMarker({
          coords: {lat: coordsArray[0], lng: coordsArray[1]},
          content: '<h4>'+ $("#title").val() + '</h4>' +
                   '<p>' + $("#description").val() + '</p>' +
                   `<p id = "markerImage"> <img src = ${$("#image").val()} ></p>`,

        }, map);
        coordsArray = [];
      })
    })

  }


  // Adds a marker to the map and push to the array.
  function addMarker(location, map) {
    let infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      position: location.coords,
      icon: location.iconImage,
      map: map,
      animation: google.maps.Animation.DROP
    });
    console.log(markers);
    markers.push(marker);
    console.log(markers);
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.close(); // Close previously opened infowindow
      infowindow.setContent(`${location.content}`);
      infowindow.open(map, marker);
    });
  }



