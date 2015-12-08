class Student < ActiveRecord::Base

	has_attached_file :avatar, :styles => {:thumb => '100x133', :medium => '200x266'}
	validates_attachment_content_type :avatar, :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif"]
	crop_attached_file :avatar, :aspect => "3:4"

end
