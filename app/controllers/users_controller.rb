class UsersController < ApplicationController

	def create
		username = params[:username]
		password = params[:password]
		email = params[:email]
		@user = User.new(username: username, email: email)
		@user.password = password
		if @user.save!
			flash[:notice] = "User #{username} created! Please log in."
			render text: "success!"
		else
			flash[:notice] = "Something went wrong :("
			render text: "FAIL!"
		end
	end

	def show
		if !@user
			redirect_to "/"
		end

		@classrooms = Classroom.where(teacher_id: @user.id)
		@students = [] #TODO grab teacher's students

	end

end
