import { QueryClient } from "@tanstack/react-query";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

export const queryClient = new QueryClient();

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});
