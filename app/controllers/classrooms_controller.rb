class ClassroomsController < ApplicationController
	def new
		@classroom = Classroom.new
	end

	def create
		new_class = Classroom.create(name: params[:class_name],
										teacher_id: params[:teacher_id].to_i,
										tables_layout_csv: params[:tables],
										students_layout_csv: params[:students])
		render text: new_class.id
	end

	def show
	end
end
