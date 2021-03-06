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
			@student_images = get_student_thumbs(@students)
		else
			redirect_to "/"
		end
		if @user.tags_csv
			@tags = @user.tags_csv.split(",")
		else
			@tags = []
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
			puts params[:tables]
			classroom.update(students_layout_csv: params[:students], tables_layout_csv: params[:tables])
			render text: "Classroom updated"
		end	
	end

	def edit
		if Classroom.exists?(params[:id]) && @user && Classroom.find(params[:id]).teacher_id == @user.id
			@classroom = Classroom.find(params[:id])
			@tables = @classroom.tables_layout_csv.split(",").each_slice(6).to_a
			@students = @classroom.students_layout_csv.split(",").each_slice(5).to_a
			@student_images = get_student_thumbs(@students)
		else
			redirect_to "/"
		end
	end

 private

 def get_student_thumbs(students)
 	return_hash = Hash.new
 	students.each do |student|
 		if student[1] != "unset"
 		std = Student.find(student[1])
 			if std.avatar_file_name
 				return_hash["#{student[1]}"] = std.avatar.url(:thumb)
 			end
 		end
 	end
 	return_hash.to_json
 end

end
