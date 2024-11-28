import { useNotificationControllerGetRecentNotifications } from "@/api/okami";
import { Container } from "@/components/layout/container";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Link } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { FlatList } from "react-native";

export default function Notifications() {
  const { data, refetch, isFetching } =
    useNotificationControllerGetRecentNotifications();

  return (
    <Container classname="mt-10 ">
      <VStack className="px-4">
        <HStack className="items-center justify-between">
          <Heading size="2xl">Notificações</Heading>
          <Link href="/home" className="mr-4">
            <ChevronLeft stroke="white" size={30} />
          </Link>
        </HStack>

        <Box className="mt-5 pb-12">
          <FlatList
            refreshing={isFetching}
            onRefresh={refetch}
            data={data}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <Box className="h-2" />}
            renderItem={({ item }) => (
              <Card variant="elevated">
                <VStack space="xs">
                  <Text className="text-md text-typography-600">{`Obra atualizada: ${item.content?.name}`}</Text>
                  <Text className="text-sm text-typography-400">
                    {`${item.content.category === "ANIME" ? "Episódio" : "Capítulo"} ${item.content.chapter} disponível !`}
                  </Text>
                </VStack>
              </Card>
            )}
          />
        </Box>
      </VStack>
    </Container>
  );
}
