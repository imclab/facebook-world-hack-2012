var geocoder = new google.maps.Geocoder();

function geocodePosition(pos) {
  geocoder.geocode({
    latLng: pos
  }, function(responses) {
    if (responses && responses.length > 0) {
      updateMarkerAddress(responses[0].formatted_address);
    } else {
      updateMarkerAddress('Cannot determine address at this location.');
    }
  });
}

function updateMarkerStatus(str) {
  document.getElementById('markerStatus').innerHTML = str;
}

function updateMarkerPosition(latLng) {
  document.getElementById('info').innerHTML = [
    latLng.lat(),
    latLng.lng()
  ].join(', ');
}

function updateMarkerAddress(str) {
  document.getElementById('address').innerHTML = str;
}

function initialize() {
  navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError, {enableHighAccuracy:true, maximumAge:30000, timeout:27000});
}

function onGeolocationSuccess(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  var latLng = new google.maps.LatLng(latitude, longitude);
  var map = new google.maps.Map(document.getElementById('mapCanvas'), {
    zoom: 14,
    center: latLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  var marker = new google.maps.Marker({
    position: latLng,
    title: 'Point A',
    map: map
  });

  // Update current position info.
  updateMarkerPosition(latLng);
  geocodePosition(latLng);

  navigator.geolocation.watchPosition(function(pos) {
    if (pos.coords.latitude != latitude || pos.coords.longitude != longitude) {
      latitude = pos.coords.latitude;
      longitude = pos.coords.longitude;

      push(latitude, longitude);

      var latLng = new google.maps.LatLng(latitude, longitude);
      marker.setPosition(latLng);
      map.setCenter(latLng);
    }
  });

}


function push(latitude, longitude) {
  // Publish to Pusher
  // IMPLEMENT ME!
}



function onGeolocationError(error) {
  console.error(error.message, error.code);
}

// Onload handler to fire off the app.
google.maps.event.addDomListener(window, 'load', initialize);
