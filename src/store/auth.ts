import { authControllerGetMe, notificationControllerSubscribeInMobile } from "@/api/okami";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import { AxiosError } from "axios";
import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { OneSignal } from "react-native-onesignal";

export const refreshTokenAtom = atom(async () => storage.getItem(STORAGE_KEYS.REFRESH_TOKEN));
export const tokenAtom = atom(async () => storage.getItem(STORAGE_KEYS.TOKEN));

const checksUserSubscription = async (): Promise<[boolean, AxiosError | null]> => {
  let error: AxiosError | null = null;

  try {
    const subscriptionId = await OneSignal.User.pushSubscription.getIdAsync();

    if (subscriptionId) {
      await notificationControllerSubscribeInMobile({ token: subscriptionId });
    }

    error = null;

    return [true, error];
  } catch (e) {
    if (e instanceof AxiosError) {
      error = e;
    }

    return [false, error];
  }
};

export const checksAuthByRefreshTokenAtom = atom(async (get) => {
  const refreshToken = await get(refreshTokenAtom);

  if (!refreshToken) {
    return false;
  }

  const user = await authControllerGetMe();

  OneSignal.login(user.id);
  OneSignal.User.addEmail(user.email);

  await checksUserSubscription();

  return !!refreshToken;
});

export const isAuthAction = loadable(checksAuthByRefreshTokenAtom);
