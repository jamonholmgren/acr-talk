module Types
  class PostType < Types::BaseObject
    field :id, ID, null: true
    field :title, String, null: true
    field :body, String, null: true
  end
end
