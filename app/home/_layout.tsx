import { useNotificationControllerGetRecentNotifications } from "@/api/okami";
import { Container } from "@/components/layout/container";
import { Tabs } from "expo-router";
import { Bell, BookMarked, UserRound } from "lucide-react-native";

export default function ApplicationTabLayout() {
  const { data: notifications = [] } =
    useNotificationControllerGetRecentNotifications();

  const unreadNotificationsCount = notifications?.filter(
    (notification) => !notification?.readAt,
  ).length;

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

      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notificações",
          tabBarIcon: ({ color, size }) => (
            <Bell size={size} stroke={color} className="size-4" />
          ),
          tabBarBadge: unreadNotificationsCount,
        }}
      />
    </Tabs>
  );
}
