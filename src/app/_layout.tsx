import "react-native-reanimated";
import "../../global.css";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StatusBar } from "expo-status-bar";

import { asyncStoragePersister, queryClient } from "@/lib/react-query";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import * as SplashScreen from "expo-splash-screen";

import { Roboto_400Regular, Roboto_500Medium, Roboto_900Black, useFonts } from "@expo-google-fonts/roboto";
import { useEffect } from "react";

import { useAppListeners } from "@/hooks/useAppListeners";
import { OneSignal } from "react-native-onesignal";

void SplashScreen.preventAutoHideAsync();

OneSignal.initialize(process.env.EXPO_PUBLIC_ONE_SIGNAL_APP_ID!);

export default function RootLayout() {
  useAppListeners();

  const [fontsLoaded] = useFonts([Roboto_500Medium, Roboto_900Black, Roboto_400Regular]);

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return (
    <GluestackUIProvider mode="dark">
      <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: asyncStoragePersister }}>
        <ThemeProvider value={DarkTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
        </ThemeProvider>
      </PersistQueryClientProvider>
      <StatusBar style="dark" />
    </GluestackUIProvider>
  );
}
