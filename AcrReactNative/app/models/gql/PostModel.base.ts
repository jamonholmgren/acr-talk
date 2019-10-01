/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */

import { types } from "mobx-state-tree"
import { MSTGQLObject, QueryBuilder } from "mst-gql"
import { RootStoreType } from "./index"


/**
 * PostBase
 * auto generated base class for the model PostModel.
 */
export const PostModelBase = MSTGQLObject
  .named('Post')
  .props({
    __typename: types.optional(types.literal("Post"), "Post"),
    body: types.maybeNull(types.string),
    id: types.identifier,
    title: types.maybeNull(types.string),
  })
  .views(self => ({
    get store() {
      return self.__getStore<RootStoreType>()
    }
  }))

export class PostModelSelector extends QueryBuilder {
  get body() { return this.__attr(`body`) }
  get id() { return this.__attr(`id`) }
  get title() { return this.__attr(`title`) }
}
export function selectFromPost() {
  return new PostModelSelector()
}

export const postModelPrimitives = selectFromPost().body.title
