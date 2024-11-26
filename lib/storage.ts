import { MMKV, useMMKV } from "react-native-mmkv";

export const STORAGE_KEYS = {
  REFRESH_TOKEN: "okami-refresh-token",
  TOKEN: "okami-token",
} as const;

const databaseKey = "okami";

export const storage = new MMKV({ id: databaseKey });

export function useStorage() {
  return useMMKV({ id: databaseKey });
}
