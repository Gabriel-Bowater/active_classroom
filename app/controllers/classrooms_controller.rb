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
		if Classroom.exists?(params[:id])
			@classroom = Classroom.find(params[:id])
			@tables = @classroom.tables_layout_csv.split(",").each_slice(6).to_a
			@students = @classroom.students_layout_csv.split(",").each_slice(5).to_a
		else
			redirect_to "/"
		end
	end
end
