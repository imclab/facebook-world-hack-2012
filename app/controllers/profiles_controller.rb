class ProfilesController < ApplicationController
  before_filter :require_authentication

  def show
  end

  def update_location
  	latitude = 40
  	longitude = 20
  	identifier = current_user.identifier
  	location = Location.find_or_create_by_identifier(identifier: identifier)
  	location.update_attributes(latitude: latitude, longitude: longitude)
  	redirect_to dashboard_url
  end
end
