# README

## ACR Checklist

### Initial setup

* Start from `master` branch
* rails g graphql:install
* rails g scaffold Post title:string rating:integer
* rails g scaffold Comment post:references
* Edit models/post.rb:

```ruby
class Post < ApplicationRecord
  has_many :comments
end
```

* rails db:migrate

### Create GraphQL types and query

* rails g graphql:object Post id:ID title:String rating:Int "comments:[Comment]"
* rails g graphql:object Comment id:ID title:String post:Post

```ruby
module Types
  class CommentType < Types::BaseObject
    field :id, ID, null: false
    field :post, PostType, null: false
  end
end
```

* Edit `graphql/types/query_type.rb`:

```ruby
module Types
  class QueryType < Types::BaseObject
    field :post, PostType, null: true do
      description "Find a post by ID"
      argument :id, ID, required: true
    end

    def posts
      Post.all
    end

    def post(id:)
      Post.find(id)
    end
  end
end
```

### Check it out!

* rails server
* In a new tab, visit http://localhost:3000/posts/new
* Visit http://localhost:3000/graphiql and type in:

```
{
  post(1)
}
```

### Cleanup

* rails db:reset 
