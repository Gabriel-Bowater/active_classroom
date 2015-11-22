class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :set_user

  def set_user
  	@user = nil

  	if session[:user_id] && User.exists?(session[:user_id])
  		p session[:user_id]
  		@user = User.find(session[:user_id])
  		p @user.username
  	else
  		@user = nil
  		session[:user_id]=nil
  	end
  end
end
