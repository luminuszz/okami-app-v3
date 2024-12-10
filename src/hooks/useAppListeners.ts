import { focusManager, onlineManager } from "@tanstack/react-query";
import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

import * as Network from "expo-network";

export function useAppListeners() {
  function onAppStateChange(status: AppStateStatus) {
    focusManager.setFocused(status === "active");
  }

  useEffect(() => {
    onlineManager.setEventListener((setOnline) => {
      const subscription = Network.addNetworkStateListener((state) => {
        setOnline(state.isConnected ?? false);
      });

      return subscription.remove;
    });

    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);
}
