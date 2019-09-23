namespace :graphql do
  desc "TODO"
  task dump: :environment do
    require "graphql/rake_task"
    GraphQL::RakeTask.new(schema_name: "AcrRails")
  end
end
