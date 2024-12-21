import { useAuthControllerGetMe, useNotificationControllerSubscribeInMobile } from "@/api/okami";
import { useOkamiToast } from "@/components/okami-toast";
import { useCallback, useEffect } from "react";
import { OneSignal } from "react-native-onesignal";

export function useUpdateNotificationSubscriberId() {
  const { mutate: subscribeForNotifications, isPending } = useNotificationControllerSubscribeInMobile({
    mutation: {
      onError(e) {
        console.log(e);
      },
    },
  });
  const toast = useOkamiToast();

  const { refetch: getUser } = useAuthControllerGetMe({ query: { enabled: false, staleTime: Infinity } });

  const checksUserSubscriptions = useCallback(async () => {
    const hasPermissions = await OneSignal.Notifications.getPermissionAsync();

    if (!hasPermissions) {
      const permissions = await OneSignal.Notifications.requestPermission(true);

      if (!permissions) {
        toast({
          title: "Erro ao solicitar as permissões",
          action: "warning",
        });

        return;
      }
    }

    const subscriptionId = await OneSignal.User.pushSubscription.getIdAsync();

    if (subscriptionId) {
      subscribeForNotifications({ data: { token: subscriptionId } });
    }

    const { data: user } = await getUser();

    OneSignal.login(user!.id);
    OneSignal.User.addEmail(user!.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    OneSignal.User.pushSubscription.addEventListener("change", ({ current }) => {
      if (current?.id && !isPending) {
        subscribeForNotifications({ data: { token: current.id } });
      }
    });

    return () => {
      OneSignal.User.pushSubscription.removeEventListener("change", () => {
        console.log("remove listener");
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);

  useEffect(() => {
    void checksUserSubscriptions();
  }, [checksUserSubscriptions]);
}
