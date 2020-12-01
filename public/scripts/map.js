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

    // Adding pins to map
    $(()=> {
      $("#addPoint").click( ()=> {
        console.log('addpoint button clicked')
        addMarker({
          lat: coordsArray[0],
          lng: coordsArray[1],
          title: escape($("#title").val()),
          description: escape($("#description").val()),
          image: escape($("#image").val())
        }, map);
        coordsArray = [];
        $(".table").append(`
        <tr>
          <th scope="row"> ${markers.length} </th>
          <td> ${$("#title").val()} </td>
          <td> ${$("#description").val()} </td>
        </tr>
        `);
        $("#pac-input").val("");
        $("#title").val("");
        $("#description").val("");
        $("#image").val("");
      })

      // Sending map and markers array to the database
      $("#createMap").click(()=> {
        // console.log('markers array',markers)
        $.post("http://localhost:8080/new",
        {pins: pins},
        function(data, status){
          console.log(data)
        });
      })
    })

  }


  // Adds a marker to the map and push to the array.
  function addMarker(location, map) {
    let infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      position: {
        lat: location.lat,
        lng: location.lng
      },
      map: map,
      animation: google.maps.Animation.DROP
    });
    console.log(markers);
    markers.push(marker);
    console.log(markers);
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.close(); // Close previously opened infowindow
      infowindow.setContent(
        '<h4>'+ location.title + '</h4>' +
        '<p>' + location.description + '</p>' +
        '<p id = "markerImage"> <img src = ' + location.image +'></p>',
      );
      infowindow.open(map, marker);
    });
  }

  const escape = str => {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }



