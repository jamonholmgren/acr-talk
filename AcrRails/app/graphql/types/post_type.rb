module Types
  class PostType < Types::BaseObject
    field :id, ID, null: true
    field :title, String, null: true
    field :rating, Integer, null: true
  end
end
