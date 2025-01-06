import "react-native-reanimated";
import "../../global.css";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StatusBar } from "expo-status-bar";

import {
	onAppStateChange,
	persisterStorageQuery,
	queryClient,
} from "@/lib/react-query";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";

import * as SplashScreen from "expo-splash-screen";

import {
	Roboto_400Regular,
	Roboto_500Medium,
	Roboto_900Black,
	useFonts,
} from "@expo-google-fonts/roboto";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { addNetworkStateListener } from "expo-network";
import { useEffect } from "react";

import { AuthProvider } from "@/hooks/useAuth";
import { focusManager, onlineManager } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { AppState } from "react-native";
import { OneSignal } from "react-native-onesignal";

void SplashScreen.preventAutoHideAsync();
OneSignal.initialize(process.env.EXPO_PUBLIC_ONE_SIGNAL_APP_ID!);

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
		focusManager.setFocused(true);

		if (AppState.currentState === "active") {
			focusManager.setFocused(true);
		}

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
			<PersistQueryClientProvider
				persistOptions={{ persister: persisterStorageQuery }}
				client={queryClient}
			>
				<ThemeProvider value={DarkTheme}>
					<JotaiProvider>
						<AuthProvider>
							<Stack
								initialRouteName="index"
								screenOptions={{ headerShown: false }}
							/>
						</AuthProvider>
					</JotaiProvider>
				</ThemeProvider>
			</PersistQueryClientProvider>
			<StatusBar style="auto" />
		</GluestackUIProvider>
	);
}
