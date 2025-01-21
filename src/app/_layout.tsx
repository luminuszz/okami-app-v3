import "react-native-reanimated";
import "../../global.css";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StatusBar } from "expo-status-bar";

import { onAppStateChange, queryClient } from "@/lib/react-query";
import { Slot } from "expo-router";

import * as SplashScreen from "expo-splash-screen";

import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_900Black,
  useFonts,
} from "@expo-google-fonts/roboto";
import { addNetworkStateListener } from "expo-network";
import { useEffect } from "react";

import { AuthProvider } from "@/hooks/useAuth";
import { env } from "@/lib/env";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClientProvider, onlineManager } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { AppState } from "react-native";
import { OneSignal } from "react-native-onesignal";

void SplashScreen.preventAutoHideAsync();

OneSignal.initialize(env.EXPO_PUBLIC_ONE_SIGNAL_APP_ID);

if (__DEV__) {
  require("@/lib/reactotron");
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts([
    Roboto_500Medium,
    Roboto_900Black,
    Roboto_400Regular,
  ]);

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    onlineManager.setEventListener((setOnline) => {
      const subscription = addNetworkStateListener((state) => {
        setOnline(!!state.isConnected);
      });

      return subscription.remove;
    });
  }, []);

  return (
    <GluestackUIProvider mode="dark">
      <ThemeProvider value={DarkTheme}>
        <QueryClientProvider client={queryClient}>
          <JotaiProvider>
            <AuthProvider>
              <Slot />
            </AuthProvider>
          </JotaiProvider>
        </QueryClientProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
