import { useWorkControllerRefreshChapters } from "@/api/okami";
import { useOkamiToast } from "@/components/okami-toast";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { DELAY_FOR_SYNC_WORKS_IN_HOURS } from "@/constants/delay";
import { STORAGE_KEYS } from "@/lib/storage";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { addHours, formatDistance, isBefore, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RefreshCcw } from "lucide-react-native";

export function SyncWorksButton() {
  const toast = useOkamiToast();
  const syncWorkDelayStorage = useAsyncStorage(
    STORAGE_KEYS.SYNC_WORK_DELAY_DATE,
  );

  const syncAllWorksMutation = useWorkControllerRefreshChapters({
    mutation: {
      onSuccess() {
        toast({
          title: "Atualizando obras",
          action: "info",
          description: "Suas obras estão sendo atualizadas",
        });
      },
      async onError(error) {
        console.log({ error });
        toast({
          title: "Erro ao atualizar obras",
          action: "error",
        });
        syncWorkDelayStorage.removeItem();
      },
    },
  });

  async function setNewDelay() {
    await syncWorkDelayStorage.setItem(
      addHours(new Date(), DELAY_FOR_SYNC_WORKS_IN_HOURS).toISOString(),
    );
  }

  async function handleSyncWorks() {
    const dateIso = await syncWorkDelayStorage.getItem();

    if (!dateIso) {
      await setNewDelay();

      syncAllWorksMutation.mutate();
      return;
    }

    const datePeriodDelay = parseISO(dateIso);

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
