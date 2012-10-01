# Load the rails application
require File.expand_path('../application', __FILE__)
require 'pusher'

# Initialize the rails application
FbGraphSample::Application.initialize!
Pusher.app_id = '2876'
Pusher.key = '1788ddd577a009576b70'
Pusher.secret = 'b54d8b564d0ac669d727'

