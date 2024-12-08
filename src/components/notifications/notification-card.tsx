import { NotificationHttp } from "@/api/models";
import {
  getNotificationControllerGetRecentNotificationsQueryKey,
  useNotificationControllerMarkNotificationAsRead,
} from "@/api/okami";
import { useQueryClient } from "@tanstack/react-query";
import { MotiView } from "moti";
import { Pressable } from "react-native";
import { Card } from "../ui/card";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface NotificationCardProps {
  notification: {
    id: string;
    content: any;
    readAt: string | null;
  };
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const client = useQueryClient();

  function updateCache(notificationId: string) {
    const queryKey = getNotificationControllerGetRecentNotificationsQueryKey();

    const oldCache = client.getQueryData(queryKey);

    client.setQueryData(queryKey, (notifications: NotificationHttp[]) =>
      notifications.map((notification) => {
        if (notification.id === notificationId) {
          return {
            ...notification,
            readAt: new Date().toISOString(),
          };
        }

        return notification;
      }),
    );

    return () => {
      client.setQueryData(queryKey, oldCache);
    };
  }

  const { mutate: markNotificationAsRead, isPending } = useNotificationControllerMarkNotificationAsRead({
    mutation: {
      onMutate({ notificationId }) {
        return updateCache(notificationId);
      },
      onError(_, __, rollback) {
        if (rollback) {
          rollback();
        }
      },
      mutationKey: ["markNotificationAsRead", notification.id],
    },
  });

  return (
    <Pressable
      onPress={() => {
        if (!isPending && !notification.readAt) {
          markNotificationAsRead({ notificationId: notification.id });
        }
      }}
    >
      <Card variant="filled" className="mt-2">
        <VStack space="xs">
          <Text className="text-md text-typography-600">{`Obra atualizada: ${notification.content?.name}`}</Text>
          <Text className="text-sm text-typography-900">
            {`${notification.content.category === "ANIME" ? "Episódio" : "Capítulo"} ${notification.content.chapter} disponível !`}
          </Text>
        </VStack>
        {!notification.readAt && (
          <HStack className="w- fixed -mb-2 mr-2 flex-1 items-end self-end">
            <MotiView
              from={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{
                type: "timing",
                duration: 1000,
                loop: true,
                repeatReverse: false,
              }}
              className="absolute z-10 h-[10px] w-[10px] self-end rounded-full bg-emerald-400"
            />
            <MotiView
              from={{ scale: 1 }}
              animate={{ scale: 1.3 }}
              transition={{
                type: "timing",
                duration: 1000,
                loop: true,
              }}
              className="z-9 absolute h-[10px] w-[10px] self-end rounded-full bg-emerald-600"
            />
          </HStack>
        )}
      </Card>
    </Pressable>
  );
}