import { useOkamiToast } from "@/components/okami-toast";
import { STORAGE_KEYS } from "@/lib/storage";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import Linking from "expo-linking";

export interface WorkParams {
  workUrl: string;
  workId: string;
}

export function useGoToWorkUrlAction() {
  const lastWorkClickedStorage = useAsyncStorage(STORAGE_KEYS.LAST_WORK_CLICKED);
  const toast = useOkamiToast();

  async function handlePushToUrl(data: WorkParams) {
    const canOpenUrl = await Linking.canOpenURL(data.workUrl);

    if (!canOpenUrl) {
      toast({
        title: "Erro ao abrir link",
        description: "Não foi possível abrir o link, tente novamente mais tarde.",
        action: "error",
      });

      return;
    }

    Linking.openURL(data?.workUrl)
      .catch(() => {
        toast({
          title: "Erro ao abrir link",
          description: "Não foi possível abrir o link, tente novamente mais tarde.",
          action: "error",
        });
      })
      .then(async () => {
        await lastWorkClickedStorage.setItem(data.workId);
      });
  }

  return handlePushToUrl;
}
