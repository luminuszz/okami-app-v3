import { MMKVStoragePersister } from "@/lib/storage/mmkv";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  focusManager,
} from "@tanstack/react-query";
import type { AppStateStatus } from "react-native";

export const queryCache = new QueryCache();
export const mutationCache = new MutationCache();

export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

export function onAppStateChange(status: AppStateStatus) {
  focusManager.setFocused(status === "active");
}

export const queryStoragePersister = createAsyncStoragePersister({
  storage: MMKVStoragePersister.getInstance(),
});
