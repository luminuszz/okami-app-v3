import { useNotificationControllerGetRecentNotifications } from "@/api/okami";
import { Container } from "@/components/layout/container";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";

import { FlatList } from "react-native";

import { HeaderWithGoBack } from "@/components/navigation/header-with-go-back";
import { NotificationCard } from "@/components/notifications/notification-card";

export default function Notifications() {
  const { data, refetch, isLoading } =
    useNotificationControllerGetRecentNotifications({
      query: {
        select(notifications) {
          return notifications?.sort((a) => (a.readAt ? 1 : -1));
        },
      },
    });

  return (
    <Container classname="mt-10 ">
      <VStack className="px-4">
        <HeaderWithGoBack>
          <Heading size="xl">Notificações</Heading>
        </HeaderWithGoBack>

        <Box className="mt-5 pb-12">
          <FlatList
            refreshing={isLoading}
            onRefresh={refetch}
            data={data}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <Box className="h-2" />}
            renderItem={({ item }) => (
              <NotificationCard
                notification={{
                  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                  content: item.content as any,
                  id: item.id,
                  readAt: item.readAt,
                }}
              />
            )}
          />
        </Box>
      </VStack>
    </Container>
  );
}
