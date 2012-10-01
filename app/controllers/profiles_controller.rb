class ProfilesController < ApplicationController
  before_filter :require_authentication

  def show
  end

  def update_location
    location = Location.find_or_create_by_identifier(current_user.identifier)
  	location.update_attributes(:latitude => params[:lat], :longitude => params[:lng])
    render :nothing => true
  end

  def friends_with_app(uid = 'me()')
  	friend_data = FbGraph::Query.new("Select uid from user where is_app_user = 1 and uid in (select uid2 from friend where uid1 = #{uid}) order by concat(first_name,last_name) asc")
  	friend_data.fetch(current_user.access_token).collect{|u| u['uid'].to_s}
  end

  def friends_locations
    locations = []
  	Location.where(:identifier => friends_with_app).each do |loc|
      locations << {:id => loc.identifier, :lat => loc.latitude, :lng => loc.longitude}
    end
  	render :js => locations.to_json
  end

#  def prepare_pusher_data(my_uid, friend_uids)
#  	friend_uids.each do |friend_uid|
#  	end
#  end
end
