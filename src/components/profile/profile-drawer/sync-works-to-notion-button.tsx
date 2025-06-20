import { useScrappingReportControllerSyncToNotion } from "@/api/okami";
import { useOkamiToast } from "@/components/okami-toast";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Boxes } from "lucide-react-native";

export function SyncWorksToNotionButton() {
  const toast = useOkamiToast();

  const syncNotionMutation = useScrappingReportControllerSyncToNotion({
    mutation: {
      onSuccess() {
        toast({
          title: "Sincronizando obras com o notion",
          action: "info",
          description: "Suas obras estão sendo sincronizadas com o Notion.",
        });
      },
      onError() {
        toast({
          title: "Erro ao sincronizar obras",
          action: "error",
          description:
            "Houve um erro ao sincronizar suas obras com o Notion. Tente novamente mais tarde.",
        });
      },
    },
  });

  return (
    <Button
      variant="outline"
      isDisabled={syncNotionMutation.isPending}
      onPress={() => {
        syncNotionMutation.mutate();
      }}
    >
      <ButtonIcon as={Boxes} />
      <ButtonText>Buscar novas obras do Notion</ButtonText>
    </Button>
  );
}
