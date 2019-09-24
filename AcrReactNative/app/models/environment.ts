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
