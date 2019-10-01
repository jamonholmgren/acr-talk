# Ancient City Ruby, Rails, React 2019

This is the repo for the live coding talk by [Jamon Holmgren](https://twitter.com/jamonholmgren) and [Morgan Laco](https://twitter.com/morgancodes).

## Rails App -- Part 1

* Go in the `./AcrRails` folder
* You'll need the latest Ruby and Yarn installed

### Setup

* Start from `master` branch
* Add `gem "graphql"` to the Gemfile if it's not already there
* Run `bundle install`
* Run `yarn`
* Run `rails g graphql:install`
* Run `rails g scaffold Post title:string body:string`
* Run `rails db:migrate`

### Create GraphQL types and query

* Run `rails g graphql:object Post id:ID title:String body:String`
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
    body
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
* Run `yarn add mst-gql@0.4.1 graphql-request@1.8.2 react-dom@16.9.0`
* Now we want to generate our MST models from our GraphQL dump file.
* Run `yarn mst-gql --format ts ../AcrRails/acr.graphql --outDir=app/models/gql`
* Note: if you run it again, it'll skip some files and write to the .base files. It's idempotent; in other words, run as often as you'd like.
* Now we need to import the base MobX-State-Tree model to the RootStore properly. In `app/models/root-store/root-store.ts`:

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
  const { query } = useQuery(store => store.queryPosts())

  // ... in the JSX portion:
  <View>
    {Array.from(rootStore.posts).map(([k, p]) => (
      <Text key={k} style={CONTENT}>{p.title}</Text>
    ))}
  </View>

  // ... and update the continue button to allow refreshing:
  <SafeAreaView style={FOOTER}>
    <Button style={CONTINUE} textStyle={CONTINUE_TEXT} text="Refresh" onPress={query.refetch} />
  </SafeAreaView>
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

* Go back to the React Native app
* Run `yarn mst-gql --format ts ../AcrRails/acr.graphql --outDir=app/models/gql`
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

* Edit the `app/screens/welcome-screen/welcome-screen.tsx` file:

```typescript
// just above the JSX
const { setQuery } = useQuery()

// in the JSX, modify this section
return (
  <View style={FULL}>
    <Wallpaper />
    <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
      <View>
        {Array.from(rootStore.posts).map(([k, p]) => (
          <View key={k} style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 23 }}>{p.title}</Text>
            <TouchableOpacity onPress={()=> setQuery(rootStore.deletePost(p.id))}>
              <Text style={{ fontSize: 16 }}> - Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </Screen>

    <SafeAreaView style={FOOTER}>
      <Button style={CONTINUE} textStyle={CONTINUE_TEXT} text="Refresh" onPress={query.refetch} />
    </SafeAreaView>
  </View>
)
```

* Now, when you refresh, you should be able to delete posts!

### Cleanup/Start Over

* Run `rails db:reset`
* Run `rm ./db/schema.rb`
* Now either start from `master` or:
 - Run `rails d scaffold Post`
 - Run `rails d graphql:object Post`
