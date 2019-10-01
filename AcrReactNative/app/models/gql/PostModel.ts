import { Instance } from "mobx-state-tree"
import { PostModelBase } from "./PostModel.base"

/* The TypeScript type of an instance of PostModel */
export interface PostModelType extends Instance<typeof PostModel.Type> {}

/* A graphql query fragment builders for PostModel */
export { selectFromPost, postModelPrimitives, PostModelSelector } from "./PostModel.base"

/**
 * PostModel
 */
export const PostModel = PostModelBase
  .actions(self => ({
    // This is an auto-generated example action.
    log() {
      console.log(JSON.stringify(self))
    }
  }))
