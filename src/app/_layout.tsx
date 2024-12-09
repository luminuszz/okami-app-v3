import "react-native-reanimated";
import "../../global.css";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StatusBar } from "expo-status-bar";

import { useAxiosInterceptor } from "@/hooks/useAxiosInteceptor";
import { queryClient } from "@/lib/react-query";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

import * as SplashScreen from "expo-splash-screen";

import { Roboto_400Regular, Roboto_500Medium, Roboto_900Black, useFonts } from "@expo-google-fonts/roboto";
import { useEffect } from "react";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useAxiosInterceptor();

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
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
      <StatusBar style="inverted" />
    </GluestackUIProvider>
  );
}
