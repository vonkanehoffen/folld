class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :username

  validates_presence_of :username
  validates_exclusion_of :username, :in => %w(tag admin user users), :message => 'Sorry, that user name is reserved.'
  # Note: %w is shorthand for ['some', 'thing']

  has_many :links
end
