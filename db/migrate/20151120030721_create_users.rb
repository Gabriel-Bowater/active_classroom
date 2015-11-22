class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
    	t.string :email, null: false, uniqueness: true
    	t.string :username, null: false, uniqueness: true
      t.string :password_hash
      t.boolean :email_confirmed, null: false, default: false
      t.timestamps null: false
    end
  end
end
