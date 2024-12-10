import { authControllerGetMe, notificationControllerSubscribeInMobile } from "@/api/okami";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import { AxiosError } from "axios";
import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { OneSignal } from "react-native-onesignal";

export const refreshTokenAtom = atom(async () => storage.getItem(STORAGE_KEYS.REFRESH_TOKEN));
export const tokenAtom = atom(async () => storage.getItem(STORAGE_KEYS.TOKEN));

export const checksAuthByRefreshTokenAtom = atom(async (get) => {
  try {
    const refreshToken = await get(refreshTokenAtom);

    if (!refreshToken) {
      return false;
    }

    const user = await authControllerGetMe();

    OneSignal.login(user.id);
    OneSignal.User.addEmail(user.email);

    const subscriptionId = await OneSignal.User.pushSubscription.getIdAsync();

    if (subscriptionId) {
      await notificationControllerSubscribeInMobile({ token: subscriptionId });
    }

    return !!refreshToken;
  } catch (e) {
    if (e instanceof AxiosError) {
      console.log({ e });
    }
  }
});

export const isAuthAction = loadable(checksAuthByRefreshTokenAtom);
