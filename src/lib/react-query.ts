import {
  MutationCache,
  QueryCache,
  QueryClient,
  type QueryKey,
  focusManager,
} from "@tanstack/react-query";
import type { AppStateStatus } from "react-native";

import { authControllerRefreshToken } from "@/api/okami";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { AxiosError } from "axios";
import { isUnauthorizedError } from "./axios";
import { STORAGE_KEYS } from "./storage";
import { MMKVStoragePersister, mmkvStorage } from "./storage/mmkv";

export const queryCacheManager = new QueryCache({
  onError: async (error, query) => {
    console.log("error", error.message);

    if (error instanceof AxiosError && isUnauthorizedError(error)) {
      console.log("init refresh token");

      const refreshToken = mmkvStorage.getString(STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        return;
      }

      const { token } = await authControllerRefreshToken({ refreshToken });

      mmkvStorage.set(STORAGE_KEYS.TOKEN, token);

      await query.fetch();
    }
  },
});
export const mutationCacheManager = new MutationCache({
  onError: (error) => {
    console.error(`error on mutation ${error.message} - ${error.stack}`);
  },
});

export const queryClient = new QueryClient({
  queryCache: queryCacheManager,
  mutationCache: mutationCacheManager,
  defaultOptions: {
    queries: {
      networkMode: "offlineFirst",
    },
    mutations: {
      networkMode: "offlineFirst",
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
