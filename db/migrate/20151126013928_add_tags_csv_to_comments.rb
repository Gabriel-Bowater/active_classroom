class AddTagsCsvToComments < ActiveRecord::Migration
  def change
    add_column :comments, :tags_csv, :text
  end
end
