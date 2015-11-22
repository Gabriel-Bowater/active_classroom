class UsersController < ApplicationController

	def create
		username = params[:username]
		password = params[:password]
		email = params[:email]
		@user = User.new(username: username, email: email)
		@user.password = password
		if @user.save!
			flash[:notice] = "Welcome user #{username}!"
			render text: "success!"
		else
			flash[:notice] = "Something went wrong :("
			render text: "FAIL!"
		end
	end
end
