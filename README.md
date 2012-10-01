# [Google Latitude](https://latitude.google.com/latitude/)-like service integrated with Facebook

A webpage with a map that shows your friends in real time.

Facebook had [FriendShake](https://www.facebook.com/friendsshake) at some point. It doesn't work anymore.


## TODO

**Map:**  
* Get current long/lat via [navigator.geolocation.getCurrentPositionDraw](http://diveintohtml5.info/geolocation.html)
* Display it as a marker on Gmaps
* Change marker position as you move
* Show friends

**Facebook App:**  
* Login on Facebook
* Get friends who use the app and show their coordinates on the map
* Send my coordinates to [Pusher](http://pusher.com/)
* Get friends' coordinates via Pusher

It's moot for me how to do the whole auth thing.