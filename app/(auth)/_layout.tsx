import { Container } from "@/components/layout/container";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      initialRouteName="sign-in"
      screenLayout={({ children }) => <Container>{children}</Container>}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
