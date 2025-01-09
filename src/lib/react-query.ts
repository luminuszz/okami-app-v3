import {
  type Query,
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

let isRefreshing = false;

const queryQueue = new Map<
  string,
  Query<unknown, unknown, unknown, QueryKey>
>();

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    async onError(error, query) {
      console.log("init refresh token", error);

      console.log(
        "error",
        error instanceof AxiosError && isUnauthorizedError(error),
      );

      if (error instanceof AxiosError && isUnauthorizedError(error)) {
        await query.cancel();

        if (!isRefreshing) {
          isRefreshing = true;

          console.log("init refresh token");

          const refreshToken = mmkvStorage.getString(
            STORAGE_KEYS.REFRESH_TOKEN,
          );

          if (!refreshToken) {
            return;
          }

          try {
            const { token } = await authControllerRefreshToken({
              refreshToken,
            });

            mmkvStorage.set(STORAGE_KEYS.TOKEN, token);

            for (const [queryHash, query] of queryQueue.entries()) {
              await query.fetch();
              queryQueue.delete(queryHash);
            }
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            mmkvStorage.delete(STORAGE_KEYS.REFRESH_TOKEN);
          } finally {
            isRefreshing = false;
          }
        } else {
          queryQueue.set(query.queryHash, query);
        }
      }
    },
  }),
});

export const persisterStorageQuery = createAsyncStoragePersister({
  storage: MMKVStoragePersister.getInstance(),
});

export function onAppStateChange(status: AppStateStatus) {
  focusManager.setFocused(status === "active");
}
