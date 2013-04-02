class ApplicationController < ActionController::Base
  protect_from_forgery

  def after_sign_in_path_for(user)
	 user_links_path(current_user.username)
  end
end
