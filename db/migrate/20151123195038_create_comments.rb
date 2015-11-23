class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.integer :teacher_id
      t.integer :student_id
      t.string :title
      t.text :content
      t.string :disposition

      t.timestamps null: false
    end
  end
end
