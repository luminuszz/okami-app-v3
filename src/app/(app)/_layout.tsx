import { useAuth } from "@/hooks/useAuth";
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
  const { isAuth } = useAuth();

  if (!isAuth) {
    return <Redirect href="/auth/sign-in" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
