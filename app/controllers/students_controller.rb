class StudentsController < ApplicationController
	def create
		student = Student.create(name: params[:name], sex: params[:sex], teacher_id: params[:teacher_id].to_i)
		render text: student.id
	end

	def info
		student = Student.find(params[:id])
		#comments = Comment.where(student_id: params[:id])
		render json: {name: student.name, sex: student.sex}
	end
end
