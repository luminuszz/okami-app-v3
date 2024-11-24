import { MMKV } from "react-native-mmkv";

export const STORAGE_KEYS = {
  REFRESH_TOKEN: "okami-refresh-token",
  TOKEN: "okami-token",
} as const;

export const storage = new MMKV();
