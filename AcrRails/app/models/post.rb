class Post < ApplicationRecord
  has_many :comments, dependent: :delete_all
end
