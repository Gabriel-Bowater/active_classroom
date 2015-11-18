class CreateClassrooms < ActiveRecord::Migration
  def change
    create_table :classrooms do |t|

    	t.string :name, null: false
    	t.integer :teacher_id, null: false
    	t.text :classroom_layout_csv


      t.timestamps null: false
    end
  end
end
