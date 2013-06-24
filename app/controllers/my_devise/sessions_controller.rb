class MyDevise::SessionsController < Devise::SessionsController

	# Note: Original one of these is in:
	# ~/.rvm/rubies/ruby-2.0.0-p0/lib/ruby/gems/2.0.0/gems/devise-2.2.3/app/controllers/devise/sessions_controller.rb
	
	respond_to :html, :js

	def new
		super
	end

	def create
		super
	end

	def destroy
		super
	end

end