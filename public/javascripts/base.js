var FACEBOOK_USER_ID = '4';
var markers = {};

FB.getLoginStatus(function(response) {
  if (response.status === 'connected') {
    FACEBOOK_USER_ID = response.authResponse.userID;
    initialize();
  } else {
    FB.Event.subscribe('auth.login', function(response) {
      FACEBOOK_USER_ID = response.userID;
      initialize();
    });
  }
});

function drawFriendLocations(friends) {
  console.log(friends);
  for (var i = 0; i < friends.length; i++) {
    updateMarker(friends[i]);
  }
}
function getFriendLocations() {
  $.get('/friends_locations', {
    dataType: 'json'
  }).done(drawFriendLocations);
}


function initialize() {
  navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError, {enableHighAccuracy:true, maximumAge:30000, timeout:27000});
  getFriendLocations();
}

function doStuff() {
  drawFriendLocations([{id: '4', lat: 55.741, lng: 37.60}]);
}


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

//  doStuff();
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
      title: 'X',
      map: map,
      icon: 'http://graph.facebook.com/' + data.id + '/picture'
    });
  }

  marker.setPosition(latLng);
}


function onGeolocationError(error) {
  console.error(error.message, error.code);
}

// Onload handler to fire off the app.
//google.maps.event.addDomListener(window, 'load', initialize);


Pusher.log = function(message) {
  if (window.console && window.console.log) window.console.log(message);
};

// Flash fallback logging - don't include this in production
WEB_SOCKET_DEBUG = true;


//var pusher = new Pusher('e21f8ca0d837d602f711');
//var channel = pusher.subscribe('test_channel');

// friends looks like [{id: 538958898, lat: 1, lng: 2}]
//channel.bind('my_event', function(friends) {
//  for (var i = 0; i < friends.length; i++) {
//    updateMarker(friends[i]);
//  }
//});
