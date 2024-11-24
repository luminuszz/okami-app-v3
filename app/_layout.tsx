import "@/global.css";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Provider as JotaiProvider } from "jotai";
import { useEffect } from "react";

import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import "react-native-reanimated";

import { QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AppState } from "react-native";
import { onAppStateChange, queryClient } from "../lib/react-query";

SplashScreen.preventAutoHideAsync();

let isRefreshing = false;

type FailRequestQueue = {
  onSuccess: () => void;
  onFailure: (error: AxiosError) => void;
}[];

const failRequestQueue: FailRequestQueue = [];

export default function RootLayout() {
  const [loaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    Roboto_500Medium,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }

    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, [loaded]);

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <GluestackUIProvider mode="dark">
          <ThemeProvider value={DarkTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </GluestackUIProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
}
