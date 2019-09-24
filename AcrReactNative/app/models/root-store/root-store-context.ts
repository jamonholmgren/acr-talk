import { createContext, useContext } from "react"
import { RootStore } from "./root-store"
import { createStoreContext, createUseQueryHook } from "mst-gql"
import React from "react"

/**
 * Create a context we can use to
 * - Provide access to our stores from our root component
 * - Consume stores in our screens (or other components, though it's
 *   preferable to just connect screens)
 */
export const RootStoreContext = createStoreContext<RootStore>(React)

/**
 * Query hook for GraphQL.
 */
export const useQuery = createUseQueryHook(RootStoreContext, React)

/**
 * The provider our root component will use to expose the root store
 */
export const RootStoreProvider = RootStoreContext.Provider

/**
 * A hook that screens can use to gain access to our stores, with
 * `const { someStore, someOtherStore } = useStores()`,
 * or less likely: `const rootStore = useStores()`
 */
export const useStores = () => useContext(RootStoreContext)
