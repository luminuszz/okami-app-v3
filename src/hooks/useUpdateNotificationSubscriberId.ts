import { useNotificationControllerSubscribeInMobile } from "@/api/okami";
import { useEffect } from "react";
import { OneSignal } from "react-native-onesignal";

export function useUpdateNotificationSubscriberId() {
  const { mutate, isPending } = useNotificationControllerSubscribeInMobile();

  useEffect(() => {
    OneSignal.User.pushSubscription.addEventListener("change", ({ current }) => {
      if (current?.id && !isPending) {
        mutate({ data: { token: current.id } });
      }
    });

    return () => {
      OneSignal.User.pushSubscription.removeEventListener("change", () => {
        console.log("remove listener");
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);
}
