import "@/global.css";
import "react-native-reanimated";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { useAxiosInterceptor } from "@/hooks/useAxiosInteceptor";
import { useStorage } from "@/lib/storage";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { queryClient } from "../lib/react-query";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useAxiosInterceptor();
  const storageService = useStorage();

  useEffect(() => {
    (async () => {
      const refreshToken = await storageService.getString("REFRESH_TOKEN");

      router.replace(refreshToken ? "/home" : "/auth/sign-in");

      SplashScreen.hideAsync();
    })();
  }, [storageService]);

  return (
    <GluestackUIProvider mode="dark">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={DarkTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="home" />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
      <StatusBar style="dark" />
    </GluestackUIProvider>
  );
}
