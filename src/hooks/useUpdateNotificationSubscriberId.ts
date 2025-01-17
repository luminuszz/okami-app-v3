import {
  useAuthControllerGetMe,
  useNotificationControllerSubscribeInMobile,
} from "@/api/okami";
import { useOkamiToast } from "@/components/okami-toast";
import { STORAGE_KEYS } from "@/lib/storage";
import { mmkvStorage } from "@/lib/storage/mmkv";
import { useCallback, useEffect } from "react";
import { useMMKVBoolean } from "react-native-mmkv";
import { OneSignal } from "react-native-onesignal";

export function useUpdateNotificationSubscriberId() {
  const [userIsSubscribed, setUserIsSubscribed] = useMMKVBoolean(
    STORAGE_KEYS.USER_IS_SUBSCRIBED_IN_NOTIFICATIONS,
    mmkvStorage,
  );

  const { mutate: subscribeForNotifications, isPending } =
    useNotificationControllerSubscribeInMobile({
      mutation: {
        onError(e) {
          console.log(e);
        },
        onSuccess() {
          setUserIsSubscribed(true);
        },
      },
    });
  const toast = useOkamiToast();

  const { refetch: getUser } = useAuthControllerGetMe({
    query: { enabled: false, staleTime: Number.POSITIVE_INFINITY },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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

    if (subscriptionId && !userIsSubscribed) {
      subscribeForNotifications({ data: { token: subscriptionId } });
    }

    const { data: user } = await getUser();

    if (user) {
      OneSignal.login(user.id);
      OneSignal.User.addEmail(user.email);
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    OneSignal.User.pushSubscription.addEventListener(
      "change",
      ({ current }) => {
        if (current?.id && !isPending) {
          subscribeForNotifications({ data: { token: current.id } });
        }
      },
    );

    return () => {
      OneSignal.User.pushSubscription.removeEventListener("change", () => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);

  useEffect(() => {
    void checksUserSubscriptions();
  }, [checksUserSubscriptions]);
}
