import { useNotificationControllerGetRecentNotifications } from "@/api/okami";
import { useUpdateNotificationSubscriberId } from "@/hooks/useUpdateNotificationSubscriberId";
import { Tabs } from "expo-router";
import { Bell, Book, House, UserRound } from "lucide-react-native";

export default function ApplicationTabLayout() {
  useUpdateNotificationSubscriberId();

  const { data: notifications = [] } = useNotificationControllerGetRecentNotifications();

  const unreadNotificationsCount = notifications?.filter((notification) => !notification?.readAt).length;

  return (
    <Tabs screenOptions={{ headerShown: false }} initialRouteName="index">
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <House size={size} stroke={color} className="size-4" />,
        }}
      />

      <Tabs.Screen
        name="works"
        options={{
          title: "Obras",
          tabBarIcon: ({ color, size }) => <Book size={size} stroke={color} className="size-4" />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <UserRound size={size} stroke={color} className="size-4" />,
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notificações",
          tabBarIcon: ({ color, size }) => <Bell size={size} stroke={color} className="size-4" />,
          tabBarBadge: unreadNotificationsCount || undefined,
        }}
      />
    </Tabs>
  );
}
