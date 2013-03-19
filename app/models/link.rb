class Link < ActiveRecord::Base
  attr_accessible :description, :private, :title, :uri, :tag_list
  
  validates_presence_of :title
  
  validates_each :uri do |record, attr, value|
  	if !(value =~ URI::regexp)
	  	record.errors.add(attr, 'Must be a valid URL')
  	end
  end
  
  acts_as_taggable
  belongs_to :user
end
