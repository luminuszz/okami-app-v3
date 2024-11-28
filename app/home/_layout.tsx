import { Container } from "@/components/layout/container";
import { Tabs } from "expo-router";
import { BookMarked } from "lucide-react-native";

export default function ApplicationTabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      screenLayout={({ children }) => <Container>{children}</Container>}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Obras",
          tabBarIcon: ({ color, focused, size }) => (
            <BookMarked stroke={color} className="size-4" />
          ),
        }}
      />
    </Tabs>
  );
}
