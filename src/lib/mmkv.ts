import { MMKV, Configuration } from "react-native-mmkv";

import { expo } from "../../app.json";
import { useMMKV } from "react-native-mmkv";

const mmkvConfig: Configuration = {
  id: `${expo.name}-storage-key`,
};

export const mmkvStorage = new MMKV(mmkvConfig);

export const useMvStorage = () => useMMKV(mmkvConfig);
