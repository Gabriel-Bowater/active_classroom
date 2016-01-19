class MakeArtTable < ActiveRecord::Migration
  def change
  	create_table :action_required_tickets do |t|
  		
  		t.integer :comment_id, null: false
  		t.boolean :completed, null: false, default: false

  		t.timestamps null: false
  	end

  end
end
