import { focusManager, MutationCache, QueryCache, QueryClient, QueryKey } from "@tanstack/react-query";

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { AppStateStatus } from "react-native";
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
  },
});

export const asyncStoragePersister = createAsyncStoragePersister({
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
