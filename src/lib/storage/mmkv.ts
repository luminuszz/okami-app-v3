import { MMKV, Configuration } from "react-native-mmkv";

import { expo } from "../../../app.json";
import { useMMKV } from "react-native-mmkv";

export const STORAGE_KEYS = {
  REFRESH_TOKEN: "auth.refresh-token",
  TOKEN: "auth.token",
  SYNC_WORK_DELAY_DATE: "user.okami-sync-work-delay-date",
  LAST_WORK_CLICKED: "user.okami-last-work-clicked",
} as const;

const mmkvConfig: Configuration = {
  id: `${expo.name}-storage-key`,
};

export const mmkvStorage = new MMKV(mmkvConfig);

export const useMvStorage = () => useMMKV(mmkvConfig);
