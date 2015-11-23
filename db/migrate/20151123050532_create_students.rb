class CreateStudents < ActiveRecord::Migration
  def change
    create_table :students do |t|
      t.text :name
      t.text :sex
      t.integer :teacher_id

      t.timestamps null: false
    end
  end
end
