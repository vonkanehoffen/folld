class Link < ActiveRecord::Base
  attr_accessible :description, :private, :title, :uri, :tag_list
  acts_as_taggable
  belongs_to :user
end
