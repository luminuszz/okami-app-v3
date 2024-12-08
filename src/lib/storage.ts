import AsyncStorage, { AsyncStorageStatic } from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
  REFRESH_TOKEN: "okami-refresh-token",
  TOKEN: "okami-token",
  SYNC_WORK_DELAY_DATE: "okami-sync-work-delay-date",
  LAST_WORK_CLICKED: "okami-last-work-clicked",
} as const;

type KeyOfStorageKeys = keyof typeof STORAGE_KEYS;

export const storage = AsyncStorage;

export interface Storage extends AsyncStorageStatic {
  set(key: KeyOfStorageKeys, value: string): Promise<void>;
  getString(key: KeyOfStorageKeys): Promise<string | null>;
}

export function useStorage(): Storage {
  async function set(key: KeyOfStorageKeys, value: string) {
    await storage.setItem(STORAGE_KEYS[key], value);
  }

  async function getString(key: KeyOfStorageKeys) {
    return storage.getItem(STORAGE_KEYS[key]);
  }

  return {
    ...storage,
    set,
    getString,
  };
}
