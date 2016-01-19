class CommentsController < ApplicationController
	def create

		action_ticket = ActionRequiredTicket.new
		action_ticket_persisted = false

		if comment = Comment.create(teacher_id: params[:teacher_id].to_i,
									student_id: params[:student_id].to_i,
									title: params[:title],
									content: params[:content],
									disposition: params[:disposition],
									tags_csv: params[:tags_csv])

			if params[:action_required] == "true"
				action_ticket.update(comment_id: comment.id)
				action_ticket.save
				action_ticket_persisted = true
			else
				action_ticket.destroy
			end
			return_text = "Comment created!"
			return_text += "Action ticket id : " + action_ticket.id.to_s if action_ticket_persisted
			render text: return_text
		else
			render text: "Comment failed to save."
		end
	end

	def follow_up_check
		ids = params[:comments_ids]
		return_ids = []
		ids.each do |id|
			if ActionRequiredTicket.find_by(comment_id: id.to_i) && !ActionRequiredTicket.find_by(comment_id: id.to_i).completed
				return_ids << id
			end
		end
		render text: return_ids
	end
end
