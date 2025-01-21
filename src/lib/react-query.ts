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
});

export function onAppStateChange(status: AppStateStatus) {
  focusManager.setFocused(status === "active");
}
