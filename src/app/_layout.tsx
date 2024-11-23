import "@/global.css";

import { GluestackUIProvider } from "@/src/components/ui/gluestack-ui-provider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
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

import { useColorScheme } from "@/src/hooks/useColorScheme";
import { QueryClientProvider } from "@tanstack/react-query";
import { AppState } from "react-native";
import { onAppStateChange, queryClient } from "../lib/react-query";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
        <GluestackUIProvider mode="light">
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </GluestackUIProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
}
