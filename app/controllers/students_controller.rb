class StudentsController < ApplicationController
	def create
		student = Student.create(name: params[:name], sex: params[:sex], teacher_id: params[:teacher_id].to_i)
		render text: student.id
	end

	def show

		if !Student.exists?(params[:id]) 
			flash[:notice] = "No such student"
			redirect_to '/'
		elsif Student.find(params[:id]).teacher_id != @user.id
			flash[:notice] = "Access denied."
			redirect_to '/'
		else
			@student = Student.find(params[:id])
			@comments = Comment.where(student_id: @student.id).order("created_at").reverse
			@json_comments = @comments.to_json
			@student_classrooms = Array.new
			classrooms = Classroom.where(teacher_id: @user.id)
			classrooms.each do |cr|
				cr.students_layout_csv.split(",").each_slice(5).to_a.each do |student|
					if student[1].to_i == @student.id
						@student_classrooms << {name: cr.name, id: cr.id}
					end
				end
			end
			if @user.tags_csv
				@tags = @user.tags_csv.split(",")
			else
				@tags = []
			end
		end

	end

	def info
		student = Student.find(params[:id])
		raw_comments = Comment.where(student_id: params[:id])
		comments = []
		raw_comments.each do |comment|
			comments << {title: comment.title, 
									content: comment.content,
									disposition: comment.disposition}

		end
		render json: {name: student.name, sex: student.sex, comments: comments, id: student.id}
	end

	def check_sex
		id = params[:id].split(":")[0].to_i
		student = Student.find(id)
		render json: {sex: student.sex, page_id: params[:id].split(":")[1], name: student.name}
	end

	def fetch
		students = Student.where(teacher_id: @user.id).order("name")
		return_array = []
		students.each do |std|
			sex = "m"
			if std.sex == "female"
				sex = "f"
			end
			return_array.push([std.id, std.name, sex])
		end
		render json: {array: return_array}
	end
end
