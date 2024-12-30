import { useAuthControllerGetMe } from "@/api/okami";
import { useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/lib/react-query";
import { profileDrawerIsOpen } from "@/store/profile-drawer";
import { ToastProvider } from "@gluestack-ui/toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "expo-router";
import { useAtom } from "jotai";
import { Crown, ExternalLinkIcon } from "lucide-react-native";
import { Avatar, AvatarFallbackText, AvatarImage } from "../../ui/avatar";
import { Badge, BadgeIcon, BadgeText } from "../../ui/badge";
import { Button, ButtonIcon, ButtonText } from "../../ui/button";
import { Center } from "../../ui/center";
import { Drawer, DrawerBackdrop, DrawerBody, DrawerContent, DrawerFooter } from "../../ui/drawer";
import { Text } from "../../ui/text";
import { VStack } from "../../ui/vstack";
import { SyncWorksButton } from "./sync-works-button";
import { SyncWorksToNotionButton } from "./sync-works-to-notion-button";

export function ProfileDrawer() {
  const { logout } = useAuth();

  const [isOpen, setIsIOpen] = useAtom(profileDrawerIsOpen);

  const { data: user } = useAuthControllerGetMe();

  async function handleLogout() {
    setIsIOpen(false);
    logout();
    router.replace("/auth/sign-in");
  }

  return (
    <Drawer isOpen={isOpen} onClose={() => setIsIOpen(false)} size="md" anchor="bottom">
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerBody>
          <Center className="mt-5">
            <VStack space="md" className="items-center">
              <Avatar size="xl">
                {user?.avatarImageUrl ? (
                  <AvatarImage source={{ uri: user.avatarImageUrl }} />
                ) : (
                  <AvatarFallbackText>{user?.name}</AvatarFallbackText>
                )}
              </Avatar>

              <Text className="text-center text-xl text-typography-600">{user?.name}</Text>

              <Badge action="info" variant="outline" size="lg" className="justify-center rounded-lg">
                <BadgeIcon as={(props) => <Crown {...props} stroke="yellow" />} />

                <BadgeText className="ml-2 text-sm tracking-widest">Premium</BadgeText>
              </Badge>
            </VStack>
          </Center>

          <VStack space="md" className="mt-10">
            <ToastProvider>
              <QueryClientProvider client={queryClient}>
                <SyncWorksButton />
                <SyncWorksToNotionButton />
              </QueryClientProvider>
            </ToastProvider>
          </VStack>
        </DrawerBody>

        <DrawerFooter className="mb-10">
          <Button variant="solid" action="negative" className="mt-2 w-full" onPress={handleLogout}>
            <ButtonIcon as={ExternalLinkIcon} />
            <ButtonText>Sair</ButtonText>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
