import { focusManager, MutationCache, QueryCache, QueryClient, QueryKey } from "@tanstack/react-query";
import { AppStateStatus } from "react-native";

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { MMKVStoragePersister } from "./storage/mmkv";

export const queryCacheManager = new QueryCache();
export const mutationCacheManager = new MutationCache();

export const queryClient = new QueryClient({
  queryCache: queryCacheManager,
  mutationCache: mutationCacheManager,
  defaultOptions: {
    queries: {
      networkMode: "offlineFirst",
    },

    mutations: {
      networkMode: "offlineFirst",
      onError(error) {
        console.error(error);
      },
    },
  },
});

export const persisterStorageQuery = createAsyncStoragePersister({
  storage: MMKVStoragePersister.getInstance(),
});

export function onAppStateChange(status: AppStateStatus) {
  focusManager.setFocused(status === "active");
}

export function useQueryCacheByKey<QueryTypeData = unknown>(key: QueryKey) {
  return queryCacheManager.find<QueryTypeData>({
    queryKey: key,
  });
}
