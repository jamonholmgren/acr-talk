/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { MSTGQLObject, MSTGQLRef, QueryBuilder } from "mst-gql"
import { PostModel } from "./PostModel"
import { PostModelSelector } from "./PostModel.base"
import { RootStoreType } from "./index"


/**
 * CommentBase
 * auto generated base class for the model CommentModel.
 */
export const CommentModelBase = MSTGQLObject
  .named('Comment')
  .props({
    __typename: types.optional(types.literal("Comment"), "Comment"),
    id: types.identifier,
    post: types.maybeNull(MSTGQLRef(types.late(() => PostModel))),
    title: types.maybeNull(types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class CommentModelSelector extends QueryBuilder {
  get id() { return this.__attr(`id`) }
  get title() { return this.__attr(`title`) }
  post(builder?: string | PostModelSelector | ((selector: PostModelSelector) => PostModelSelector)) { return this.__child(`post`, PostModelSelector, builder) }
}
export function selectFromComment() {
  return new CommentModelSelector()
}

export const commentModelPrimitives = selectFromComment().title
