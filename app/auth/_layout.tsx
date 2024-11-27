import { Container } from "@/components/layout/container";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenLayout={({ children }) => <Container>{children}</Container>}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
