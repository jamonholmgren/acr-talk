# Ancient City Ruby, Rails, React 2019

This is the repo for the live coding talk by [Jamon Holmgren](https://twitter.com/jamonholmgren) and [Morgan Laco](https://twitter.com/morgancodes).

## Rails App -- Part 1

* Go in the `./AcrRails` folder
* You'll need the latest Ruby and Yarn installed

### Setup

* Start from `master` branch
* Run `bundle install`
* Run `yarn`
* Run `rails g graphql:install`
* Run `rails g scaffold Post title:string`
* Run `rails db:migrate`

### Create GraphQL types and query

* Run `rails g graphql:object Post id:ID title:String`
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

* Run `rails server`
* In a new tab, visit http://localhost:3000/posts/new
* In a new tab, visit http://localhost:3000/graphiql and type in:

```graphql
{
  posts {
    id
    title
  }
}
```

### Dump the GraphQL Schema file

* Run `rails g task graphql dump`
* Edit `lib/tasks/graphql.rake`:

```ruby
namespace :graphql do
  desc "Dump GraphQL Schema File"
  task dump: :environment do
    schema_dump = AcrRailsSchema.to_definition
    schema_path = Rails.root.join("./acr.graphql")
    File.write(schema_path, schema_dump)
    puts schema_path
  end
end
```

* Run `rake graphql:dump`
* You'll see the path of the new schema file.
* Edit the `app/controllers/graphql_controller.rb` file to remove the CSRF protection so we can use it as an API:

```ruby
class GraphqlController < ApplicationController
  protect_from_forgery with: :null_session

  # ...
end
```

## React Native -- Part 1

* Now switch to the `AcrReactNative` directory.
* You'll need the latest Yarn and CocoaPods installed.

### Setup

* Run `yarn` and `cd ios; pod install; cd -`
* Run `yarn add mst-gql graphql-request`
* Run `yarn mst-gql --format ts ../AcrRails/acr.graphql --outDir=app/models/gql`
* Note: if you run it again, it'll skip some files and write to the .base files. It's idempotent; in other words, run as often as you'd like.
* Now we need to import the base MobX-State-Tree model to the RootStore properly. In `app/models/root-store/root-store.ts`:
* Run `yarn add -D react-dom`

```typescript
// .. omitted above

import { RootStoreBase } from "../gql/RootStore.base"

/**
 * A RootStore model.
 */
export const RootStoreModel = RootStoreBase.props({
  navigationStore: types.optional(NavigationStoreModel, {}),
})

// .. omitted below
```

* Let's set up the API connection. In `app/models/environment.ts`, remove anything to do with the API, and in the constructor, point to the running localhost server:

```typescript
import { Reactotron } from "../services/reactotron"
import { createHttpClient } from "mst-gql"
import { GraphQLClient } from "graphql-request"

export class Environment {
  reactotron: Reactotron
  gqlHttpClient: GraphQLClient

  constructor() {
    this.reactotron = new Reactotron()
    this.gqlHttpClient = createHttpClient("http://localhost:3000/graphql")
  }

  async setup() {
    await this.reactotron.setup()
  }
}
```

* Ensure that MST is using the right context by editing `app/models/root-store/root-store-context.ts`:

```typescript
import { createStoreContext, createUseQueryHook } from "mst-gql"
import React from "react"

export const RootStoreContext = createStoreContext<RootStore>(React)
export const useQuery = createUseQueryHook(RootStoreContext, React)
```

* Edit `app/screens/welcome-screen/welcome-screen.tsx` to show the posts:

```typescript
// ...
import { useStores, useQuery } from "../../models/root-store"

// ...
export const WelcomeScreen: React.FunctionComponent<WelcomeScreenProps> = observer(props => {
  const rootStore = useStores()

  const { error, data, loading, query } = useQuery(store => store.queryPosts())

  if (error) return <Text>{error.message}</Text>
  if (!data || loading) return <Text>"Loading..."</Text>

  // ... in the JSX portion:
    <View>
      {Array.from(rootStore.posts).map(([k, p]) => (
        <Text key={k} style={CONTENT}>
          {p.title}
        </Text>
      ))}
    </View>

  // ... and update the continue button to allow refreshing:
    <Button
      style={CONTINUE}
      textStyle={CONTINUE_TEXT}
      text={loading ? "Refreshing" : "Refresh"}
      onPress={query!.refetch}
    />
```

## Rails -- Part 2

* Now let's go back to the Rails app and create a new mutation to allow us to delete posts.
* Run `rails g graphql:mutation DeletePost`
* Edit `app/graphql/mutations/delete_post.rb`:

```ruby
module Mutations
  class DeletePost < GraphQL::Schema::RelayClassicMutation
    graphql_name "DeletePost"

    field :post, Types::PostType, null: true
    field :result, Boolean, null: true

    argument :id, ID, required: true

    def resolve(**args)
      post = Post.find(args[:id])
      post.destroy
      {
        post: post,
        result: post.errors.blank?,
      }
    end
  end
end
```

* Now rerun the rake query dump task and mst-gql generator:
* Run `rake graphql:dump`


## React Native -- Part 2

* Run `yarn mst-gql --format ts ../AcrRails/acr.graphql --outDir=app/models/gql`
* Back in the React Native app, edit the `app/screens/welcome-screen/welcome-screen.tsx` file:

```typescript

// just above the JSX
const { setQuery } = useQuery()

// in the JSX, modify this section
{Array.from(rootStore.posts).map(([k, p]) => (
  <View key={k}>
    <Text style={CONTENT}>{p.title}</Text>
    <TouchableOpacity
      onPress={() =>
        setQuery(rootStore.deletePost(p.id))
      }
    >
      <Text>DEL</Text>
    </TouchableOpacity>
  </View>
))}
```

* Edit `app/models/root-store/root-store.ts` to add the `deletePost` action:

```typescript
export const RootStoreModel = RootStoreBase.props({
  navigationStore: types.optional(NavigationStoreModel, {}),
}).actions(self => ({
  deletePost(id: string) {
    return self.mutateDeletePost({ input: { id } }, undefined, () => self.posts.delete(id))
  },
}))
```

* Now, when you refresh, you should be able to delete posts!

### Cleanup/Start Over

* Run `rails db:reset`
* Run `rm ./db/schema.rb`
* Now either start from `master` or:
 - Run `rails d scaffold Post`
 - Run `rails d graphql:object Post`
