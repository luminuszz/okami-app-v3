import {
  focusManager,
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import type { AppStateStatus } from "react-native";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { MMKVStoragePersister } from "./storage/mmkv";

export const queryCache = new QueryCache({});
export const mutationCache = new MutationCache({});

export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
});

export const persisterStorageQuery = createAsyncStoragePersister({
  storage: MMKVStoragePersister.getInstance(),
});

export function onAppStateChange(status: AppStateStatus) {
  focusManager.setFocused(status === "active");
}
