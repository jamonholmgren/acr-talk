# Ancient City Ruby, Rails, React 2019

This is the repo for the live coding talk by [Jamon Holmgren](https://twitter.com/jamonholmgren) and [Morgan Laco](https://twitter.com/morgancodes).

## Rails App

Go in the `./rails` folder and do the following.

### Initial setup

* Start from `master` branch
* rails g graphql:install
* rails g scaffold Post title:string rating:integer
* rails g scaffold Comment title:string post:references
* rails db:migrate
* Edit models/post.rb:

```ruby
class Post < ApplicationRecord
  has_many :comments
end
```

### Create GraphQL types and query

* rails g graphql:object Post id:ID title:String rating:Int "comments:[Comment]"
* rails g graphql:object Comment id:ID title:String post:Post
* Edit `graphql/types/query_type.rb`:

```ruby
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
```

### Check it out!

* rails server
* In a new tab, visit http://localhost:3000/posts/new
* Visit http://localhost:3000/graphiql and type in:

```graphql
{
  posts {
    id
    title
    rating
  }
}
```

### Add comments

* Visit http://localhost:3000/comments/new
* That won't do. Edit `views/comments/_form.html.erb` and replace the `post_id` field:

```html
  <div class="field">
    <%= form.label :post_id %>
    <%= form.collection_select(:post_id, Post.all, :id, :title) %>
  </div>
```

* Now add some comments to a post
* In graphiql:

```graphql
{
  posts {
    id
    title
    rating
    comments {
      id
      title
    }
  }
}
```

### Dump the GraphQL Schema file

* rails g task graphql dump
* In lib/tasks/graphql.rake:

```ruby
namespace :graphql do
  desc "Dump GraphQL Schema File"
  task dump: :environment do
    schema_dump = AcrRailsSchema.to_definition
    schema_path = Rails.root.join("./acr.schema")
    File.write(schema_path, schema_dump)
    puts schema_path
  end
end
```

* rake graphql:dump
* You'll see the path of the new schema file.

## React Native

* TODO

### Cleanup/Start Over

* rails db:reset
* rm ./db/schema.rb
* Now either start from `master` or:
 - rails d scaffold Comment
 - rails d scaffold Post
 - rails d graphql:object Comment
 - rails d graphql:object Post
