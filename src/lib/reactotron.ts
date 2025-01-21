import { mmkvStorage } from "@/lib/storage/mmkv";
import type { ReactotronReactNative } from "reactotron-react-native";
import Reactotron from "reactotron-react-native";
import mmkvPlugin from "reactotron-react-native-mmkv";

import {
  QueryClientManager,
  reactotronReactQuery,
} from "reactotron-react-query";

import { queryClient } from "@/lib/react-query";

const queryClientManager = new QueryClientManager({
  // @ts-ignore
  queryClient,
});

Reactotron.configure({
  onDisconnect: () => {
    queryClientManager.unsubscribe();
  },
})
  .useReactNative()
  .use(reactotronReactQuery(queryClientManager))
  .use(mmkvPlugin<ReactotronReactNative>({ storage: mmkvStorage }))
  .connect();
