class AddTagsCsvToUsers < ActiveRecord::Migration
  def change
    add_column :users, :tags_csv, :text
  end
end
