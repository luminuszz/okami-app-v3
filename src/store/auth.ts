import { storage, STORAGE_KEYS } from "@/lib/storage";
import { atom } from "jotai";
import { loadable } from "jotai/utils";

export const refreshTokenAtom = atom(async () => storage.getItem(STORAGE_KEYS.REFRESH_TOKEN));
export const tokenAtom = atom(async () => storage.getItem(STORAGE_KEYS.TOKEN));

export const checksAuthByRefreshTokenAtom = atom(async (get) => {
  const refreshToken = await get(refreshTokenAtom);
  return !!refreshToken;
});

export const isAuthAction = loadable(checksAuthByRefreshTokenAtom);
