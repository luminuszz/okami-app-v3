import { MMKV, useMMKV } from "react-native-mmkv";

export const STORAGE_KEYS = {
  REFRESH_TOKEN: "okami-refresh-token",
  TOKEN: "okami-token",
} as const;

type KeyOfStorageKeys = keyof typeof STORAGE_KEYS;

const databaseKey = "okami";

export const storage = new MMKV({ id: databaseKey });

export interface Storage extends MMKV {
  set(key: KeyOfStorageKeys, value: string): void;
  getString(key: KeyOfStorageKeys): string | undefined;
}

export function useStorage(): Storage {
  function set(key: KeyOfStorageKeys, value: string) {
    storage.set(STORAGE_KEYS[key], value);
  }

  function getString(key: KeyOfStorageKeys) {
    return storage.getString(STORAGE_KEYS[key]);
  }

  const storage = useMMKV({ id: databaseKey });

  return {
    ...storage,
    set,
    getString,
  } as Storage;
}
