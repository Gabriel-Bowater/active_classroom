class SessionsController < ApplicationController
	protect_from_forgery with: :exception
	
	def create
		user_id = params[:id]
		password = params[:password]
		if User.exists?(email: user_id)
			account = User.find_by(email: user_id)
		elsif User.exists?(username: user_id)
			account = User.find_by(username: user_id)
		end

		if account && account.password== password
			@user = account
			session[:user_id] = @user.id
			flash[:notice] = "Welcome #{@user.username}!"
			render text: "Login successful"
		elsif account
			flash[:notice] = "Incorrect password. Forgotten your password? <a href='#'>Click here</a>.".html_safe
			render text: "Login unsuccesful - Incorrect password"
			session[:user_id] = nil
		else
			flash[:notice] = "User not found."
			render text: "Login unsuccesful - User not found."
			session[:user_id] = nil
		end
	end

	def destroy
		@user = nil
		session[:user_id] = nil
		redirect_to '/'		
	end
end
