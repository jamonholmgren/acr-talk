module Types
  class MutationType < Types::BaseObject
    field :deletePost, mutation: Mutations::DeletePost
    # TODO: remove me
    field :test_field, String, null: false,
                               description: "An example field added by the generator"

    def test_field
      "Hello World"
    end
  end
end
