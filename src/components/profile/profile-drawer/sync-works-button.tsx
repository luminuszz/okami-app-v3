import { useScrappingReportControllerRefreshChapters } from "@/api/okami";
import { useOkamiToast } from "@/components/okami-toast";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { DELAY_FOR_SYNC_WORKS_IN_HOURS } from "@/constants/time";
import { STORAGE_KEYS } from "@/lib/storage";
import { mmkvStorage } from "@/lib/storage/mmkv";
import { addHours, formatDistance, isBefore, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RefreshCcw } from "lucide-react-native";
import { useMMKVString } from "react-native-mmkv";

export function SyncWorksButton() {
  const toast = useOkamiToast();
  const [syncWorkDelayStorage, setSyncWorkDelayStorage] = useMMKVString(
    STORAGE_KEYS.SYNC_WORK_DELAY_DATE,
    mmkvStorage,
  );

  const syncAllWorksMutation = useScrappingReportControllerRefreshChapters({
    mutation: {
      onSuccess() {
        toast({
          title: "Atualizando obras",
          action: "info",
          description: "Suas obras estão sendo atualizadas",
        });
      },
      async onError() {
        toast({
          title: "Erro ao atualizar obras",
          action: "error",
        });
        setSyncWorkDelayStorage("");
      },
    },
  });

  function setNewDelay() {
    setSyncWorkDelayStorage(
      addHours(new Date(), DELAY_FOR_SYNC_WORKS_IN_HOURS).toISOString(),
    );
  }

  async function handleSyncWorks() {
    if (!syncWorkDelayStorage) {
      setNewDelay();

      syncAllWorksMutation.mutate();

      return;
    }

    const datePeriodDelay = parseISO(syncWorkDelayStorage);

    const hasDelay = isBefore(new Date(), datePeriodDelay);

    if (hasDelay) {
      const formattedDate = formatDistance(datePeriodDelay, new Date(), {
        locale: ptBR,
      });

      toast({
        title: "Você Já solicitou uma sincronização recentemente",
        action: "warning",
        description: `Tempo para uma nova sincronização: ${formattedDate}`,
      });

      return;
    }

    syncAllWorksMutation.mutate();

    setNewDelay();
  }

  return (
    <Button
      variant="outline"
      disabled={syncAllWorksMutation.isPending}
      onPress={handleSyncWorks}
    >
      <ButtonIcon as={RefreshCcw} />
      <ButtonText>Sincronizar todas as obras</ButtonText>
    </Button>
  );
}
