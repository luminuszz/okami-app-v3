import "react-native-reanimated";
import "../../global.css";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StatusBar } from "expo-status-bar";

import { queryClient } from "@/lib/react-query";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";

import * as SplashScreen from "expo-splash-screen";

import { Roboto_400Regular, Roboto_500Medium, Roboto_900Black, useFonts } from "@expo-google-fonts/roboto";
import { addNetworkStateListener } from "expo-network";
import { useEffect } from "react";

import { AuthProvider } from "@/hooks/useAuth";
import { onlineManager, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { OneSignal } from "react-native-onesignal";

void SplashScreen.preventAutoHideAsync();

OneSignal.initialize(process.env.EXPO_PUBLIC_ONE_SIGNAL_APP_ID!);

onlineManager.setEventListener((setOnline) => {
  const subscription = addNetworkStateListener((state) => {
    console.log("Network state changed", state);

    setOnline(!!state.isConnected);
  });

  return subscription.remove;
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts([Roboto_500Medium, Roboto_900Black, Roboto_400Regular]);

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return (
    <GluestackUIProvider mode="dark">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={DarkTheme}>
          <JotaiProvider>
            <AuthProvider>
              <Stack initialRouteName="index" screenOptions={{ headerShown: false }} />
            </AuthProvider>
          </JotaiProvider>
        </ThemeProvider>
      </QueryClientProvider>
      <StatusBar style="auto" />
    </GluestackUIProvider>
  );
}
