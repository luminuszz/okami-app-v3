import { Container } from "@/components/layout/container";
import { Tabs } from "expo-router";
import { BookMarked, UserRound } from "lucide-react-native";

export default function ApplicationTabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      screenLayout={({ children }) => <Container>{children}</Container>}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Obras",
          tabBarIcon: ({ color, size }) => (
            <BookMarked size={size} stroke={color} className="size-4" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <UserRound size={size} stroke={color} className="size-4" />
          ),
        }}
      />
    </Tabs>
  );
}
