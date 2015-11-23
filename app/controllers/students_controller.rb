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
end
