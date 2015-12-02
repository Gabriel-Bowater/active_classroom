class StudentsController < ApplicationController
	def create
		student = Student.create(name: params[:name], sex: params[:sex], teacher_id: params[:teacher_id].to_i)
		render text: student.id
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
		render json: {name: student.name, sex: student.sex, comments: comments}
	end

	def check_sex
		id = params[:id].split(":")[0].to_i
		student = Student.find(id)
		render json: {sex: student.sex, page_id: params[:id].split(":")[1]}
	end

	def fetch
		students = Student.where(teacher_id: @user.id)
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
