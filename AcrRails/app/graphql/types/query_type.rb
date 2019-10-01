module Types
  class QueryType < Types::BaseObject
    field :posts, [PostType], null: true do
      description "Find all posts"
    end

    def posts
      Post.all
    end

    field :post, PostType, null: true do
      description "Find a post by ID"
      argument :id, ID, required: true
    end

    def post(id:)
      Post.find(id)
    end
  end
end