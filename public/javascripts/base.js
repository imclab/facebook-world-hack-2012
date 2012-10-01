var FACEBOOK_USER_ID = 538958898; // Nikita Vasilyev's user id


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


var markers = {};

function onGeolocationSuccess(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  var latLng = new google.maps.LatLng(latitude, longitude);
  var map = window.map = new google.maps.Map(document.getElementById('mapCanvas'), {
    zoom: 14,
    center: latLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  var marker = new google.maps.Marker({
    position: latLng,
    title: 'Point A',
    map: map,
    icon: 'http://graph.facebook.com/' + FACEBOOK_USER_ID + '/picture'
  });

  setMyLocation(latitude, longitude);

  // Update current position info.
  updateMarkerPosition(latLng);
  geocodePosition(latLng);

  navigator.geolocation.watchPosition(function(pos) {
    if (pos.coords.latitude != latitude || pos.coords.longitude != longitude) {
      latitude = pos.coords.latitude;
      longitude = pos.coords.longitude;

      setMyLocation(latitude, longitude);

      var latLng = new google.maps.LatLng(latitude, longitude);
      marker.setPosition(latLng);
      map.setCenter(latLng);
    }
  });

}


function setMyLocation(lat, lng) {
  markers[FACEBOOK_USER_ID] = {
    lat: lat,
    lng: lng
  };
  $.ajax('/update_location', {
    type: 'GET',
    data: {lat: lat, lng: lng},
    success: function(){},
    dataType: 'json'
  });
}

function updateMarker(data) {
  var marker = markers[data.id];
  var latLng = new google.maps.LatLng(data.lat, data.lng);

  if (!marker) {
    markers[data.id] = marker = new google.maps.Marker({
      position: latLng,
      title: 'Point A',
      map: map,
      icon: 'http://graph.facebook.com/' + FACEBOOK_USER_ID + '/picture'
    });
  }

  marker.setPosition(latLng);
}



function onGeolocationError(error) {
  console.error(error.message, error.code);
}

// Onload handler to fire off the app.
google.maps.event.addDomListener(window, 'load', initialize);


Pusher.log = function(message) {
  if (window.console && window.console.log) window.console.log(message);
};

// Flash fallback logging - don't include this in production
WEB_SOCKET_DEBUG = true;

var pusher = new Pusher('e21f8ca0d837d602f711');
var channel = pusher.subscribe('test_channel');

// friends looks like [{id: 538958898, lat: 1, lng: 2}]
channel.bind('my_event', function(friends) {
  for (var i = 0; i < friends.length; i++) {
    updateMarker(friends[i]);
  }
});
