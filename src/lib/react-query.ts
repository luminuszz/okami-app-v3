import {
  QueryClient,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import { addNetworkStateListener } from "expo-network";
import { AppStateStatus, Platform } from "react-native";

export const queryClient = new QueryClient();

onlineManager.setEventListener((setOnline) => {
  const subscription = addNetworkStateListener((state) => {
    setOnline(state.isConnected ?? false);
  });

  return subscription.remove;
});

export function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}
