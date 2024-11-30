import {
  useAuthControllerGetMe,
  useWorkControllerRefreshChapters,
  useWorkControllerSyncToNotion,
} from "@/api/okami";
import { DELAY_FOR_SYNC_WORKS_IN_HOURS } from "@/constants/delay";
import { STORAGE_KEYS } from "@/lib/storage";
import { profileDrawerIsOpen } from "@/store/profile-drawer";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { addHours, formatDistance, isBefore, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAtom } from "jotai";
import { Boxes, Crown, RefreshCcw } from "lucide-react-native";
import { useOkamiToast } from "../okami-toast";
import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar";
import { Badge, BadgeIcon, BadgeText } from "../ui/badge";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { Center } from "../ui/center";
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
} from "../ui/drawer";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

export function ProfileDrawer() {
  const toast = useOkamiToast();
  const storage = useAsyncStorage(STORAGE_KEYS.SYNC_WORK_DELAY_DATE);

  const [isOpen, setIsIOpen] = useAtom(profileDrawerIsOpen);

  const { data: user } = useAuthControllerGetMe();

  const syncNotionMutation = useWorkControllerSyncToNotion({
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
        storage.removeItem();
      },
    },
  });

  async function setNewDelay() {
    await storage.setItem(
      addHours(new Date(), DELAY_FOR_SYNC_WORKS_IN_HOURS).toISOString(),
    );
  }

  async function handleSyncWorks() {
    const dateIso = await storage.getItem();

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
    <Drawer
      isOpen={isOpen}
      onClose={() => setIsIOpen(false)}
      size="md"
      anchor="bottom"
    >
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerBody>
          <Center className="mt-5">
            <VStack space="md">
              <Avatar size="2xl">
                {user?.avatarImageUrl ? (
                  <AvatarImage source={{ uri: user.avatarImageUrl }} />
                ) : (
                  <AvatarFallbackText>{user?.name}</AvatarFallbackText>
                )}
              </Avatar>

              <Text className="text-center text-xl text-typography-600">
                {user?.name}
              </Text>

              <Badge
                action="info"
                variant="outline"
                size="lg"
                className="justify-center rounded-lg"
              >
                <BadgeIcon
                  as={(props) => <Crown {...props} stroke="yellow" />}
                />

                <BadgeText className="ml-2 text-sm tracking-widest">
                  Premium
                </BadgeText>
              </Badge>
            </VStack>
          </Center>

          <VStack space="md" className="mt-10">
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

            <Button
              variant="outline"
              disabled={syncAllWorksMutation.isPending}
              onPress={handleSyncWorks}
            >
              <ButtonIcon as={RefreshCcw} />
              <ButtonText>Sincronizar todas as obras</ButtonText>
            </Button>
          </VStack>
        </DrawerBody>

        <DrawerFooter className="mb-10"></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
