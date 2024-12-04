import { useNotificationControllerGetRecentNotifications } from "@/api/okami";
import { Container } from "@/components/layout/container";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Link } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

import { FlatList } from "react-native";

import { NotificationCard } from "@/components/notifications/notification-card";

export default function Notifications() {
  const { data, refetch, isFetching } = useNotificationControllerGetRecentNotifications({
    query: {
      select(notifications) {
        return notifications?.sort((a) => (a.readAt ? 1 : -1));
      },
    },
  });

  return (
    <Container classname="mt-10 ">
      <VStack className="px-4">
        <HStack className="items-center justify-between">
          <Heading size="2xl">Notificações</Heading>
          <Link href="/home" className="mr-4">
            <ChevronLeft stroke="white" size={30} />
          </Link>
        </HStack>

        <Box className="mt-5 px-3 pb-12">
          <FlatList
            refreshing={isFetching}
            onRefresh={refetch}
            data={data}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <Box className="h-2" />}
            renderItem={({ item }) => (
              <NotificationCard
                notification={{
                  content: item.content,
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
