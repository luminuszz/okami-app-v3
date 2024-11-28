import "@/global.css";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider as JotaiProvider } from "jotai";
import { useEffect } from "react";

import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import "react-native-reanimated";

import { authControllerRefreshToken } from "@/api/okami";
import { isUnauthorizedError, okamiHttpGateway } from "@/lib/axios";
import { useStorage } from "@/lib/storage";
import { QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Text, View } from "react-native";
import { queryClient } from "../lib/react-query";

let isRefreshing = false;

type FailRequestQueue = {
  onSuccess: (newToken: string) => void;
  onFailure: (error: AxiosError) => void;
}[];

const failRequestQueue: FailRequestQueue = [];

export default function RootLayout() {
  const storageService = useStorage();

  const [loaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    Roboto_500Medium,
  });

  useEffect(() => {
    const interceptorId = okamiHttpGateway.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const refreshToken = await storageService.getString("REFRESH_TOKEN");

        if (isUnauthorizedError(error) && refreshToken) {
          if (!isRefreshing) {
            isRefreshing = true;

            authControllerRefreshToken({ refreshToken })
              .then(({ token }) => {
                storageService.set("TOKEN", token);

                failRequestQueue.forEach((request) => {
                  request.onSuccess(token);
                });
              })
              .catch((error) => {
                failRequestQueue.forEach((request) => {
                  request.onFailure(error);
                });
              })
              .finally(() => {
                isRefreshing = false;
              });
          }

          return new Promise((resolve, reject) => {
            failRequestQueue.push({
              onFailure: (error) => reject(error),
              onSuccess: (token) => {
                if (!error.config?.headers) return;

                error.config.headers.Authorization = `Bearer ${token}`;

                resolve(okamiHttpGateway(error.config));
              },
            });
          });
        }

        router.replace("/auth/sign-in");

        return Promise.reject(error);
      },
    );

    return () => {
      okamiHttpGateway.interceptors.response.eject(interceptorId);
    };
  }, [storageService]);

  if (!loaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Text>Okami app</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <GluestackUIProvider mode="dark">
          <ThemeProvider value={DarkTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </GluestackUIProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
}
