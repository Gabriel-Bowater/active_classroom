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
		if @user.tags_csv
			@tags = @user.tags_csv.split(",")
		else
			@tags = []
		end
		@classrooms = Classroom.where(teacher_id: @user.id)
		@students = Student.where(teacher_id: @user.id).order("name")
		@comments = Comment.where(teacher_id: @user.id)
		@json_comments = @comments.to_json

	end

	def update
		#add a tag
		if params[:tag] && @user && params[:id].to_i == @user.id
			
			if User.find(@user.id).tags_csv
				tags = User.find(@user.id).tags_csv.split(",")
			else
				tags = []
			end

			if tags.include?(params[:tag])
				render text: "tag already exists"
			else
				tags << params[:tag]
				User.find(@user.id).update(tags_csv: tags.join(","))
				render json: {tags: tags}
			end
		else
			render text: params
		end
	end

end
