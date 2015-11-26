class CommentsController < ApplicationController
	def create
		if Comment.create(teacher_id: params[:teacher_id].to_i,
									student_id: params[:student_id].to_i,
									title: params[:title],
									content: params[:content],
									disposition: params[:disposition],
									tags_csv: params[:tags_csv])
			render text: "Comment created!"
		else
			render text: "I am error."
		end
	end
end
