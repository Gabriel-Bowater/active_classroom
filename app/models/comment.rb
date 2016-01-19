class Comment < ActiveRecord::Base
	has_one :action_required_ticket
end
