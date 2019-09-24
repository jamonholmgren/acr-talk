/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from "mobx-state-tree"
import { MSTGQLStore, configureStoreMixin, QueryOptions } from "mst-gql"

import { PostModel, PostModelType } from "./PostModel"
import { postModelPrimitives, PostModelSelector } from "./PostModel.base"
import { CommentModel, CommentModelType } from "./CommentModel"
import { commentModelPrimitives, CommentModelSelector } from "./CommentModel.base"
import { DeletePostPayloadModel, DeletePostPayloadModelType } from "./DeletePostPayloadModel"
import { deletePostPayloadModelPrimitives, DeletePostPayloadModelSelector } from "./DeletePostPayloadModel.base"


export type DeletePostInput = {
  clientMutationId: string | undefined
  id: string
}
/**
* Store, managing, among others, all the objects received through graphQL
*/
export const RootStoreBase = MSTGQLStore
  .named("RootStore")
  .extend(configureStoreMixin([['Post', () => PostModel], ['Comment', () => CommentModel], ['DeletePostPayload', () => DeletePostPayloadModel]], ['Post', 'Comment']))
  .props({
    posts: types.optional(types.map(types.late(() => PostModel)), {}),
    comments: types.optional(types.map(types.late(() => CommentModel)), {})
  })
  .actions(self => ({
    // Find a post by ID
    queryPost(variables: { id: string }, resultSelector: string | ((qb: PostModelSelector) => PostModelSelector) = postModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ post: PostModelType}>(`query post($id: ID!) { post(id: $id) {
        ${typeof resultSelector === "function" ? resultSelector(new PostModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    // Find all posts
    queryPosts(variables?: {  }, resultSelector: string | ((qb: PostModelSelector) => PostModelSelector) = postModelPrimitives.toString(), options: QueryOptions = {}) {
      return self.query<{ posts: PostModelType[]}>(`query posts { posts {
        ${typeof resultSelector === "function" ? resultSelector(new PostModelSelector()).toString() : resultSelector}
      } }`, variables, options)
    },
    mutateDeletePost(variables: { input: DeletePostInput }, resultSelector: string | ((qb: DeletePostPayloadModelSelector) => DeletePostPayloadModelSelector) = deletePostPayloadModelPrimitives.toString(), optimisticUpdate?: () => void) {
      return self.mutate<{ deletePost: DeletePostPayloadModelType}>(`mutation deletePost($input: DeletePostInput!) { deletePost(input: $input) {
        ${typeof resultSelector === "function" ? resultSelector(new DeletePostPayloadModelSelector()).toString() : resultSelector}
      } }`, variables, optimisticUpdate)
    },
  }))
