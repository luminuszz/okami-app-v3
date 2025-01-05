import { Configuration, MMKV } from "react-native-mmkv";

import { AsyncStoragePersister } from ".";
import { expo } from "../../../app.json";

export const STORAGE_KEYS = {
  REFRESH_TOKEN: "auth.refresh-token",
  TOKEN: "auth.token",
  SYNC_WORK_DELAY_DATE: "user.okami-sync-work-delay-date",
  LAST_WORK_CLICKED: "user.okami-last-work-clicked",
} as const;

const mmkvConfig: Configuration = {
  id: `${expo.name}-storage-key`,
  encryptionKey: process.env.EXPO_STORAGE_ENCRYPTED_KEY,
};

export const mmkvStorage = new MMKV(mmkvConfig);

export class MMKVStoragePersister implements AsyncStoragePersister {
  getItem = async (key: string) => mmkvStorage.getString(key) ?? null;
  removeItem = async (key: string) => mmkvStorage.delete(key);
  setItem = async (key: string, value: string) => mmkvStorage.set(key, value);

  private static instance: MMKVStoragePersister;

  static getInstance(): MMKVStoragePersister {
    if (!MMKVStoragePersister.instance) {
      MMKVStoragePersister.instance = new MMKVStoragePersister();
    }

    return MMKVStoragePersister.instance;
  }
}
