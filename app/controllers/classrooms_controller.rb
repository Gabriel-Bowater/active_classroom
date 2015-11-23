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

	def destroy
		if !@user
			redirect_to '/'
		end
		classroom = Classroom.find(params[:id])
		if classroom.teacher_id == @user.id
			class_name = classroom.name
			classroom.destroy
			flash[:notice] = "Classroom #{class_name} deleted."
		else
			flash[:notice] = "You can only delete your own classrooms"
		end
		redirect_to "/users/#{@user.id}"
	end

	def update
		classroom = Classroom.find(params[:id])
		if !params[:tables]
			classroom.update(students_layout_csv: params[:students])
			render text: "Students updated"
		elsif params[:tables] && params[:students]
				classroom.upate(students_layout_csv: params[:students], tables_layout_csv: params[:tables])
		end	
	end

	def edit
		if Classroom.exists?(params[:id]) && @user && Classroom.find(params[:id]).teacher_id == @user.id
			@classroom = Classroom.find(params[:id])
			@tables = @classroom.tables_layout_csv.split(",").each_slice(6).to_a
			@students = @classroom.students_layout_csv.split(",").each_slice(5).to_a
		else
			redirect_to "/"
		end
	end
end
