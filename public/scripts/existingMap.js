$(document).ready(function () {
  // helper function
  /**
   *
   * @param {*} data = this is the array we get from the get request
   */
  let pinsFromDatabase = [];

  const loopData = function (pins) {
    for (const pin of pins) {
      // console.log('from get request', coords)
      pinsFromDatabase.push({
        name        : pin.name,
        description : pin.description,
        lat         : pin.lat,
        lng         : pin.lng,
        image       : pin.image
      })
    }
  }

  const pathName = window.location.pathname;
  const mapId = pathName.substring(5)

  $.get("/new/" + mapId, function (data, status) {

    loopData(data);

    let markers = [];
    let searchMarker = [];
    // console.log(markers);
    // for database
    let pins = [];
    let mapInfo = {};

    function initMap() {
      // map options
      const options = {
        zoom: 14,
        center: { lat: 43.6532, lng: -79.3832 }
      }

      // new map
      const map = new google.maps.Map(document.getElementById("map"), options);
      let infowindow = new google.maps.InfoWindow();

      //create empty LatLngBounds object
      let bounds = new google.maps.LatLngBounds();

      function addPin(props) {
        const pin = new google.maps.Marker({
          position: { lat: parseFloat(props.lat), lng: parseFloat(props.lng) },
          map: map
        })

        //extend the bounds to include each marker's position
        bounds.extend(pin.position);

          // Check for custom icon
          if(props.image) {
            // Set icon image
            pin.setIcon(props.image)
          }

          if(props.description) {
            const image = props.image ? props.image : "";
            pin.addListener('click', function(){
              infowindow.close(map, pin); // Close previously opened infowindow
              infowindow.setContent(
                '<h4>' + props.name + '</h4>' +
                '<p>' + props.description + '</p>' +
                '<p id = "markerImage"> <img src = "' + image + '" alt = "No image available"/></p>',
              );
              infowindow.open(map, pin);
              $("#title").val(props.name);
              $("#description").val(props.description);
              $('#addPoint').html("Edit Point").attr("id", "editPoint");
            })
            map.addListener('click', function(){
              infowindow.close(map, pin); // Close previously opened infowindow
              $('#editPoint').html("Add Point").attr("id", "addPoint");
              $("#title").val("");
              $("#description").val("");
              $("#image").val("");
            })
          }
      }

      // Loop through all pins
      for (const pin of pinsFromDatabase) {
        addPin(pin)
        console.log('pins added')
      }

      //now fit the map to the newly inclusive bounds
      map.fitBounds(bounds);

      // END OF NEW ADDITION
      function placeMarker(location) {
        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(location.coords),
          map: map
        });
        google.maps.event.addListener(marker, 'click', function () {
          infowindow.close(); // Close previously opened infowindow
          infowindow.setContent(`${location.content}`);
          infowindow.open(map, marker);
        });
      }

      // ITERATE ALL LOCATIONS. Pass every location to placeMarker
      markers.forEach(placeMarker);


      const input = document.getElementById('pac-input');
      const autocomplete = new google.maps.places.Autocomplete(input);

      // Specify just the place data fields that you need.
      autocomplete.setFields(['place_id', 'geometry', 'name', 'formatted_address']);

      let geocoder = new google.maps.Geocoder;
      let coordsArray = [];

      autocomplete.addListener('place_changed', function () {
        //Clear out the old markers.
        searchMarker.forEach((marker) => {
          marker.setMap(null);
        });
        searchMarker = [];
        coordsArray = [];

        let place = autocomplete.getPlace();
        coordsArray.push(place.geometry.location.lat());
        coordsArray.push(place.geometry.location.lng());


        let marker = new google.maps.Marker({ map: map });
        if (!place.place_id) {
          return;
        }

        geocoder.geocode({ 'placeId': place.place_id }, function (results, status) {
          if (status !== 'OK') {
            window.alert('Geocoder failed due to: ' + status);
            return;
          }

          map.setZoom(17);
          map.setCenter(results[0].geometry.location);

          // Set the position of the marker using the place ID and location.
          marker.setPlace(
            { placeId: place.place_id, location: results[0].geometry.location });

          marker.setVisible(true);

          searchMarker.push(marker);
          console.log("searchMarker: ", searchMarker);
        });

        // Remove pin on double click
        // marker.addListener("dblclick", function() {
        //   marker.setMap(null);
        // })

      });

      // Adding pins to map
      $(() => {

        $("#addPoint").click((event) => {
          if (event.currentTarget.attributes.id.value === 'addPoint') {
            console.log(event.currentTarget.attributes.id.value);
            console.log('addpoint button clicked')
            addMarker({
              lat: coordsArray[0],
              lng: coordsArray[1],
              mapTitle: escape($("#mapTitle").val()),
              title: escape($("#title").val()),
              description: escape($("#description").val()),
              image: escape($("#image").val())
            }, map);
            coordsArray = [];
            $(".table").append(`
              <tr>
              <th scope="row"> ${$("table tr").length} </th>
              <td> ${$("#title").val()} </td>
              <td> ${$("#description").val()} </td>
              <td> <a class="btn btn-danger" id= "deleteMarker" data-mapid = "<%= map.id %>" data-marker = "<%= map.pinname %>"> Delete </a> </td>
              </tr>
            `);
            $("#pac-input").val("");
            $("#title").val("");
            $("#description").val("");
            $("#image").val("");
          } else {
              event.preventDefault();
              const mapID = $("#mapTitle").data("mapid");
              const mapTitle = $("#mapTitle").data("maptitle");
              const pinTitle = $("#title").data("pintitle");
              const pinDescription = $("#description").data("pindescription");
              const pinImage = $("#image").data("pinimage");
              console.log(mapID, mapTitle, pinTitle, pinDescription, pinImage )
              $.ajax({
                url: `/edit/${mapID}/${mapTitle}/${pinTitle}/${pinDescription}/${pinImage}`,
                method: "POST",
              })
              .then(res => {
                console.log(res);
              })
              .catch(err => {
                console.log(err);
              })
            }
        })


        // Sending map and markers array to the database
        $("#createMap").click(() => {
          // console.log('markers array',markers)
          $.post("http://localhost:8080/new",
            {
              mapInfo: mapInfo,
              pins: pins
            },
            function (data, status) {
              console.log(data)
            });
            window.location.replace("http://localhost:8080/");
        })
      })

      // $(() => {
      //   $("#pac-input").click(() => {
      //     console.log('point clicked.  Not added.')
      //     marker.setMap(null);
      //   })
      // });

      $(document).ready(() => {
        console.log('made it before');
        $("#createMap").submit(function (event) {
          event.preventDefault();
          console.log('made it after');
          console.log('create map submitted!');
        });
      });


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
      markers.push(marker);
      console.log('markers', markers);

      // adding pins for database
      const name = location.title;
      const description = location.description;
      const lat = location.lat;
      const lng = location.lng;
      const image = location.image;
      // get map_id from route query
      // const map_id = 1;
      // const user_id = 1;

      mapInfo.name = location.mapTitle;
      const pin = { name, description, lat, lng, image };

      pins.push(pin);
      console.log('pins', pins)

      google.maps.event.addListener(marker, 'click', function () {
        infowindow.close(); // Close previously opened infowindow
        infowindow.setContent(
          '<h4>' + location.title + '</h4>' +
          '<p>' + location.description + '</p>' +
          '<p id = "markerImage"> <img src = ' + location.image + '></p>',
        );
        infowindow.open(map, marker);
        $("#title").val(location.title);
        $("#description").val(location.description);
        $('#addPoint').val("Edit Point");
      });
    }

    const escape = str => {
      let div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }

    initMap();


  })

})
