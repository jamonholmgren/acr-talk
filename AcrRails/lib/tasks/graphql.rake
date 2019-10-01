namespace :graphql do
  desc "Dump GraphQL Schema File"
  task dump: :environment do
    schema_dump = AcrRailsSchema.to_definition
    schema_path = Rails.root.join("./acr.graphql")
    File.write(schema_path, schema_dump)
    puts schema_path
  end
end